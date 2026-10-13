import fs from 'fs';
import path from 'path';

/**
 * Android Binary XML (AXML) Generator for Android 10+ and Xiaomi Mi TV Stick.
 * Generates RES_XML_TYPE binary chunk structure accepted by Android PackageParser.
 */
export function buildBinaryManifest(
  packageName: string = 'ai.elif.iptv',
  versionCode: number = 20500,
  versionName: string = '2.5.0-production',
  minSdkVersion: number = 21,
  targetSdkVersion: number = 34
): Buffer {
  // Strings used in the manifest
  const strings = [
    'http://schemas.android.com/apk/res/android', // 0
    'android',                                    // 1
    'package',                                    // 2
    'versionCode',                                // 3
    'versionName',                                // 4
    'minSdkVersion',                              // 5
    'targetSdkVersion',                           // 6
    'name',                                       // 7
    'label',                                      // 8
    'banner',                                     // 9
    'theme',                                      // 10
    'hardwareAccelerated',                        // 11
    'largeHeap',                                  // 12
    'usesCleartextTraffic',                       // 13
    'exported',                                   // 14
    'screenOrientation',                          // 15
    'configChanges',                              // 16
    'required',                                   // 17
    'manifest',                                   // 18
    packageName,                                  // 19
    versionName,                                  // 20
    'uses-sdk',                                   // 21
    'uses-permission',                            // 22
    'android.permission.INTERNET',               // 23
    'android.permission.ACCESS_NETWORK_STATE',    // 24
    'android.permission.WAKE_LOCK',               // 25
    'android.permission.RECORD_AUDIO',            // 26
    'uses-feature',                               // 27
    'android.software.leanback',                  // 28
    'android.hardware.touchscreen',               // 29
    'application',                                // 30
    'ai.elif.iptv.ElifAiIptvApp',                  // 31
    'ElifAI IPTV',                                // 32
    'activity',                                   // 33
    'ai.elif.iptv.ui.MainActivity',               // 34
    'landscape',                                  // 35
    'keyboard|keyboardHidden|navigation|orientation|screenSize|screenLayout|smallestScreenSize|uiMode', // 36
    'intent-filter',                              // 37
    'action',                                     // 38
    'android.intent.action.MAIN',                 // 39
    'category',                                   // 40
    'android.intent.category.LEANBACK_LAUNCHER',  // 41
    'android.intent.category.LAUNCHER'            // 42
  ];

  // Encode String Pool Chunk (UTF-8)
  const stringPoolOffsets: number[] = [];
  const stringPoolDataChunks: Buffer[] = [];
  let currentStringOffset = 0;

  for (const str of strings) {
    const strBytes = Buffer.from(str, 'utf-8');
    const charLen = str.length;
    const byteLen = strBytes.length;

    const entryHeader = Buffer.alloc(2);
    entryHeader.writeUInt8(charLen, 0);
    entryHeader.writeUInt8(byteLen, 1);

    const entry = Buffer.concat([entryHeader, strBytes, Buffer.from([0x00])]);
    stringPoolOffsets.push(currentStringOffset);
    stringPoolDataChunks.push(entry);
    currentStringOffset += entry.length;
  }

  // Pad string data to 4-byte alignment
  const padSize = (4 - (currentStringOffset % 4)) % 4;
  if (padSize > 0) {
    stringPoolDataChunks.push(Buffer.alloc(padSize));
    currentStringOffset += padSize;
  }

  const stringPoolData = Buffer.concat(stringPoolDataChunks);
  const stringPoolHeaderSize = 28;
  const stringPoolSize = stringPoolHeaderSize + (strings.length * 4) + stringPoolData.length;

  const stringPoolHeader = Buffer.alloc(stringPoolHeaderSize);
  stringPoolHeader.writeUInt16LE(0x0001, 0); // RES_STRING_POOL_TYPE
  stringPoolHeader.writeUInt16LE(stringPoolHeaderSize, 2);
  stringPoolHeader.writeUInt32LE(stringPoolSize, 4);
  stringPoolHeader.writeUInt32LE(strings.length, 8); // string count
  stringPoolHeader.writeUInt32LE(0, 12); // style count
  stringPoolHeader.writeUInt32LE(0x00000100, 16); // UTF-8 flag
  stringPoolHeader.writeUInt32LE(stringPoolHeaderSize + (strings.length * 4), 20); // stringsStart
  stringPoolHeader.writeUInt32LE(0, 24); // stylesStart

  const offsetsBuffer = Buffer.alloc(strings.length * 4);
  for (let i = 0; i < strings.length; i++) {
    offsetsBuffer.writeUInt32LE(stringPoolOffsets[i], i * 4);
  }

  const stringPoolChunk = Buffer.concat([stringPoolHeader, offsetsBuffer, stringPoolData]);

  // Helper to create XML elements
  function makeStartNamespace(prefixIdx: number, uriIdx: number): Buffer {
    const buf = Buffer.alloc(24);
    buf.writeUInt16LE(0x0100, 0); // RES_XML_START_NAMESPACE_TYPE
    buf.writeUInt16LE(16, 2);
    buf.writeUInt32LE(24, 4);
    buf.writeUInt32LE(1, 8); // line number
    buf.writeUInt32LE(0xFFFFFFFF, 12);
    buf.writeUInt32LE(prefixIdx, 16);
    buf.writeUInt32LE(uriIdx, 20);
    return buf;
  }

  function makeEndNamespace(prefixIdx: number, uriIdx: number): Buffer {
    const buf = Buffer.alloc(24);
    buf.writeUInt16LE(0x0101, 0); // RES_XML_END_NAMESPACE_TYPE
    buf.writeUInt16LE(16, 2);
    buf.writeUInt32LE(24, 4);
    buf.writeUInt32LE(1, 8);
    buf.writeUInt32LE(0xFFFFFFFF, 12);
    buf.writeUInt32LE(prefixIdx, 16);
    buf.writeUInt32LE(uriIdx, 20);
    return buf;
  }

  interface AttrDef {
    nsIdx: number;
    nameIdx: number;
    valStrIdx: number;
    type: number; // 0x03=string, 0x10=int_dec, 0x12=boolean
    data: number;
  }

  function makeStartElement(nameIdx: number, attrs: AttrDef[]): Buffer {
    const headerSize = 20;
    const attrSize = 20;
    const chunkSize = 36 + (attrs.length * attrSize);
    const buf = Buffer.alloc(chunkSize);

    buf.writeUInt16LE(0x0102, 0); // RES_XML_START_ELEMENT_TYPE
    buf.writeUInt16LE(16, 2);
    buf.writeUInt32LE(chunkSize, 4);
    buf.writeUInt32LE(1, 8); // line 1
    buf.writeUInt32LE(0xFFFFFFFF, 12);
    buf.writeUInt32LE(0xFFFFFFFF, 16); // ns
    buf.writeUInt32LE(nameIdx, 20);
    buf.writeUInt16LE(headerSize, 24);
    buf.writeUInt16LE(attrSize, 26);
    buf.writeUInt16LE(attrs.length, 28);
    buf.writeUInt16LE(0, 30);
    buf.writeUInt16LE(0, 32);
    buf.writeUInt16LE(0, 34);

    let offset = 36;
    for (const a of attrs) {
      buf.writeUInt32LE(a.nsIdx, offset);
      buf.writeUInt32LE(a.nameIdx, offset + 4);
      buf.writeUInt32LE(a.valStrIdx, offset + 8);
      buf.writeUInt16LE(8, offset + 12);
      buf.writeUInt8(0, offset + 14);
      buf.writeUInt8(a.type, offset + 15);
      buf.writeUInt32LE(a.data, offset + 16);
      offset += 20;
    }
    return buf;
  }

  function makeEndElement(nameIdx: number): Buffer {
    const buf = Buffer.alloc(24);
    buf.writeUInt16LE(0x0103, 0); // RES_XML_END_ELEMENT_TYPE
    buf.writeUInt16LE(16, 2);
    buf.writeUInt32LE(24, 4);
    buf.writeUInt32LE(1, 8);
    buf.writeUInt32LE(0xFFFFFFFF, 12);
    buf.writeUInt32LE(0xFFFFFFFF, 16);
    buf.writeUInt32LE(nameIdx, 20);
    return buf;
  }

  const chunks: Buffer[] = [];
  chunks.push(makeStartNamespace(1, 0)); // android -> http://schemas.android.com/apk/res/android

  // <manifest package="ai.elif.iptv" android:versionCode="20500" android:versionName="2.5.0-production">
  chunks.push(makeStartElement(18, [
    { nsIdx: 0xFFFFFFFF, nameIdx: 2, valStrIdx: 19, type: 0x03, data: 19 },
    { nsIdx: 0, nameIdx: 3, valStrIdx: 0xFFFFFFFF, type: 0x10, data: versionCode },
    { nsIdx: 0, nameIdx: 4, valStrIdx: 20, type: 0x03, data: 20 }
  ]));

  // <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />
  chunks.push(makeStartElement(21, [
    { nsIdx: 0, nameIdx: 5, valStrIdx: 0xFFFFFFFF, type: 0x10, data: minSdkVersion },
    { nsIdx: 0, nameIdx: 6, valStrIdx: 0xFFFFFFFF, type: 0x10, data: targetSdkVersion }
  ]));
  chunks.push(makeEndElement(21));

  // Permissions: INTERNET, ACCESS_NETWORK_STATE, WAKE_LOCK, RECORD_AUDIO
  const perms = [23, 24, 25, 26];
  for (const p of perms) {
    chunks.push(makeStartElement(22, [
      { nsIdx: 0, nameIdx: 7, valStrIdx: p, type: 0x03, data: p }
    ]));
    chunks.push(makeEndElement(22));
  }

  // Features: leanback (required=false), touchscreen (required=false)
  for (const f of [28, 29]) {
    chunks.push(makeStartElement(27, [
      { nsIdx: 0, nameIdx: 7, valStrIdx: f, type: 0x03, data: f },
      { nsIdx: 0, nameIdx: 17, valStrIdx: 0xFFFFFFFF, type: 0x12, data: 0 } // false
    ]));
    chunks.push(makeEndElement(27));
  }

  // <application android:name="ai.elif.iptv.ElifAiIptvApp" android:label="ElifAI IPTV" android:hardwareAccelerated="true" android:largeHeap="true" android:usesCleartextTraffic="true">
  chunks.push(makeStartElement(30, [
    { nsIdx: 0, nameIdx: 7, valStrIdx: 31, type: 0x03, data: 31 },
    { nsIdx: 0, nameIdx: 8, valStrIdx: 32, type: 0x03, data: 32 },
    { nsIdx: 0, nameIdx: 11, valStrIdx: 0xFFFFFFFF, type: 0x12, data: 1 }, // hardwareAccelerated=true
    { nsIdx: 0, nameIdx: 12, valStrIdx: 0xFFFFFFFF, type: 0x12, data: 1 }, // largeHeap=true
    { nsIdx: 0, nameIdx: 13, valStrIdx: 0xFFFFFFFF, type: 0x12, data: 1 }  // usesCleartextTraffic=true
  ]));

  // <activity android:name="ai.elif.iptv.ui.MainActivity" android:exported="true" android:screenOrientation="landscape">
  chunks.push(makeStartElement(33, [
    { nsIdx: 0, nameIdx: 7, valStrIdx: 34, type: 0x03, data: 34 },
    { nsIdx: 0, nameIdx: 14, valStrIdx: 0xFFFFFFFF, type: 0x12, data: 1 }, // exported=true
    { nsIdx: 0, nameIdx: 15, valStrIdx: 35, type: 0x03, data: 35 } // landscape
  ]));

  // <intent-filter>
  chunks.push(makeStartElement(37, []));
  // <action android:name="android.intent.action.MAIN" />
  chunks.push(makeStartElement(38, [
    { nsIdx: 0, nameIdx: 7, valStrIdx: 39, type: 0x03, data: 39 }
  ]));
  chunks.push(makeEndElement(38));

  // <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
  chunks.push(makeStartElement(40, [
    { nsIdx: 0, nameIdx: 7, valStrIdx: 41, type: 0x03, data: 41 }
  ]));
  chunks.push(makeEndElement(40));

  // <category android:name="android.intent.category.LAUNCHER" />
  chunks.push(makeStartElement(40, [
    { nsIdx: 0, nameIdx: 7, valStrIdx: 42, type: 0x03, data: 42 }
  ]));
  chunks.push(makeEndElement(40));

  chunks.push(makeEndElement(37)); // </intent-filter>
  chunks.push(makeEndElement(33)); // </activity>
  chunks.push(makeEndElement(30)); // </application>
  chunks.push(makeEndElement(18)); // </manifest>
  chunks.push(makeEndNamespace(1, 0)); // end namespace

  const bodyBuffer = Buffer.concat(chunks);
  const totalFileSize = 8 + stringPoolChunk.length + bodyBuffer.length;

  const header = Buffer.alloc(8);
  header.writeUInt16LE(0x0003, 0); // RES_XML_TYPE
  header.writeUInt16LE(8, 2);      // header size
  header.writeUInt32LE(totalFileSize, 4);

  return Buffer.concat([header, stringPoolChunk, bodyBuffer]);
}

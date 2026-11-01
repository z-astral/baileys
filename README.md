<div align="center">

<img src="https://files.catbox.moe/4rft6r.png" alt="@z-astral/baileys banner" width="100%" />

### Modded Baileys — Interactive Messages, AI Rich Responses, Albums & More

[![npm version](https://img.shields.io/npm/v/@z-astral/baileys?color=CB3837&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/@z-astral/baileys)
[![npm downloads](https://img.shields.io/npm/dm/@z-astral/baileys?color=CB3837&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/@z-astral/baileys)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![ESM](https://img.shields.io/badge/ESM-only-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)](#)

---

**A modded build of [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)**
with native support for interactive messages, album messages, unified rich responses, newsletter helpers, status mentions, and additional business/community utilities.

This repository is a **distribution/build repo** for `@z-astral/baileys`.
It ships compiled runtime files in `lib/` and protobuf artifacts in `WAProto/`, and is intended to be consumed directly from npm or as a vendored dependency inside the **Z-Astral** ecosystem.

</div>

---

## Table of Contents

- [@z-astral/baileys](#@z-astral/baileys)
  - [Modded Baileys v7 — Interactive Messages, AI Rich Responses, Albums & More](#modded-baileys-v7--interactive-messages-ai-rich-responses-albums--more)
  - [Table of Contents](#table-of-contents)
  - [✨ Features](#-features)
  - [✅ Requirements](#-requirements)
  - [🗂️ What’s Inside This Repo](#-whats-inside-this-repo)
  - [📦 Installation](#-installation)
    - [From NPM](#from-npm)
    - [Using Alias (Recommended for Z-Astral Bots)](#using-alias-recommended-for-z-astral-bots)
  - [🛠️ Quick Start](#️-quick-start)
    - [1. Project Setup](#1-project-setup)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Create `index.js`](#3-create-indexjs)
    - [4. Run](#4-run)
    - [5. Pairing Code Example](#5-pairing-code-example)
  - [🏗️ Architecture](#️-architecture)
    - [Socket Layer Chain](#socket-layer-chain)
    - [Key Modules](#key-modules)
    - [Build Repo Layout](#build-repo-layout)
    - [Connection Flow](#connection-flow)
  - [📡 Socket API Reference](#-socket-api-reference)
    - [Connection \& Authentication](#connection--authentication)
    - [VoIP (Voice Calls)](#voip-voice-calls)
    - [Message Sending](#message-sending)
    - [Interactive Messages](#interactive-messages)
    - [Album Messages](#album-messages)
    - [AI Rich Response Messages](#ai-rich-response-messages)
    - [Code Block V2 (Unified Response)](#code-block-v2-unified-response)
    - [Other Message Types](#other-message-types)
    - [Newsletter Methods](#newsletter-methods)
    - [Group Methods](#group-methods)
    - [Community Methods](#community-methods)
    - [Business Methods](#business-methods)
    - [Chat \& Profile Methods](#chat--profile-methods)
    - [Privacy Settings](#privacy-settings)
  - [📡 Event Reference](#-event-reference)
  - [🔧 Utility Exports](#-utility-exports)
  - [🏗️ Building This Package](#️-building-this-package)
  - [🔀 Differences from Official Baileys](#-differences-from-official-baileys)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

---

## ✨ Features

| Feature                     | Description                                                                            | Status |
| --------------------------- | -------------------------------------------------------------------------------------- | ------ |
| **VoIP Voice Calls**        | Native VoIP engine (WASM/WebRTC) via `VoipClient`, single shared socket                | ✅     |
| **Interactive Messages**    | Native flow buttons, list/select menus, button wrappers, carousel support via `Dugong` | ✅     |
| **Album Messages**          | Multi-image/video album relay with count metadata and grouped delivery                 | ✅     |
| **Rich Response Helpers**   | `sendTable`, `sendList`, `sendCodeBlock`, `sendRichMessage`, `sendUnifiedResponse`     | ✅     |
| **Unified Response V2**     | `sendTableV2`, `sendCodeBlockV2`, `sendLinkV2` with Meta-AI-style unified sections     | ✅     |
| **Link Messages**           | Rich inline links with citations, proofs, and forwarded bot context                    | ✅     |
| **Latex Rendering Hooks**   | `sendLatex`, `sendLatexImage`, `sendLatexInlineImage` helper APIs                      | ✅     |
| **Payment Messages**        | Request payment messages with note/sticker support                                     | ✅     |
| **Product / Catalog**       | Business product messages, catalog fetch/create/update/delete, cover photo helpers     | ✅     |
| **Event / Poll Result**     | Event message builders and poll result snapshots                                       | ✅     |
| **Newsletter Extras**       | URL resolve, metadata fetch, create/update, bulk follow, admin utilities, live updates | ✅     |
| **Communities & Groups**    | Community CRUD, linked groups, invite workflows, join approval, labels                 | ✅     |
| **Status Mention**          | `sendStatusMention()` helper to mention users/groups in status flows                   | ✅     |
| **LID & Session Handling**  | LID↔PN mapping, session migration, retry/session recreation helpers                    | ✅     |
| **Build Output Ready**      | Published runtime in `lib/` and protobuf artifacts in `WAProto/`                       | ✅     |
| **TypeScript Declarations** | Included `.d.ts` files for exported APIs and socket methods                            | ✅     |

---

## ✅ Requirements

- **Node.js** `>= 20.0.0`
- **ESM project** (`"type": "module"` in your `package.json`)
- A persistent auth store implementation for production use
- Optional helpers depending on your use case:
  - `pino` for logging
  - `qrcode-terminal` if you want to render QR codes in the terminal yourself
  - `sharp`, `jimp`, `audio-decode`, `link-preview-js` for optional media/rich utilities

> [!IMPORTANT]
> `@z-astral/baileys` is **ESM-only**. CommonJS projects will need migration or dynamic import wrappers.

---

## 📁 What’s Inside This Repo

This package is not the TypeScript source workspace. It contains the compiled distributable files you actually publish/use.

| Path                  | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `lib/`                | Main compiled runtime, types, socket layers, utilities |
| `WAProto/`            | Generated protobuf runtime and typings                 |
| `package.json`        | Published package metadata, dependencies, build script |
| `tsconfig.json`       | TypeScript config used for authoring/build pipeline    |
| `tsconfig.build.json` | Build-specific TS emit config targeting `lib/`         |
| `proto-extract/`      | Protobuf-related extraction/build assets               |

If you are documenting or integrating this project, treat `lib/index.js` and `lib/index.d.ts` as the primary public surface.

---

## 📦 Installation

### From NPM

```bash
npm install @z-astral/baileys
```

Recommended companion packages for examples in this README:

```bash
npm install pino qrcode-terminal
```

### Using Alias (Recommended for Z-Astral Bots)

Add to `package.json`:

```json
{
  "dependencies": {
    "astral": "npm:@z-astral/baileys@latest"
  }
}
```

Then run:

```bash
npm install
```

> [!TIP]
> Using the alias `astral` allows you to `import astral from 'astral'` without changing existing code.

> [!NOTE]
> Peer dependencies such as `sharp`, `jimp`, `audio-decode`, and `link-preview-js` are optional. Install only what your bot features need.

---

## 🛠️ Quick Start

### 1. Project Setup

```bash
mkdir my-bot && cd my-bot
npm init -y
```

Ensure `package.json` has `"type": "module"`:

```json
{
  "name": "my-bot",
  "type": "module",
  "dependencies": {
    "astral": "npm:@z-astral/baileys@latest"
  }
}
```

> [!IMPORTANT]
> **Required**: `"type": "module"` — @z-astral/baileys is ESM-only. Without this, imports will fail.

### 2. Install Dependencies

```bash
npm install @z-astral/baileys pino qrcode-terminal
```

### 3. Create `index.js`

```js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
} from "@z-astral/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

const logger = pino({ level: "silent" });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger,
    browser: Browsers.ubuntu("Chrome"),
    syncFullHistory: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    }
    if (connection === "open") console.log("Connected!");
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    if (text === ".ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "Pong!" });
    }
  });
}

startBot();
```

### 4. Run

```bash
node index.js
```

Scan the QR code, wait until the socket reaches `connection: "open"`, then send `.ping` to test.

### 5. Pairing Code Example

If you prefer pairing code over QR:

```js
const sock = makeWASocket({
  auth: state,
  logger,
  browser: Browsers.windows("Chrome"),
});

sock.ev.on("connection.update", async ({ connection }) => {
  if (connection === "connecting") {
    const code = await sock.requestPairingCode("6281234567890");
    console.log("Pairing code:", code);
  }
});
```

You can also provide your own custom pairing code:

```js
const code = await sock.requestPairingCode("6281234567890", "A1B2C3D4");
console.log("Custom pairing code:", code);
```

Custom pairing codes must be exactly `8` characters.

> [!WARNING]
> `printQRInTerminal` still exists in the type surface for compatibility, but it is **deprecated** in the current build. Prefer handling the `qr` value from `connection.update` yourself.

---

## 🏗️ Architecture

### Socket Layer Chain

Each socket layer extends the previous via composition, adding functionality from bottom to top:

```
makeSocket          → WebSocket + Noise protocol + pre-key management
  makeChatsSocket   → App state sync + chat modifications + profile
    makeGroupsSocket → Group CRUD + participant management
      makeMessagesSendSocket → Message sending + rich messages + relay
        makeMessagesRecvSocket → Message receiving + decryption + notifications
          makeBusinessSocket   → Product catalog + business profile
            makeCommunitiesSocket → Community CRUD + sub-groups
              makeNewsletterSocket → Newsletter follow/unfollow/metadata
                makeWASocket      ← TOP LEVEL EXPORT
```

### Key Modules

| Module       | Path            | Description                                                      |
| ------------ | --------------- | ---------------------------------------------------------------- |
| **Socket**   | `lib/Socket/`   | Connection, messaging, groups, newsletter, business, communities |
| **Signal**   | `lib/Signal/`   | Signal protocol: 1:1 encryption, group SenderKey, LID mapping    |
| **WABinary** | `lib/WABinary/` | Binary node encoding/decoding, JID utilities                     |
| **Utils**    | `lib/Utils/`    | Crypto, auth state, noise handler, rich messages, media          |
| **WAProto**  | `WAProto/`      | Compiled protobuf encode/decode                                  |
| **WAUSync**  | `lib/WAUSync/`  | User sync protocol (contact, device, LID)                        |
| **WAM**      | `lib/WAM/`      | WhatsApp analytics binary encoding                               |
| **Types**    | `lib/Types/`    | Full TypeScript type definitions                                 |

### Build Repo Layout

This repository does **not** currently expose a `src/` directory in the checked-in package tree.

That means:

- Documentation should reference **`lib/` as the public implementation**
- API discovery is best done through:
  - `lib/index.js`
  - `lib/index.d.ts`
  - `lib/Socket/*.d.ts`
  - `lib/Utils/*.d.ts`
- Consumers should treat this repo as a **ready-to-install runtime artifact**, not the authoring source tree

### Connection Flow

1. WebSocket connect → Noise XX handshake (Curve25519 + AES-256-GCM)
2. QR code or Pairing Code authentication
3. `CB:success` → upload pre-keys → send passive IQ → emit `connection: 'open'`
4. Store own LID↔PN mapping, migrate own session
5. Buffer events → process offline notifications → flush → `receivedPendingNotifications: true`

---

## 📡 Socket API Reference

### Connection & Authentication

```js
const sock = makeWASocket({
  auth: state,
  logger,
  browser: Browsers.ubuntu("Chrome"),
  version: [2, 3000, 1035194821],
  connectTimeoutMs: 20_000,
  defaultQueryTimeoutMs: 60_000,
  retryRequestDelayMs: 250,
  maxMsgRetryCount: 5,
  enableRecentMessageCache: true,
  enableAutoSessionRecreation: true,
  syncFullHistory: false,
  shouldIgnoreJid: (jid) => false,
  qrTimeout: 60_000,
  generateHighQualityLinkPreview: false,
});
```

**Pairing Code Authentication:**

```js
const sock = makeWASocket({
  auth: state,
  logger,
  browser: Browsers.windows("Chrome"),
});

sock.ev.on("connection.update", async ({ connection, qr, isNewLogin }) => {
  if (qr) {
  }
});

const code = await sock.requestPairingCode("6281234567890");
console.log("Pairing code:", code);
```

**Authentication State:**

```js
import { useMultiFileAuthState } from "@z-astral/baileys";

const { state, saveCreds } = await useMultiFileAuthState("./session");
```

**Custom Data Store / Memory Store Pattern:**

```js
import {
  BufferJSON,
  initAuthCreds,
  makeCacheableSignalKeyStore,
} from "@z-astral/baileys";

const credsStore = new Map();
const keyStoreData = new Map();

const creds = credsStore.get("creds") || initAuthCreds();

const keys = makeCacheableSignalKeyStore({
  get: async (type, ids) => {
    const data = {};
    for (const id of ids) {
      data[id] = keyStoreData.get(`${type}:${id}`);
    }
    return data;
  },
  set: async (data) => {
    for (const category in data) {
      for (const id in data[category]) {
        const value = data[category][id];
        const key = `${category}:${id}`;
        if (value == null) keyStoreData.delete(key);
        else keyStoreData.set(key, value);
      }
    }
  },
});

const state = { creds, keys };

const saveCreds = async () => {
  credsStore.set(
    "creds",
    JSON.parse(
      JSON.stringify(state.creds, BufferJSON.replacer),
      BufferJSON.reviver,
    ),
  );
};
```

This package does **not** currently ship a built-in `makeInMemoryStore()` helper.

Use these patterns instead:

- `useMultiFileAuthState()` for bot/local usage
- `initAuthCreds()` + custom `SignalKeyStore` for DB/Redis/in-memory persistence
- `makeCacheableSignalKeyStore()` when you want faster repeated key access with caching

> [!WARNING]
> `useMultiFileAuthState()` is convenient for bots and local testing, but the package itself warns against using it as your long-term production persistence layer. For production, write your own SQL/NoSQL-backed auth store.

**Useful companion helpers:**

```js
import {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@z-astral/baileys";

const { version, isLatest } = await fetchLatestBaileysVersion();
console.log(version, isLatest);
```

---

### VoIP (Voice Calls)

Modul VoIP kini terintegrasi langsung di `@z-astral/baileys` menggunakan `VoipClient` dan memanfaatkan *shared socket* (tanpa double pairing). Aset WebAssembly sudah built-in.

**Inisiasi VoIP Client:**

```js
import { VoipClient, CallState } from "@z-astral/baileys";

if (!global.voipClient) {
  global.voipClient = new VoipClient();
  await global.voipClient.connectWithSocket(sock);
  console.log("VoIP engine aktif!");
}
```

**Melakukan Panggilan:**

```js
try {
  const call = await global.voipClient.call("6281234567890", {
    durationMs: 60000,
    audioSource: "silence",
  });

  call.on("ringing", () => console.log("Berdering..."));
  call.on("connected", () => console.log("Terhubung!"));
  call.on("ended", (reason) => console.log("Panggilan berakhir:", reason));

  await call.waitForEnd();
} catch (e) {
  console.error("Gagal menelpon:", e);
}
```

---

### Message Sending

```js
await sock.sendMessage(jid, { text: "Hello!" });

await sock.sendMessage(jid, {
  text: "Hello @628xxx!",
  mentions: ["628xxx@s.whatsapp.net"],
});

await sock.sendMessage(jid, {
  image: { url: "./photo.jpg" },
  caption: "A photo",
});

await sock.sendMessage(jid, {
  video: { url: "./video.mp4" },
  caption: "A video",
  gifPlayback: false,
});

await sock.sendMessage(jid, {
  audio: { url: "./audio.ogg" },
  mimetype: "audio/ogg; codecs=opus",
  ptt: true,
});

await sock.sendMessage(jid, {
  sticker: { url: "./sticker.webp" },
});

await sock.sendMessage(
  jid,
  makeStickerPack({
    name: "Astral Starter Pack",
    publisher: "Astral",
    description: "Starter sticker pack",
    stickers: [
      { url: "./stickers/1.webp", emojis: ["🔥"] },
      { url: "./stickers/2.webp", emojis: ["😎"] },
    ],
    cover: { url: "./stickers/cover.webp" },
  }),
);

await sock.sendMessage(jid, {
  document: { url: "./file.pdf" },
  fileName: "document.pdf",
  mimetype: "application/pdf",
});

await sock.sendMessage(jid, {
  react: { key: msg.key, text: "👍" },
});

await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2,
    degreesLongitude: 106.8,
    name: "Jakarta",
  },
});

await sock.sendMessage(jid, {
  contacts: {
    displayName: "Contacts",
    contacts: [
      { vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:John\nTEL:+628xxx\nEND:VCARD" },
    ],
  },
});

await sock.sendMessage(jid, {
  poll: {
    name: "Vote!",
    values: ["Option A", "Option B", "Option C"],
    selectableCount: 1,
  },
});

await sock.sendMessage(jid, {
  forward: msg,
  forwardingScore: 1,
  isForwarded: true,
});

await sock.sendMessage(jid, { delete: msg.key });

await sock.sendMessage(jid, {
  text: "Edited text",
  edit: msg.key,
});
```

---

### Interactive Messages

**Native Flow Buttons:**

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: "Welcome!",
    footer: "Powered by Astral",
    buttons: [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Menu",
          id: "menu",
        }),
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Website",
          url: "https://example.com",
        }),
      },
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy Code",
          copy_code: "ASTRAL2025",
        }),
      },
    ],
    header: "Choose an option",
    image: { url: "https://example.com/banner.jpg" },
  },
});
```

**List Menu (single_select):**

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: "Select Category",
    footer: "Powered by Astral",
    buttons: [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Menu",
          sections: [
            {
              title: "Games",
              rows: [
                { title: "Quiz", id: ".quiz" },
                { title: "Tebak Gambar", id: ".tebakgambar" },
              ],
            },
            {
              title: "Tools",
              rows: [
                { title: "Sticker", id: ".sticker" },
                { title: "TTS", id: ".tts" },
              ],
            },
          ],
        }),
      },
    ],
    header: "Bot Menu",
  },
});
```

---

### Album Messages

```js
await sock.sendMessage(jid, {
  albumMessage: [
    { image: { url: "./photo1.jpg" }, caption: "First" },
    { image: { url: "./photo2.jpg" }, caption: "Second" },
    { video: { url: "./clip.mp4" }, caption: "Video" },
  ],
});
```

> [!NOTE]
> Albums automatically set `expectedImageCount` and `expectedVideoCount` based on array content.

---

### AI Rich Response Messages

Send messages styled like Meta AI — Rich HTML, interactive tables, syntax-highlighted code blocks, suggestion pills, and rich cards. All rendered natively via `botForwardedMessage` > `richResponseMessage`.

**1. Rich HTML Component (`sendRichHtml`):**

Send custom styled HTML5/CSS cards, analytics dashboards, and web views directly to the chat:

```javascript
await sock.sendRichHtml(
  jid,
  {
    id: "dashboard-01",
    title: "Server Analytics",
    html: `<div style="padding: 16px; background: #0f172a; color: #fff; border-radius: 12px; font-family: sans-serif;">
      <h3 style="color: #38bdf8; margin: 0 0 8px;">Node Status: ACTIVE</h3>
      <p style="color: #94a3b8; font-size: 14px; margin: 4px 0;">Penggunaan RAM: <b style="color: #4ade80;">1.4GB / 4GB</b></p>
      <p style="color: #94a3b8; font-size: 14px; margin: 4px 0;">Latency: <b style="color: #facc15;">24ms</b></p>
    </div>`,
    source: "monitoring_core"
  },
  quoted
);
```

**2. Fluent AI UI Builder (`ZRich`):**

The `ZRich` builder allows fluid composition of text, HTML, code blocks, native tables, and interactive suggestion chips:

```javascript
import { ZRich } from '@z-astral/baileys';

const rich = new ZRich(sock)
  .setTitle("Astral Assistant")
  .addText("Berikut adalah ringkasan sistem dan contoh kode:")
  .addHtml(`<div style="padding: 10px; background: #1e293b; color: #fff; border-radius: 8px;"><b>Status:</b> All systems operational</div>`)
  .addCode("javascript", `async function ping() {\n  return "pong";\n}`)
  .addTable(
    "Spesifikasi Server",
    ["Komponen", "Status"],
    [
      ["Database", "Connected"],
      ["WebSocket", "Listening"]
    ]
  )
  .addSuggest(["Jelaskan fungsi di atas", "Bagaimana cara deploy?"])
  .setFooter("Powered by @z-astral/baileys");

await rich.send(jid, { quoted });
```

**3. Table (with heading):**

```js
await sock.sendTable(
  jid,
  "Java vs JavaScript",
  ["Feature", "Java", "JavaScript"],
  [
    ["Type", "Compiled", "Interpreted"],
    ["Typing", "Static", "Dynamic"],
    ["Main Use", "Enterprise", "Web, Full-stack"],
  ],
  quoted,
  {
    headerText: "Comparison:",
    footer: "Hope this helps!",
  },
);
```

**List (without heading):**

```js
await sock.sendList(
  jid,
  "Bot Info",
  [
    ["Name", "Astral AI"],
    ["Version", "2.4.0"],
    ["Developer", "Zann"],
  ],
  quoted,
  { footer: "© Astral AI" },
);
```

**Code Block V1 (basic syntax highlighting):**

```js
await sock.sendCodeBlock(
  jid,
  `const greeting = "Hello World"
function sayHello(name) {
    return greeting + " " + name
}
sayHello("Astral")`,
  quoted,
  {
    language: "javascript",
    title: "Example Code",
    footer: "Powered by Astral",
  },
);
```

**Supported V1 languages:** `javascript`, `typescript`, `python`

**Table V2 (Unified Response):**

The V2 table uses the **unified response** format with `GenATableUXPrimitive` typename and base64-encoded data, matching the Meta AI rich response protocol.

**Features over V1:**

- String-based table input with flexible delimiters (`|` or `,` for columns, `;;` for rows)
- Unified response sections with `GenATableUXPrimitive` / `GenAIMarkdownTextUXPrimitive` typenames
- Dual output: `rows` (for submessages) + `unified_rows` (for sections)
- Enhanced `contextInfo` with `botMessageSharingInfo`

```js
await sock.sendTableV2(
  jid,
  [
    "Java vs JavaScript",
    "Feature | Java | JavaScript",
    "Type | Compiled | Interpreted;;Typing | Static | Dynamic;;Main Use | Enterprise | Web, Full-stack",
  ],
  quoted,
  {
    headerText: "Comparison:",
    text: "Here is a comparison table:",
    footer: "Hope this helps!",
  },
);
```

**Input format:**

- `table[0]` — title string
- `table[1]` — header row (columns separated by `|` or `,`)
- `table[2+]` — data rows (rows separated by `;;`, columns by `|` or `,`)

**V2 Options:**

| Option       | Type     | Default | Description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| `title`      | `string` | —       | Title (used if `headerText` not set)                 |
| `headerText` | `string` | —       | Text shown before the table                          |
| `text`       | `string` | —       | Markdown text section (GenAIMarkdownTextUXPrimitive) |
| `footer`     | `string` | —       | Text shown after the table                           |

---

### Code Block V2 (Unified Response)

The V2 code block uses the **unified response** format with `sections/view_model/primitive` structure and base64-encoded data, matching the Meta AI rich response protocol exactly.

**Features over V1:**

- 6 language families with keyword detection
- `/* */` block comment support
- `#` comment support for python/bash/lua
- Hex/binary/octal number literals
- Dual token output: numeric `codeBlock` + string-typed `unified_codeBlock`
- Unified response sections with `GenAICodeUXPrimitive` / `GenAIMarkdownTextUXPrimitive` typenames
- Enhanced `contextInfo` with `botMessageSharingInfo`

```js
await sock.sendCodeBlockV2(
  jid,
  `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  quoted,
  {
    language: "go",
    title: "Go Example",
    text: "Here is a Go code snippet:",
    footer: "Powered by Astral",
  },
);
```

**Supported V2 languages:**

| Language Key | Aliases                  |
| ------------ | ------------------------ |
| `javascript` | `js`, `typescript`, `ts` |
| `python`     | `py`                     |
| `go`         | `golang`                 |
| `lua`        | —                        |
| `bash`       | `sh`, `shell`            |

**V2 Options:**

| Option     | Type     | Default        | Description                                          |
| ---------- | -------- | -------------- | ---------------------------------------------------- |
| `language` | `string` | `'javascript'` | Programming language for syntax highlighting         |
| `title`    | `string` | —              | Title text shown before the code block               |
| `text`     | `string` | —              | Markdown text section (GenAIMarkdownTextUXPrimitive) |
| `footer`   | `string` | —              | Footer text shown after the code block               |

**V2 Token Types:**

| Code | V1 Name   | V2 Name   | Description                                        |
| ---- | --------- | --------- | -------------------------------------------------- |
| 0    | `DEFAULT` | `DEFAULT` | Normal text, whitespace, operators                 |
| 1    | `KEYWORD` | `KEYWORD` | Language keywords (`const`, `func`, `if`, etc.)    |
| 2    | `METHOD`  | `METHOD`  | Function/method calls (identifier followed by `(`) |
| 3    | `STRING`  | `STR`     | String literals (`"..."`, `'...'`, `` `...` ``)    |
| 4    | `NUMBER`  | `NUMBER`  | Numeric values (int, float, hex, binary, octal)    |
| 5    | `COMMENT` | `COMMENT` | Code comments and documentation blocks             |

---

### Link Message (Inline Embeds)

Send rich text with inline clickable links using `{{IE_N}}display_text{{/IE_N}}` placeholders, with optional citation metadata and verification proofs.

```js
await sock.sendLink(
  jid,
  "Upload results:\n✅ Freeimage\n🔗 Klik: {{IE_0}}link disini{{/IE_0}}\n✅ Yardsansh\n🔗 Klik: {{IE_1}}link disini{{/IE_1}}",
  ["https://example.com/upload1", "https://example.com/upload2"],
  quoted,
  {
    headerText: "📁 Media Uploader V3",
    footer: "✨ Selesai!",
    botJid: "867051314767696@bot",
    forwardingScore: 3,
    citations: [
      {
        sourceTitle: "Freeimage",
        citationNumber: 1,
        faviconCdnUrl: "https://cdn.example.com/favicon.ico",
      },
      { sourceTitle: "Yardsansh", citationNumber: 2 },
    ],
    proofs: [
      {
        version: 1,
        useCase: 1,
        signature: "base64signature==",
        certificateChain: ["base64cert1", "base64cert2"],
      },
    ],
  },
);
```

**Link Options:**

| Option            | Type         | Default                 | Description                           |
| ----------------- | ------------ | ----------------------- | ------------------------------------- |
| `headerText`      | `string`     | —                       | Text shown before the link content    |
| `footer`          | `string`     | —                       | Text shown after the link content     |
| `botJid`          | `string`     | `'867051314767696@bot'` | Bot JID for forwardedAiBotMessageInfo |
| `forwardingScore` | `number`     | `3`                     | Forward score for context info        |
| `citations`       | `Citation[]` | `[]`                    | Citation metadata entries             |
| `proofs`          | `Proof[]`    | `[]`                    | Verification proof entries            |

**Citation object:**

| Field            | Type     | Description                                  |
| ---------------- | -------- | -------------------------------------------- |
| `sourceQuery`    | `string` | Source query text                            |
| `faviconCdnUrl`  | `string` | CDN URL for favicon                          |
| `citationNumber` | `number` | Citation index (auto-incremented if omitted) |
| `sourceTitle`    | `string` | Title of the source                          |

**Proof object:**

| Field              | Type       | Description              |
| ------------------ | ---------- | ------------------------ |
| `version`          | `number`   | Proof version            |
| `useCase`          | `number`   | Use case identifier      |
| `signature`        | `string`   | Base64 signature         |
| `certificateChain` | `string[]` | Base64 certificate chain |

**Link V2 (search-result style):**

```js
await sock.sendLinkV2(
  jid,
  "Search results:\n- {{IE_0}}Official docs{{/IE_0}}\n- {{IE_1}}GitHub repo{{/IE_1}}",
  [
    {
      url: "https://www.npmjs.com/package/@z-astral/baileys",
      displayName: "Official docs",
      sourceDisplayName: "npm",
      sourceSubtitle: "package registry",
    },
    {
      url: "https://github.com/z-astral/baileys",
      displayName: "GitHub repo",
      sourceDisplayName: "github",
      sourceSubtitle: "source hosting",
    },
  ],
  quoted,
  {
    headerText: "@z-astral/baileys",
    footer: "Reference links",
    searchEngine: "MAME",
  },
);
```

---

### Other Message Types

**Payment Request:**

```js
await sock.sendMessage(jid, {
  requestPaymentMessage: {
    amount: 50000,
    currency: "IDR",
    note: "Payment for order #123",
    from: "628xxx@s.whatsapp.net",
  },
});
```

**Event:**

```js
await sock.sendMessage(jid, {
  eventMessage: {
    name: "Community Meetup",
    description: "Join us for the monthly meetup!",
    startTime: Date.now() + 86400000,
    endTime: Date.now() + 90000000,
    location: {
      name: "Jakarta",
      degreesLatitude: -6.2,
      degreesLongitude: 106.8,
    },
  },
});
```

**Poll Result:**

```js
await sock.sendMessage(jid, {
  pollResultMessage: {
    name: "Favorite Color?",
    pollVotes: [
      { optionName: "Red", optionVoteCount: 42 },
      { optionName: "Blue", optionVoteCount: 38 },
      { optionName: "Green", optionVoteCount: 25 },
    ],
  },
});
```

**Status with Mentions:**

```js
await sock.sendStatusMention({ text: "Big update coming!" }, [
  "628xxx@s.whatsapp.net",
  "groupid@g.us",
]);
```

**Product Message:**

```js
await sock.sendMessage(jid, {
  productMessage: {
    title: "Wireless Headphones",
    description: "High quality bluetooth headphones",
    productId: "WH-001",
    retailerId: "astral-shop",
    url: "https://example.com/product",
    priceAmount1000: 299000,
    currencyCode: "IDR",
    thumbnail: { url: "https://example.com/product.jpg" },
    body: "Check out this product!",
    footer: "Astral Shop",
    buttons: [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Buy Now",
          id: "buy_wh001",
        }),
      },
    ],
  },
});
```

**Mixed Rich Message (custom submessages):**

```js
await sock.sendRichMessage(
  jid,
  [
    { messageType: 2, messageText: "Here is some info:" },
    {
      messageType: 4,
      tableMetadata: {
        title: "Stats",
        rows: [
          { items: ["Metric", "Value"], isHeading: true },
          { items: ["Users", "1000"] },
          { items: ["Uptime", "99.9%"] },
        ],
      },
    },
    { messageType: 2, messageText: "And some code:" },
    {
      messageType: 5,
      codeMetadata: {
        codeLanguage: "javascript",
        codeBlocks: [{ highlightType: 0, codeContent: 'console.log("OK")' }],
      },
    },
  ],
  quoted,
);
```

**SubMessage Types:**

| messageType | Name          | Payload Field          |
| ----------- | ------------- | ---------------------- |
| 0           | UNKNOWN       | —                      |
| 1           | GRID_IMAGE    | `gridImageMetadata`    |
| 2           | TEXT          | `messageText`          |
| 3           | INLINE_IMAGE  | `imageMetadata`        |
| 4           | TABLE         | `tableMetadata`        |
| 5           | CODE          | `codeMetadata`         |
| 6           | DYNAMIC       | `dynamicMetadata`      |
| 7           | MAP           | `mapMetadata`          |
| 8           | LATEX         | `latexMetadata`        |
| 9           | CONTENT_ITEMS | `contentItemsMetadata` |

---

### Newsletter Methods

```js
const info = await sock.cekIDSaluran("https://whatsapp.com/channel/xxxxx");
console.log(info.name, info.subscribers);

await sock.newsletterMultipleFollow("id1@newsletter id2@newsletter");

const channels = await sock.newsletterFetchAllSubscribe();

await sock.newsletterAction("id@newsletter", "follow");

const nl = await sock.newsletterCreate("My Channel", "Description");

await sock.newsletterUpdate("id@newsletter", { name: "New Name" });

const { subscribers } = await sock.newsletterSubscribers("id@newsletter");

const meta = await sock.newsletterMetadata("jid", "id@newsletter");

await sock.newsletterFollow("id@newsletter");
await sock.newsletterUnfollow("id@newsletter");

await sock.newsletterMute("id@newsletter");
await sock.newsletterUnmute("id@newsletter");

await sock.newsletterUpdateName("id@newsletter", "New Name");
await sock.newsletterUpdateDescription("id@newsletter", "New Desc");
await sock.newsletterUpdatePicture("id@newsletter", mediaUpload);
await sock.newsletterRemovePicture("id@newsletter");

await sock.newsletterReactMessage("id@newsletter", serverId, "👍");

const msgs = await sock.newsletterFetchMessages("id@newsletter", 50, 0, 0);

const count = await sock.newsletterAdminCount("id@newsletter");
await sock.newsletterChangeOwner("id@newsletter", newOwnerJid);
await sock.newsletterDemote("id@newsletter", userJid);
await sock.newsletterDelete("id@newsletter");
```

---

### Group Methods

```js
const meta = await sock.groupMetadata("id@g.us");

const group = await sock.groupCreate("My Group", ["628xxx@s.whatsapp.net"]);

await sock.groupLeave("id@g.us");

await sock.groupUpdateSubject("id@g.us", "New Subject");
await sock.groupUpdateDescription("id@g.us", "New Description");

const result = await sock.groupParticipantsUpdate(
  "id@g.us",
  ["628xxx@s.whatsapp.net"],
  "add",
);

const requests = await sock.groupRequestParticipantsList("id@g.us");
await sock.groupRequestParticipantsUpdate(
  "id@g.us",
  ["628xxx@s.whatsapp.net"],
  "approve",
);

const code = await sock.groupInviteCode("id@g.us");
await sock.groupRevokeInvite("id@g.us");
await sock.groupAcceptInvite("ABCDE12345");
const info = await sock.groupGetInviteInfo("ABCDE12345");

await sock.groupSettingUpdate("id@g.us", "announcement");
await sock.groupSettingUpdate("id@g.us", "locked");

await sock.groupMemberAddMode("id@g.us", "admin_add");
await sock.groupJoinApprovalMode("id@g.us", "on");

await sock.groupToggleEphemeral("id@g.us", 86400);

const groups = await sock.groupFetchAllParticipating();

await sock.updateMemberLabel("id@g.us", "VIP");
```

---

### Community Methods

```js
const meta = await sock.communityMetadata("communityid@g.us");

const community = await sock.communityCreate(
  "Our Community",
  "Community description",
);

const subgroup = await sock.communityCreateGroup(
  "Announcements",
  ["628xxx@s.whatsapp.net"],
  "communityid@g.us",
);

await sock.communityLinkGroup("groupid@g.us", "communityid@g.us");
await sock.communityUnlinkGroup("groupid@g.us", "communityid@g.us");

const linked = await sock.communityFetchLinkedGroups("communityid@g.us");

const code = await sock.communityInviteCode("communityid@g.us");
await sock.communityRevokeInvite("communityid@g.us");
await sock.communityAcceptInvite(code);
const inviteInfo = await sock.communityGetInviteInfo(code);

const requests =
  await sock.communityRequestParticipantsList("communityid@g.us");
await sock.communityRequestParticipantsUpdate(
  "communityid@g.us",
  ["628xxx@s.whatsapp.net"],
  "approve",
);
await sock.communityParticipantsUpdate(
  "communityid@g.us",
  ["628xxx@s.whatsapp.net"],
  "add",
);

await sock.communityUpdateSubject("communityid@g.us", "New Subject");
await sock.communityUpdateDescription("communityid@g.us", "New Description");
await sock.communityToggleEphemeral("communityid@g.us", 86400);
await sock.communitySettingUpdate("communityid@g.us", "announcement");
await sock.communityMemberAddMode("communityid@g.us", "admin_add");
await sock.communityJoinApprovalMode("communityid@g.us", "on");

await sock.communityLeave("communityid@g.us");
const communities = await sock.communityFetchAllParticipating();
```

---

### Business Methods

```js
const { products, nextPageCursor } = await sock.getCatalog({
  jid: "628xxx@s.whatsapp.net",
  limit: 10,
});

const { collections } = await sock.getCollections("628xxx@s.whatsapp.net", 10);

const order = await sock.getOrderDetails(orderId, tokenBase64);

const product = await sock.productCreate({
  name: "Premium Package",
  description: "Official premium plan",
  price: 150000,
  currency: "IDR",
  originCountryCode: "ID",
  images: [mediaUpload],
});

await sock.productUpdate(product.id, {
  name: "Premium Package Plus",
  description: "Official premium plan plus",
  price: 175000,
  currency: "IDR",
  images: [mediaUpload],
});

await sock.productDelete([product.id]);

await sock.updateBusinessProfile({
  address: "Jakarta, Indonesia",
  description: "Official store",
  websites: ["https://example.com"],
  email: "hello@example.com",
  hours: {
    timezone: "Asia/Jakarta",
    days: [{ day: "mon", mode: "open_24h" }],
  },
});

await sock.updateBussinesProfile({
  description: "Legacy alias still works",
});

await sock.updateCoverPhoto(mediaUpload);
await sock.removeCoverPhoto(coverId);

await sock.addOrEditQuickReply({
  shortcut: "hello",
  message: "Hello from business account",
});

await sock.removeQuickReply(timestamp);
```

---

### Chat & Profile Methods

```js
const url = await sock.profilePictureUrl(jid, "image");
await sock.updateProfilePicture(jid, mediaUpload);
await sock.removeProfilePicture(jid);

await sock.updateProfileName("My Name");
await sock.updateProfileStatus("Available");

await sock.sendPresenceUpdate("available", jid);
await sock.presenceSubscribe(jid);

await sock.readMessages([msg.key]);
await sock.sendReceipt(jid, participant, [msgId], "read");

await sock.updateBlockStatus(jid, "block");
await sock.updateBlockStatus(jid, "unblock");

const list = await sock.fetchBlocklist();

await sock.chatModify(
  {
    archive: true,
    lastMessageOrig: msg,
    lastMessage: msg,
  },
  jid,
);

await sock.star(jid, [{ id: msgId, fromMe: true }], true);

await sock.addOrEditContact(jid, { displayName: "Name" });
await sock.removeContact(jid);

await sock.addChatLabel(jid, labelId);
await sock.removeChatLabel(jid, labelId);
await sock.addMessageLabel(jid, messageId, labelId);

await sock.resyncAppState(["regular", "critical_block"], true);

const biz = await sock.getBusinessProfile(jid);
```

---

### Privacy Settings

```js
await sock.updateLastSeenPrivacy("all");
await sock.updateOnlinePrivacy("all");
await sock.updateProfilePicturePrivacy("contacts");
await sock.updateStatusPrivacy("contacts");
await sock.updateReadReceiptsPrivacy("all");
await sock.updateGroupsAddPrivacy("all");
await sock.updateMessagesPrivacy("all");
await sock.updateCallPrivacy("everyone");
await sock.updateDefaultDisappearingMode(86400);
await sock.updateDisableLinkPreviewsPrivacy(true);
```

---

## 📡 Event Reference

```js
sock.ev.on('connection.update', ({ connection, lastDisconnect, qr, isNewLogin, receivedPendingNotifications, isOnline }) => {})
sock.ev.on('creds.update', (update) => {})
sock.ev.on('messaging-history.set', ({ chats, contacts, messages, isLatest }) => {})
sock.ev.on('chats.upsert', (chats) => {})
sock.ev.on('chats.update', (updates) => {})
sock.ev.on('chats.delete', (jids) => {})
sock.ev.on('contacts.upsert', (contacts) => {})
sock.ev.on('contacts.update', (updates) => {})
sock.ev.on('messages.upsert', ({ messages, type }) => {})
sock.ev.on('messages.update', (updates) => {})
sock.ev.on('messages.delete', (keys) => {})
sock.ev.on('messages.reaction', (reactions) => {})
sock.ev.on('message-receipt.update', (updates) => {})
sock.ev.on('groups.update', (updates) => {})
sock.ev.on('group-participants.update', (update) => {})
sock.ev.on('group.join-request', (update) => {})
sock.ev.on('call', (calls) => {})
sock.ev.on('labels.edit', (label) => {})
sock.ev.on('labels.associations', ({ associated, label, type }) => {})
sock.ev.on('newsletter.update', (updates) => {})
sock.ev.on('newsletter.follow', (jid) => {})
sock.ev.on('newsletter.unfollow', (jid) => {})
sock.ev.on('settings.update', ({ isAutoEmojiEnabled, isReadReceiptsEnabled, ... }) => {})
```

---

## 🔧 Utility Exports

```js
import {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  initAuthCreds,
  BufferJSON,
  fetchLatestBaileysVersion,

  tokenizeCode,
  tokenizeCodeV2,
  CodeHighlightType,
  RichSubMessageType,

  generateTableContent,
  generateTableContentV2,
  toTableMetadataV2,
  generateListContent,
  generateCodeBlockContent,
  generateCodeBlockContentV2,
  generateLinkContent,
  generateLinkContentV2,
  generateRichMessageContent,
  generateLatexContent,
  generateLatexImageContent,
  generateLatexInlineImageContent,
  generateUnifiedResponseContent,
  captureUnifiedResponse,

  buildRichContextInfo,
  buildBotForwardedMessage,

  makeStickerPack,

  JS_KEYWORDS,
  PYTHON_KEYWORDS,
  GO_KEYWORDS,
  LUA_KEYWORDS,
  BASH_KEYWORDS,
  LANGUAGE_KEYWORDS,

  Curve,
  signedKeyPair,
  aesEncryptGCM,
  aesDecryptGCM,

  jidEncode,
  jidDecode,
  jidNormalizedUser,
  areJidsSameUser,
  isJidGroup,
  isJidNewsletter,
  isLidUser,
  isPnUser,
  isJidBot,
  isJidMetaAI,
  isJidBroadcast,
  isJidStatusBroadcast,

  DisconnectReason,
  Browsers,

  Dugong,

  WASocket,
} from "@z-astral/baileys";
```

> [!NOTE]
> In this build, some advanced helper typings may appear first in `lib/Socket/messages-send.d.ts` before they are reflected everywhere else in aggregated socket declarations. If your editor autocomplete lags behind runtime behavior, inspect `lib/Socket/messages-send.js` and `lib/Utils/rich-messages.d.ts` for the most complete helper surface.

---

## 🏗️ Building This Package

This repository ships compiled files, but it still includes the build script used to emit/update `lib/`.

```bash
npm install
npm run build
```

What the build does:

- runs TypeScript with `tsconfig.build.json`
- emits JavaScript and declaration files into `lib/`
- runs `tsc-esm-fix` so generated ESM imports resolve cleanly

Important build notes:

- `tsconfig.json` is authoring-oriented and uses `noEmit: true`
- `tsconfig.build.json` flips emit back on and excludes test files
- published package files are limited to `lib/**/*` and `WAProto/**/*`

---

## 🔀 Differences from Official Baileys

| Area                 | Official Baileys v7 | @z-astral/baileys                            |
| -------------------- | ------------------- | ---------------------------------------- |
| Interactive messages | No native support   | Full support via Dugong                  |
| Album messages       | Not supported       | Multi-media albums                       |
| AI Rich Response     | Not available       | Table, code block, rich text             |
| Table V1             | Not available       | Basic table with headers                 |
| Table V2             | Not available       | Unified response + GenATableUXPrimitive  |
| Code Block V1        | Not available       | Syntax highlighting (JS/TS/Python)       |
| Code Block V2        | Not available       | Unified response + 6 languages           |
| Link Message         | Not available       | Inline embeds + citations + verification |
| Business nodes       | Manual injection    | Auto-inject on relay                     |
| Newsletter extras    | Basic only          | Auto-follow, bulk follow, URL resolve    |
| Button detection     | Not available       | `getButtonType()` auto-detect            |
| Payment messages     | Not supported       | Full support                             |
| Event messages       | Basic               | Enhanced all fields                      |
| Status mentions      | Not available       | `sendStatusMention()`                    |
| Product messages     | Not supported       | Catalog + buttons                        |
| LID support          | Basic               | Full LID↔PN mapping + session migration  |
| Identity changes     | No handling         | Debounced session refresh                |
| Message retry        | Basic               | `MessageRetryManager` with cache         |

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'feat: add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open a Pull Request

---

## 📄 License

MIT © [Z-Astral](https://github.com/z-astral)

> [!CAUTION]
> This library is for **educational purposes**. Ensure compliance with WhatsApp Terms of Service.

---

<div align="center">

**Made with 💚 by Zann**

[⭐ Star this repo](https://github.com/z-astral/baileys) · [🐛 Report Bug](https://github.com/z-astral/baileys/issues) · [💡 Request Feature](https://github.com/z-astral/baileys/issues)

</div>

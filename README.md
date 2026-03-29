# ChatGPT Export Explorer

Browse and search your full ChatGPT conversation history — entirely in your browser. No uploads, no server, no account required.

## Privacy guarantee

**Your data never leaves your device.** This application runs 100% client-side. Your conversations are parsed and stored in your browser's local storage (IndexedDB). There is no backend, no database, no telemetry, and no network requests involving your data. You can verify this yourself by opening your browser's Network tab while using the app.

For maximum privacy, self-deploy your own instance using the instructions below rather than using any hosted version.

---

## One-click deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danshorstein/chatgpt-export-explorer)

This creates your own private instance. You control the code and the deployment.

---

## Self-deploy (manual)

1. Fork this repository on GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New → Project**
4. Import your forked repository
5. Leave all settings as default and click **Deploy**
6. Done — your private instance is live

No developer experience required.

---

## How to export your ChatGPT data

1. Open ChatGPT and go to **Settings → Data controls**
2. Click **Export data** and confirm
3. Wait for an email from OpenAI (usually within a few minutes)
4. Download the ZIP file — it contains your full conversation history
5. Drop the ZIP into the app and start exploring

---

## Features

- **Thread Library** — browse all conversations as cards, newest first
- **Thread View** — read any conversation as a clean chat interface
- **Timeline** — every message you've ever sent, in chronological order
- **Full-text search** — fuzzy search across all conversations and messages
- **Offline-first** — data persists in IndexedDB; no re-upload needed on return visits
- **Import merging** — import newer exports to add new conversations without losing old ones
- **Attachment detection** — messages with file attachments are flagged
- **Branch awareness** — ChatGPT's edited/branched conversations are resolved correctly

---

## Technical overview

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| ZIP parsing | JSZip |
| Full-text search | MiniSearch |
| Local persistence | Dexie.js (IndexedDB) |
| Testing | Vitest |
| Deployment | Vercel (static) |

The most complex piece is the **tree resolver** (`src/parser/treeResolver.ts`), which converts ChatGPT's non-linear conversation graph (a DAG where each edit creates a new branch) into a clean linear message sequence. It is unit-tested with 10 edge cases including null nodes, empty content, null timestamps, and attachment metadata.

---

## Local development

```bash
npm install
npm run dev      # starts dev server at localhost:5173
npm test         # run unit tests
npm run build    # production build to dist/
```

---

## Contributing

Contributions welcome. Open an issue first for significant changes.

Areas where help is especially appreciated:
- Support for Claude, Gemini, and other AI export formats
- Dark mode
- Export to Markdown / PDF
- Keyboard navigation and accessibility improvements
- Translations

---

## License

MIT

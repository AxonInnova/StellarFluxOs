# StellarFlux OS

> A browser-based OS demo with draggable windows, terminal, notepad, mini-game, and a secret room. Built by [AxonInnova](https://dsc.gg/axoninnova) — founded by Nubprogrammer.

## Features

- **Desktop Shell**: Draggable and resizable windows with z-index management
- **Terminal**: xterm.js integration with commands (`help`, `scan`, `readlog`, `stellar-key`)
- **Notepad**: Textarea with auto-save to localStorage
- **Logs Viewer**: Read static log files
- **Mini-Game**: Phaser 3-powered node connection puzzle
- **Secret Room**: Unlocked via terminal command or game win
- **Persistence**: Window state, terminal history, and notepad content saved to localforage
- **Keyboard Shortcuts**: `Ctrl+`` to open terminal, `Esc` to close focused window

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **xterm.js** for terminal emulation
- **Phaser 3** for mini-game
- **react-rnd** for draggable/resizable windows
- **localforage** for persistent storage

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
StellarFluxOs/
├─ .devcontainer/        # Dev container config (Node 18 + VS Code extensions)
├─ .github/workflows/    # Vercel CI/CD
├─ public/               # Static assets
├─ src/
│  ├─ components/        # React components (WindowShell, Dock, Terminal, Notepad, Logs, Game)
│  ├─ utils/             # Storage utilities (localforage wrapper)
│  ├─ assets/            # Fonts, icons, log files
│  ├─ App.jsx            # Main app logic
│  ├─ main.jsx           # Entry point
│  └─ index.css          # Global styles + Tailwind
├─ package.json
├─ vite.config.js
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ .eslintrc.cjs
└─ README.md
```

## Commands in Terminal

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `help`       | Show available commands              |
| `scan`       | List available logs                  |
| `readlog ID` | Read a specific log by ID            |
| `stellar-key`| Unlock the secret room (try it!)     |
| `clear`      | Clear terminal output                |

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set these environment secrets in Vercel dashboard (if needed later):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_KEY` - Supabase public API key
- `VITE_FIREBASE_CONFIG` - Firebase config JSON (stringified)

### GitHub Pages

```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

## Environment Variables

Create a `.env.local` file for local development:

```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_KEY=your_key_here
```

These are imported in the app as `import.meta.env.VITE_*`.

## Customization

### Colors & Theme

Edit `src/index.css` CSS variables:
- `--stellar-dark` - Main background
- `--stellar-accent` - Cyan accent
- `--stellar-secondary` - Purple accent
- `--stellar-danger` - Red
- `--stellar-success` - Green

### Adding New Apps

1. Create component in `src/components/`
2. Add to `apps` array in `src/App.jsx`
3. Add entry to `componentMap` in `src/App.jsx`

### Adding New Terminal Commands

Edit the switch statement in `src/components/TerminalApp.jsx` and add your command case.

## Future Features (TODO)

- [ ] Cloud save with Supabase/Firebase
- [ ] Leaderboard for game scores
- [ ] More built-in apps (file manager, code editor)
- [ ] Custom themes/settings panel
- [ ] Multiplayer sync via WebSocket

## Reset Data

Click the **⟲** button in the dock to clear all local storage and reset the OS.

## Easter Egg

Try running `stellar-key` in the terminal or winning the mini-game to unlock the secret room. There's an easter egg in there too—find it and click it!

---

Made with ✨ by **AxonInnova** - [dsc.gg/axoninnova](https://dsc.gg/axoninnova)

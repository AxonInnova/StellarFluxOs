# StellarFlux OS - Project Structure

## Complete File Tree

```
StellarFluxOs/
├─ .devcontainer/
│  └─ devcontainer.json           # VS Code dev container config
├─ .github/
│  └─ workflows/
│     └─ deploy.yml               # Vercel CI/CD workflow
├─ public/
│  └─ favicon.svg                 # App favicon
├─ src/
│  ├─ assets/
│  │  └─ logs/
│  │     ├─ log_001.json          # System boot log
│  │     ├─ log_002.json          # Network trace log
│  │     └─ log_003.json          # Memory dump log
│  ├─ components/
│  │  ├─ Dock.jsx                 # Left-side app launcher
│  │  ├─ GameApp.jsx              # Phaser 3 mini-game
│  │  ├─ Logs.jsx                 # Log viewer/browser
│  │  ├─ Notepad.jsx              # Simple text editor
│  │  ├─ TerminalApp.jsx          # xterm.js terminal
│  │  └─ WindowShell.jsx          # Draggable/resizable window container
│  ├─ utils/
│  │  └─ storage.js               # localforage wrapper for persistence
│  ├─ App.jsx                     # Main app component + state management
│  ├─ index.css                   # Global styles + Tailwind + animations
│  └─ main.jsx                    # React entry point
├─ .env.example                   # Environment variables template
├─ .eslintrc.cjs                  # ESLint configuration
├─ .gitignore                     # Git ignore rules
├─ .prettierrc                    # Prettier formatting rules
├─ DEVLOG.md                      # Development journal
├─ LICENSE                        # MIT License
├─ QUICKSTART.md                  # Quick start guide
├─ README.md                      # Main documentation
├─ index.html                     # HTML entry point
├─ package.json                   # Dependencies + scripts
├─ postcss.config.cjs             # PostCSS configuration
├─ tailwind.config.cjs            # Tailwind CSS configuration
└─ vite.config.js                 # Vite build configuration
```

## Component Architecture

### App.jsx
- Main orchestrator
- Manages window state (open/closed/focused)
- Handles z-index layering
- Keyboard shortcut listeners
- Secret room unlock logic
- Persistence coordination

### WindowShell.jsx
- Wraps all windows with react-rnd
- Draggable and resizable
- Title bar with close button
- Focus management
- Z-index handling

### Dock.jsx
- Fixed left-side position
- App icons with click handlers
- Active app highlighting
- Reset button at bottom

### TerminalApp.jsx
- xterm.js instance
- Command parsing (help, scan, readlog, stellar-key, clear)
- History navigation (up/down arrows)
- Output persistence
- Callback for unlocking secret room

### Notepad.jsx
- Controlled textarea
- Auto-save with 1s debounce
- Loads from localforage on mount
- Save indicator

### Logs.jsx
- Two-column layout (list + viewer)
- Loads static JSON logs
- Click to view log content

### GameApp.jsx
- Phaser 3 canvas
- Simple node click puzzle
- 60-second timer
- Win condition triggers callback
- Returns CODE-42-STAR

### storage.js
- localforage wrapper functions
- saveWindowState / loadWindowState
- saveTerminalHistory / loadTerminalHistory
- saveTerminalOutput / loadTerminalOutput
- saveNotepadContent / loadNotepadContent
- clearAllStorage

## Data Flow

### Window Management
1. User clicks dock icon
2. App.jsx toggles window in state
3. WindowShell renders with react-rnd
4. User drags/resizes - react-rnd handles it
5. User clicks window - focus order updates
6. State auto-saves to localforage

### Terminal Commands
1. User types in xterm
2. TerminalApp parses command on Enter
3. Switch statement routes to handler
4. Handler writes output to terminal
5. Command added to history
6. History and output buffer saved

### Secret Room Unlock
1. User runs `stellar-key` command OR wins game
2. Callback triggers in TerminalApp or GameApp
3. App.jsx receives unlock signal
4. Sets secretUnlocked = true
5. Opens 'secretRoom' window
6. Window fades in with content

### Persistence
- On mount: load saved state from localforage
- On state change: auto-save to localforage
- On reset: clear all localforage keys

## Styling System

### Tailwind Utilities
- Most styling uses Tailwind classes
- Custom theme colors in tailwind.config.cjs

### CSS Variables (index.css)
- --stellar-dark
- --stellar-darker
- --stellar-accent (cyan)
- --stellar-secondary (purple)
- --stellar-danger (red)
- --stellar-success (green)

### Custom Animations
- window-transition class (smooth movement)
- window-focused class (glow effect)
- star-pulse animation (easter egg)
- scanlines animation (retro effect)

## Build & Deploy

### Development
```bash
npm run dev
```
- Vite dev server on port 5173
- Hot module replacement
- Fast refresh

### Production Build
```bash
npm run build
```
- Outputs to `dist/`
- Minified and optimized
- Ready for static hosting

### Preview Build
```bash
npm run preview
```
- Serves built dist folder
- Tests production build locally

## Environment Variables

Optional - only needed for future cloud features:
- VITE_SUPABASE_URL
- VITE_SUPABASE_KEY
- VITE_FIREBASE_CONFIG

Access via `import.meta.env.VITE_*`

## Future Enhancements

See DEVLOG.md for detailed roadmap. Key additions:
- Cloud sync (Supabase/Firebase)
- More apps (file manager, code editor)
- Custom themes
- Leaderboard for game
- WebSocket multiplayer

---

Built with 💙 by AxonInnova

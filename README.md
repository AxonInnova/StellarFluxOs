# StellarFlux OS

A professional, stable browser-based desktop operating system simulation built with React and Vite.

**Organization**: [AxonInnova](https://dsc.gg/axoninnova)  
**Founder**: Nubprogrammer

## Features

- **Stable Window Management**: Open, close, minimize, resize windows without state loops
- **Professional UI**: Glassmorphic design with slate and cyan color scheme
- **Terminal**: Command-line interface with history
- **Notepad**: Simple text editor
- **Logs**: System log viewer
- **Game**: Interactive node connection game
- **Clean Architecture**: No external drag/drop libraries, no infinite re-renders

## Tech Stack

- React 18 + Vite
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
src/
├─ App.jsx                    # Core OS engine
├─ components/
│  ├─ Dock.jsx               # Launcher
│  ├─ Desktop.jsx            # Window manager
│  ├─ Window.jsx             # Window container
│  └─ apps/
│     ├─ Terminal.jsx
│     ├─ Notepad.jsx
│     ├─ Logs.jsx
│     └─ Game.jsx
└─ index.css
```

## Build

```bash
npm run build
npm run preview
```

---

Stable. Professional. Ready to extend.

## Reset Data

Click the **⟲** button in the dock to clear all local storage and reset the OS.

## Easter Egg

Try running `stellar-key` in the terminal or winning the mini-game to unlock the secret room. There's an easter egg in there too—find it and click it!

---

Made with ✨ by **AxonInnova** - [dsc.gg/axoninnova](https://dsc.gg/axoninnova)

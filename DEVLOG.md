# StellarFlux OS Development Log

## Entry #1 - Project Kickoff

**Date**: February 25, 2026

yo so we're building StellarFlux OS - it's gonna be this sick browser-based OS demo with windows, terminal, games, the whole thing. AxonInnova is making it happen.

### what we're doing

- react + vite for the frontend (fast dev, fast builds)
- tailwind for styling (utility classes go hard)
- draggable windows handled by react-rnd (proper z-index management too)
- xterm.js for a real terminal experience with command handling
- phaser 3 for a mini game (node connection puzzle, 60 sec timer)
- localforage to persist window state, terminal history, and notepad content
- dark theme with cyan/purple accents, futuristic vibes but not overdone

### tech choices

- xterm.js is clutch for terminal stuff - way better than just a fake terminal UI
- react-rnd handles the window dragging and resizing - works solid with proper event handling
- localforage over localStorage because it has fallbacks and better perf for bigger data
- phaser 3 is overkill for a simple puzzle but it's fun and we can expand later
- tailwind keeps everything consistent and dev time is way faster

### components breakdown

**WindowShell**: wraps all windows, handles dragging, resizing, z-order, focus management

**Dock**: left-side app launcher with icons. clicking opens/focuses apps. shows which app is active

**TerminalApp**: xterm instance with these commands:
- help - shows available commands
- scan - lists available logs
- readlog - shows log content
- stellar-key - the secret command to unlock hidden room
- clear - clears output

**Notepad**: basic textarea with autosave. pretty self-explanatory

**Logs**: file browser + reader. loads static logs

**GameApp**: phaser scene with a simple node click puzzle. win condition triggers callback

**Secret Room**: appears when stellar-key is run or game is won. has journal entries + easter egg

### persistence

everything saves to localforage:
- window positions, sizes, z-order
- terminal history (up/down arrow recall) + output buffer
- notepad content
can reset everything with the button in bottom left

### keyboard shortcuts

- ctrl+` opens terminal (standard terminal hotkey)
- esc closes focused window

### next steps

- test everything end to end
- make sure storage works correctly
- test on different screens/resolutions
- polish UI transitions
- write deployment guide

### TODOs for future

- cloud sync (supabase/firebase)
- leaderboard for game
- more apps (file manager, code editor)
- custom themes
- websocket multiplayer
- proper log system with more logs

---

ngl this is gonna be fire when it's done. the demo's gonna show off react skills, component architecture, state management, persistence, and a little game logic. portfolio piece goes hard.

stay based, keep shipping.

— Nubprogrammer

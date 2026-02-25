# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Testing the App

### 1. Open the Terminal
- Click the **◆** icon in the dock
- Or press `Ctrl+`` (Ctrl + backtick)

### 2. Try Commands
```bash
help          # see all commands
scan          # list available logs
readlog log_001  # read a log
stellar-key   # unlock secret room!
clear         # clear terminal
```

### 3. Open Other Apps
- **✎** Notepad - type stuff, it autosaves
- **📋** Logs - browse and read system logs
- **▶** Game - play the node connection mini-game

### 4. Win the Game
- Click the **▶** icon
- Click Start
- Click on all 3 colored nodes before time runs out
- Win to unlock the secret room with code CODE-42-STAR

### 5. Find the Easter Egg
- Unlock the secret room (via `stellar-key` command or by winning the game)
- Look for something clickable...

### 6. Test Persistence
- Open some windows, move them around
- Type something in Notepad
- Run some terminal commands
- Refresh the page - everything should stay!

### 7. Reset
- Click the **⟲** button in bottom-left corner
- Confirm to clear all saved data

## Keyboard Shortcuts

- `Ctrl+`` - Open/focus Terminal
- `Esc` - Close focused window

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow prompts to link your GitHub repo.

### Setting Secrets (Optional)

If you add cloud features later:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_KEY
```

## Deploying to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. The `dist/` folder contains your built app

3. Push to `gh-pages` branch or use GitHub Actions

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Terminal not showing
- Make sure xterm CSS is imported
- Check browser console for errors
- Try clearing localStorage and refreshing

---

**Need help?** Open an issue on GitHub or contact AxonInnova at https://dsc.gg/axoninnova

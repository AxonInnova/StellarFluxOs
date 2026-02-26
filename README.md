# StellarFlux OS

A production-ready browser-based WebOS with Supabase Auth, file storage, and centralized window management.

**Organization**: [AxonInnova](https://dsc.gg/axoninnova)  
**Founder**: Nubprogrammer

## Features

✨ **Auth System**: Email/password signup, signin, guest demo mode  
🔒 **Per-User Storage**: 50MB quota with file uploads/downloads  
💾 **Device Specs**: Optional consent-based device info collection  
⌨️ **Terminal**: Linux-like CLI with system commands  
🎨 **Glassmorphic UI**: Nebula theme, backdrop blur, smooth animations  
🪟 **Window Manager**: Centralized state, drag/drop, minimize/maximize  
📁 **File Manager**: Upload, list, delete files with quota tracking  
🎮 **Mini Game**: Interactive node connection puzzle  
📝 **Notepad**: Simple text editor  
📋 **Logs**: System log viewer  

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Supabase** for Auth + Postgres + Storage
- No external drag/drop libraries (custom impl)

## Quick Setup

### 1. Prerequisites

- Node.js 18+
- Supabase project (get free tier at [supabase.com](https://supabase.com))

### 2. Environment Variables

Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAIL=admin@example.com
```

### 3. Supabase Setup

#### Database Tables & RLS

Run these SQL commands in your Supabase dashboard (SQL Editor):

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  device_specs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_files table (metadata)
CREATE TABLE user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- game_scores table
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_files
CREATE POLICY "users can read own files" ON user_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can insert own files" ON user_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can delete own files" ON user_files
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for game_scores
CREATE POLICY "users can read own scores" ON game_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can insert own scores" ON game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RPC function for user storage total
CREATE OR REPLACE FUNCTION user_storage_total(p_user_id UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(size_bytes), 0)
  FROM user_files
  WHERE user_id = p_user_id;
$$ LANGUAGE SQL;
```

#### Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `user-files`
3. Set to **Private**
4. Add RLS policy:

```sql
-- in Storage Policies section for user-files bucket
CREATE POLICY "users can read own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-files' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "users can delete own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-files' AND auth.uid()::text = (string_to_array(name, '/'))[1]);
```

### 4. Run Locally

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
src/
├─ App.jsx                      # Core OS + auth engine
├─ lib/
│  ├─ supabase.js              # Supabase client
│  ├─ auth.js                  # Auth helpers
│  └─ storage.js               # File upload/download
├─ components/
│  ├─ Login.jsx                # Auth screens
│  ├─ Dock.jsx                 # Launcher sidebar
│  ├─ Desktop.jsx              # Window renderer
│  ├─ Window.jsx               # Window container
│  ├─ DeviceConsentModal.jsx   # Consent flow
│  ├─ FileManager.jsx          # File browser
│  └─ apps/
│     ├─ Terminal.jsx
│     ├─ Notepad.jsx
│     ├─ Logs.jsx
│     ├─ Game.jsx
│     └─ Files.jsx
└─ index.css                    # Global theme
```

## Build & Deploy

### Vercel

```bash
vercel --prod
```

Add env vars in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL`

### GitHub Pages

```bash
npm run build
# Deploy dist/ folder to GH Pages
```

## Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `uname` | System info + device specs |
| `whoami` | Current user ID |
| `pwd` | Current directory |
| `system` | OS version & status |
| `clear` | Clear terminal |

## Admin Features

**Visibility**: Only visible when:
- User email matches `VITE_ADMIN_EMAIL`, OR
- `NODE_ENV !== 'production'`

**Reset Storage Button**: Deletes all `user_files` rows for current user + clears storage objects

## Quota & Limits

- **Default Storage Quota**: 50 MB per user
- **File Size Limit**: No individual file limit (enforced by Supabase)
- **Expiry**: Signed URLs expire in 1 hour

## Notes

- Guest mode creates throwaway accounts (auto-cleanup recommended)
- Device specs only saved with explicit consent
- All DB access uses RLS policies + anon key (no over-privilege)
- Private storage bucket ensures file privacy

---

**Alpha v0.1.0** | Built with ✨ by **AxonInnova**

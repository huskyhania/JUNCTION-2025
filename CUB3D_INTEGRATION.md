# Cub3D Integration Guide

This guide explains how to integrate the Cub3D game into your JUNCTION-2025 React app.

## Setup Steps

### 1. Build the Web Version

First, build the Cub3D game for web in the bonus directory:

```bash
cd ../raylib_3d_game/bonus
source /path/to/emsdk/emsdk_env.sh  # Activate Emscripten
make -f Makefile.web
```

This will generate:
- `cub3D.html`
- `cub3D.js`
- `cub3D.wasm`
- `cub3D.data` (if assets are preloaded)

### 2. Copy Files to Frontend

Run the copy script:

```bash
cd /Users/chilee/rich/JUNCTION-2025
./copy-cub3d.sh
```

Or manually copy the files:
```bash
cp ../raylib_3d_game/bonus/cub3D.html frontend/public/
cp ../raylib_3d_game/bonus/cub3D.js frontend/public/
cp ../raylib_3d_game/bonus/cub3D.wasm frontend/public/
cp -r ../raylib_3d_game/bonus/assets frontend/public/  # If needed
```

### 3. Access the Game

The game is now integrated and accessible at:
- **Route**: `/cub3d`
- **URL**: `http://localhost:5173/cub3d` (or your dev server URL)

### 4. Add Navigation Link (Optional)

You can add a link to the game from your app. For example, in `App.tsx`:

```tsx
<Button asChild className="w-full" variant="outline">
  <Link to="/cub3d">Play Cub3D</Link>
</Button>
```

## File Structure

```
JUNCTION-2025/
├── frontend/
│   ├── public/
│   │   ├── cub3D.html      # Game HTML file
│   │   ├── cub3D.js        # JavaScript glue code
│   │   ├── cub3D.wasm      # WebAssembly binary
│   │   └── assets/         # Game assets (textures, etc.)
│   └── src/
│       └── pages/
│           └── Cub3D.tsx    # React component wrapper
└── copy-cub3d.sh           # Script to copy build files
```

## How It Works

1. The `Cub3D.tsx` component loads the game in an iframe
2. The game files (`cub3D.html`, `cub3D.js`, `cub3D.wasm`) are served from the `public/` directory
3. The game runs in fullscreen mode without the app's layout/sidebar

## Troubleshooting

### Game files not found
- Make sure you've built the web version: `make -f Makefile.web` in the bonus directory
- Run `./copy-cub3d.sh` to copy files to the public directory
- Check that files exist in `frontend/public/`

### Game doesn't load
- Open browser console (F12) to check for errors
- Ensure you're using a modern browser with WebAssembly support
- Check that the dev server is running: `npm run dev` in the frontend directory

### Assets not loading
- Make sure the `assets/` directory is copied to `frontend/public/`
- Check texture paths in your `.cub` map files (should be relative like `assets/...`)

## Rebuilding

When you make changes to the Cub3D game:

1. Rebuild the web version:
   ```bash
   cd ../raylib_3d_game/bonus
   make -f Makefile.web clean
   make -f Makefile.web
   ```

2. Copy the new files:
   ```bash
   cd /Users/chilee/rich/JUNCTION-2025
   ./copy-cub3d.sh
   ```

3. Restart your dev server if needed

## Notes

- The game runs in an iframe for isolation
- The game is fullscreen (no sidebar/layout)
- You can customize the `Cub3D.tsx` component to add controls, instructions, etc.
- The game requires a `.cub` map file to be loaded via the file input in the game


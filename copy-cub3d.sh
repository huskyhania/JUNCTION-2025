#!/bin/bash

# Script to copy Cub3D web build files to the frontend public directory

BONUS_DIR="../raylib_3d_game/bonus"
FRONTEND_PUBLIC="frontend/public"

echo "Copying Cub3D web build files..."

# Check if bonus directory exists
if [ ! -d "$BONUS_DIR" ]; then
    echo "Error: $BONUS_DIR not found"
    exit 1
fi

# Check if web build files exist
if [ ! -f "$BONUS_DIR/cub3D.html" ]; then
    echo "Error: cub3D.html not found. Please build the web version first:"
    echo "  cd $BONUS_DIR"
    echo "  make -f Makefile.web"
    exit 1
fi

# Create public directory if it doesn't exist
mkdir -p "$FRONTEND_PUBLIC"

# Copy web build files
echo "Copying cub3D.html..."
cp "$BONUS_DIR/cub3D.html" "$FRONTEND_PUBLIC/"

echo "Copying cub3D.js..."
cp "$BONUS_DIR/cub3D.js" "$FRONTEND_PUBLIC/" 2>/dev/null || echo "Warning: cub3D.js not found"

echo "Copying cub3D.wasm..."
cp "$BONUS_DIR/cub3D.wasm" "$FRONTEND_PUBLIC/" 2>/dev/null || echo "Warning: cub3D.wasm not found"

# Copy assets directory if it exists
if [ -d "$BONUS_DIR/assets" ]; then
    echo "Copying assets directory..."
    cp -r "$BONUS_DIR/assets" "$FRONTEND_PUBLIC/" 2>/dev/null || echo "Warning: Could not copy assets"
fi

# Copy any data files (Emscripten preloaded files)
if [ -f "$BONUS_DIR/cub3D.data" ]; then
    echo "Copying cub3D.data..."
    cp "$BONUS_DIR/cub3D.data" "$FRONTEND_PUBLIC/"
fi

echo "Done! Cub3D files copied to $FRONTEND_PUBLIC"
echo "You can now access the game at /cub3d in your React app"


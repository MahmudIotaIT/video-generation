#!/usr/bin/env bash
# Free Edge TTS dialogue: every line in its character's voice. Overwrites public/audio/narration/.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v edge-tts >/dev/null || { echo "❌ edge-tts missing: brew install pipx && pipx install edge-tts && pipx ensurepath"; exit 1; }
command -v ffmpeg >/dev/null || { echo "❌ FFmpeg missing: brew install ffmpeg"; exit 1; }
npm run --silent export-text
npx tsx scripts/generate-dialogue.ts
npm run --silent srt

#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
npm run --silent srt || true
npx remotion render src/index.ts BermudaTriangle out/bermuda-raw.mp4 \
  --codec=h264 --crf=18 --pixel-format=yuv420p \
  --audio-codec=aac --audio-bitrate=192k \
  --image-format=jpeg --jpeg-quality=92
ffmpeg -hide_banner -loglevel error -y -i out/bermuda-raw.mp4 \
  -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart out/bermuda-triangle-final.mp4
echo "✅ Done → out/bermuda-triangle-final.mp4"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration \
  -of default=noprint_wrappers=1 out/bermuda-triangle-final.mp4

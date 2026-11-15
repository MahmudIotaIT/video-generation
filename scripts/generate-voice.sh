#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
VOICE="${VOICE:-bn-BD-PradeepNeural}"
RATE="${RATE:--6%}"
PITCH="${PITCH:--4Hz}"
command -v edge-tts >/dev/null || { echo "❌ edge-tts missing: brew install pipx && pipx install edge-tts && pipx ensurepath"; exit 1; }
command -v ffmpeg >/dev/null || { echo "❌ FFmpeg missing: brew install ffmpeg"; exit 1; }
npm run --silent export-text
mkdir -p public/audio/narration .tmp
for i in 1 2 3 4 5 6; do
  echo "🎙️  Scene $i …"
  edge-tts --voice "$VOICE" --rate="$RATE" --pitch="$PITCH" --file "narration/tts/scene$i.txt" --write-media ".tmp/scene$i.raw.mp3"
  ffmpeg -hide_banner -loglevel error -y -i ".tmp/scene$i.raw.mp3" \
    -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,highpass=f=70,bass=g=3:f=120,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 44100 -ac 2 -c:a libmp3lame -q:a 2 "public/audio/narration/scene$i.mp3"
done
rm -rf .tmp
npm run --silent srt
echo "✅ Narration ready → public/audio/narration/ · subtitles.srt updated"

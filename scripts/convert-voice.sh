#!/usr/bin/env bash
# Edge TTS narration → Seed-VC voice conversion (free, local)
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
SEEDVC="${SEEDVC:-$HOME/tools/seed-vc}"
REF="${REF:-voice-ref/ref.wav}"
STEPS="${STEPS:-30}"
CFG="${CFG:-0.7}"
ONLY="${ONLY:-1 2 3 4 5 6}"
PY="$SEEDVC/.venv/bin/python"

[[ -f "$REF" ]] || { echo "❌ নমুনা ভয়েস নেই: $REF"; exit 1; }
[[ -x "$PY" ]] || { echo "❌ Seed-VC পাওয়া যায়নি: $SEEDVC"; exit 1; }
mkdir -p .vc public/audio/narration/original

for i in $ONLY; do
  src="public/audio/narration/scene$i.mp3"
  orig="public/audio/narration/original/scene$i.mp3"
  [[ -f "$src" || -f "$orig" ]] || { echo "❌ $src নেই — আগে npm run voice চালান"; exit 1; }
  if [[ "${FRESH:-0}" == "1" || ! -f "$orig" ]]; then cp "$src" "$orig"; fi

  echo "🎚️  দৃশ্য $i: কণ্ঠ বদলানো হচ্ছে …"
  ffmpeg -hide_banner -loglevel error -y -i "$orig" -ac 1 -ar 22050 ".vc/src$i.wav"
  rm -rf ".vc/out$i" && mkdir -p ".vc/out$i"
  ( cd "$SEEDVC" && "$PY" inference.py \
      --source "$ROOT/.vc/src$i.wav" --target "$ROOT/$REF" --output "$ROOT/.vc/out$i" \
      --diffusion-steps "$STEPS" --length-adjust 1.0 --inference-cfg-rate "$CFG" --fp16 False )

  out=$(ls -t ".vc/out$i"/*.wav | head -1)
  ffmpeg -hide_banner -loglevel error -y -i "$out" \
    -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 44100 -ac 2 -c:a libmp3lame -q:a 2 "$src"
  echo "   ✓ $src"
done

rm -rf .vc
npm run --silent srt
echo "✅ নতুন কণ্ঠে ন্যারেশন তৈরি। আসল Edge ফাইল রাখা আছে: public/audio/narration/original/"
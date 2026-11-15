#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { echo "❌ FFmpeg missing: brew install ffmpeg"; exit 1; }
SFX=public/audio/sfx
mkdir -p "$SFX" public/audio/narration
ENC=(-ar 44100 -ac 2 -c:a libmp3lame -q:a 3)
mk() {
  local out="$1"; shift
  if [[ -f "$out" && "${FORCE:-0}" != "1" ]]; then echo "↷ exists, skipped: $out"; return; fi
  ffmpeg -hide_banner -loglevel error -y "$@" "${ENC[@]}" "$out"
  echo "✓ $out"
}
mk "$SFX/ocean.mp3" -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:duration=24:sample_rate=44100" \
  -af "highpass=f=40,lowpass=f=650,tremolo=f=0.14:d=0.8,volume=2.2,afade=t=in:d=1.5"
mk "$SFX/wind.mp3" -f lavfi -i "anoisesrc=color=pink:amplitude=0.4:duration=24:sample_rate=44100" \
  -af "bandpass=f=420:width_type=h:w=380,tremolo=f=0.21:d=0.75,volume=2.6,afade=t=in:d=1.5"
mk "$SFX/thunder.mp3" -f lavfi -i "anoisesrc=color=brown:amplitude=1:duration=5:sample_rate=44100" \
  -af "lowpass=f=220,afade=t=in:d=0.03,afade=t=out:st=0.35:d=4.6,aecho=0.8:0.6:300|700:0.5|0.3,volume=3.5"
mk "$SFX/radar.mp3" -f lavfi -i "sine=frequency=1150:duration=1.6:sample_rate=44100" \
  -af "afade=t=in:d=0.005,afade=t=out:st=0.01:d=1.5,aecho=0.8:0.6:220:0.35,volume=0.5"
mk "$SFX/whoosh.mp3" -f lavfi -i "anoisesrc=color=white:amplitude=0.6:duration=1.2:sample_rate=44100" \
  -af "bandpass=f=1100:width_type=h:w=1500,afade=t=in:d=0.6:curve=exp,afade=t=out:st=0.6:d=0.6:curve=exp,volume=1.3"
mk "$SFX/riser.mp3" -f lavfi -i "aevalsrc='0.25*sin(2*PI*(110*t+70*t*t))':s=44100:d=4" \
  -af "afade=t=in:d=3.6:curve=exp,afade=t=out:st=3.8:d=0.2,aecho=0.8:0.7:120:0.4"
MUSIC_EXPR="0.14*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.07*t))+0.09*sin(2*PI*65.41*t)*(0.5+0.5*sin(2*PI*0.05*t))+0.07*sin(2*PI*82.41*t)*(0.5+0.5*sin(2*PI*0.031*t))+0.05*sin(2*PI*110*t)*(0.5+0.5*sin(2*PI*0.09*t))+0.03*sin(2*PI*164.81*t)*(0.5+0.5*sin(2*PI*0.013*t))+0.16*sin(2*PI*48*t)*exp(-6*(t-2*floor(t/2)))"
mk public/audio/music.mp3 -f lavfi -i "aevalsrc='${MUSIC_EXPR}':s=44100:d=100" \
  -af "lowpass=f=1600,aecho=0.8:0.85:400|800:0.35|0.25,afade=t=in:d=4,afade=t=out:st=93:d=7,volume=1.4"
echo "🎵 All sounds created → public/audio/"

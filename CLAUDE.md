# CLAUDE.md — Bengali 2D Animated Shorts Factory (Remotion)

This project produces vertical (9:16) 2D flat-cartoon documentary videos in **Bangladeshi Bengali**
for YouTube Shorts and Facebook Reels. The first video is "বারমুডা ট্রায়াঙ্গেল: সমুদ্রের সেই রহস্যময় জায়গা!".
The same engine is reused for every new topic.

**The owner speaks Bengali and is a beginner with the terminal.** Always reply in simple Bengali,
give exact copy-paste commands, explain what each step does in one line, and ask before anything
destructive. Code and code comments stay in English.

---

## 1. Project status (what has been done)

- Full Remotion project: 6 animated scenes, Bengali subtitles burned in, sound design, render pipeline.
- Audio: music + SFX synthesised with FFmpeg (`npm run sfx`).
- Voice: three options are set up (see section 5). Default = free Edge TTS.
  The owner did NOT like the default Edge voice and prefers a custom, natural male documentary voice.
- `CLAUDE.md` (this file) is the project memory. Update it whenever the setup changes.

---

## 2. Setup on a NEW machine (do this first on any new PC)

### macOS (primary, tested on MacBook Air M4)

```bash
# 1) Tools
brew install node ffmpeg pipx git python@3.10
pipx install edge-tts && pipx ensurepath        # reopen Terminal after this

# 2) Project dependencies (node_modules is NOT copied between machines)
cd ~/bermuda-triangle-short
npm install

# 3) Checks
node -v            # must be v20 or higher
ffmpeg -version | head -1
edge-tts --help >/dev/null && echo "edge-tts OK"
npm run typecheck
```

### Windows

Use **WSL (Ubuntu)**: all scripts are bash. Inside WSL:
`sudo apt update && sudo apt install -y ffmpeg git python3.10 python3.10-venv pipx nodejs npm`
(Node 20+ may need nvm), then `pipx install edge-tts`.
Mac-only commands need replacements on WSL/Linux: `pbpaste` → paste into an editor, `afplay` → `ffplay -autoexit -nodisp`, `open` → `explorer.exe`.

### Optional: free voice cloning (Seed-VC) — lives OUTSIDE the project

```bash
mkdir -p ~/tools && cd ~/tools
git clone https://github.com/Plachtaa/seed-vc.git
cd seed-vc
python3.10 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements-mac.txt      # Linux/WSL: requirements.txt
deactivate
```

Models (~several hundred MB) auto-download on first use. The repo is archived (no updates) but works.

### Files to copy between machines

Copy the whole project folder **except** `node_modules/`, `out/`, `.vc/`, `.tmp/`.
Keep `public/audio/` (voice + music), `voice-ref/` (reference voice sample) and this `CLAUDE.md`.

---

## 3. Commands

| Command                                     | What it does                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`                               | Remotion Studio preview at http://localhost:3000 (Ctrl+C to stop)                                       |
| `npm run sfx`                               | Synthesise music + SFX into`public/audio/` (never overwrites existing files; `FORCE=1` regenerates)     |
| `npm run voice`                             | Free Edge TTS →`public/audio/narration/sceneN.mp3` + rebuild `subtitles.srt` (**overwrites narration**) |
| `bash scripts/generate-voice-elevenlabs.sh` | ElevenLabs TTS (paid credits) → same narration files                                                    |
| `bash scripts/convert-voice.sh`             | Free: convert the current narration to the reference voice with Seed-VC                                 |
| `npm run srt`                               | Rebuild`subtitles.srt` from the real narration lengths                                                  |
| `npm run export-text`                       | Write`narration.txt` + `narration/tts/sceneN.txt`                                                       |
| `npm run still`                             | One frame →`out/preview.png`                                                                            |
| `npm run render`                            | Final MP4 →`out/bermuda-triangle-final.mp4` (+ `out/subtitles.srt`)                                     |
| `npm run typecheck`                         | TypeScript check — run after every code change                                                          |

---

## 4. Full pipeline (from zero to MP4)

```bash
cd ~/bermuda-triangle-short
npm install                 # only on a new machine
npm run sfx                 # music + sound effects
npm run voice               # base Bengali narration (Edge)
# optional voice upgrade — pick ONE of section 5B / 5C
npm run dev                 # preview; refresh browser (Cmd+R) after new audio
npm run render              # → out/bermuda-triangle-final.mp4
open out/bermuda-triangle-final.mp4
```

Upload `out/bermuda-triangle-final.mp4`. Subtitles are already burned in; `out/subtitles.srt` is optional for platform captions.
`out/bermuda-raw.mp4` is an intermediate file and can be deleted.

---

## 5. Voice options

### 5A. Edge TTS (free, online, default)

- List voices: `edge-tts --list-voices | grep bn-`
- Known Bengali voices: `bn-BD-PradeepNeural` (male, BD, default), `bn-BD-NabanitaNeural` (female, BD),
  `bn-IN-BashkarNeural` (male, IN accent), `bn-IN-TanishaaNeural` (female, IN accent).
- Quick test of one line:
  `edge-tts --voice bn-IN-BashkarNeural --rate=-8% --pitch=-5Hz --text "ভাবুন তো!" --write-media test.mp3 && afplay test.mp3`
- Full run: `VOICE=bn-IN-BashkarNeural RATE=-8% PITCH=-5Hz npm run voice`

### 5B. ElevenLabs (paid credits, most natural)

- Script: `scripts/generate-voice-elevenlabs.sh`
- Owner's chosen voice ID: `rjzfuMqaVXKNgQQStSXa` (default in the script). If it is a Voice Library voice, it must be
  added to "My Voices" in ElevenLabs first.
- Model: `eleven_v3` (supports Bengali). `eleven_multilingual_v2` does NOT support Bengali.
- The API key comes from the environment only. **Never write it into any file, commit, or log.**
  ```bash
  export ELEVENLABS_API_KEY=...            # the owner types this; never ask them to paste it in chat
  ONLY=1 bash scripts/generate-voice-elevenlabs.sh   # test scene 1 first
  bash scripts/generate-voice-elevenlabs.sh          # all scenes
  ```
- Tuning env vars: `STABILITY=0.0|0.5|1.0` (expressive ↔ steady), `SIMILARITY=0.75`, `MODEL=...`, `ONLY="3 5"`.
- Eleven v3 audio tags like `[whispers]` or `[pause]` may be added to the `tts` text only (never to `chunks`).

### 5C. Seed-VC voice conversion (free, local) — owner's preferred free route

- Flow: Edge TTS reads the Bengali text → Seed-VC changes the timbre to match `voice-ref/ref.wav`.
  Accent and pacing come from Edge; only the voice colour changes.
- Reference sample: 10–25 s, one clean speaker, no music. **Only the owner's own voice or a voice they have permission to use.**
  ```bash
  mkdir -p voice-ref
  ffmpeg -y -i myvoice.m4a -ac 1 -ar 22050 -t 25 voice-ref/ref.wav
  ```
- Run:
  ```bash
  npm run voice                              # base narration (match gender of the reference)
  ONLY=1 bash scripts/convert-voice.sh       # test
  afplay public/audio/narration/scene1.mp3
  bash scripts/convert-voice.sh              # all scenes
  ```
- The original Edge files are backed up once in `public/audio/narration/original/`.
  After re-running `npm run voice`, use `FRESH=1 bash scripts/convert-voice.sh` so the new base audio is used.
- Tuning: `STEPS=50` (better quality, slower), `CFG=0.7`, `SEEDVC=~/tools/seed-vc`, `REF=voice-ref/ref.wav`.

### 5D. Own recording

Record `scene1.m4a` … `scene6.m4a` (script in `narration.txt`), then:

```bash
for i in 1 2 3 4 5 6; do
  ffmpeg -y -i scene$i.m4a -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 2 public/audio/narration/scene$i.mp3
done
npm run srt
```

**Important:** after 5B/5C/5D, do NOT run `npm run voice` again unless you intend to replace the voice.
Just run `npm run srt` (if needed) and `npm run render`.

---

## 6. Video spec (always)

- 1080×1920, 30 fps, H.264 yuv420p, AAC 192k, loudness −14 LUFS, 60–90 seconds
- 100% Bengali narration, on-screen text and subtitles
- Flat vector cartoon, cinematic camera moves, never a static slideshow

## 7. Architecture

```
src/data/script.ts      ← SINGLE SOURCE OF TRUTH: scenes, subtitle chunks, TTS text, minSeconds, asset paths
src/timeline.ts         ← frame timings from real audio lengths (pure TS, also used by Node scripts)
src/data/fx.ts          ← cueStart/cueEnd, lightning strike frames, radar ping frames
src/Root.tsx            ← calculateMetadata: checks which audio exists + measures narration length
src/Video.tsx           ← scenes as <Sequence>s + Subtitles + SoundDesign
src/scenes/SceneN.tsx   ← one component per scene, prop `t: SceneTiming`
src/components/         ← Sky/Stars/Moon/Sun, Ocean, Ship, Planes (Avenger, Mariner), Weather (Rain, Fog,
                          CloudLayer, Lightning, Flash, Seagulls), Radar, Compass, Person (scientist/navigator),
                          MapView, Overlays (TitleText, Badge, Scanlines), Icons, Subtitles, SoundDesign, SceneShell
src/lib/anim.ts         ← ramp, windowed, mono, wavePath, flashIntensity, pointOnPolyline
scripts/                ← generate-sfx.sh, generate-voice.sh, generate-voice-elevenlabs.sh, convert-voice.sh,
                          export-narration.ts, make-srt.ts, render.sh
public/audio/           ← music.mp3, sfx/*.mp3, narration/scene1..N.mp3 (+ narration/original/ backups)
voice-ref/ref.wav       ← reference voice for Seed-VC
setup.sh                ← original one-shot generator of the whole project (backup only; do not re-run over edits)
```

### How sync works (do not break)

1. Scene length = max(`minSeconds`, 0.5 s lead-in + narration length + 1 s tail).
2. Subtitle `chunks` are spread across the narration, weighted by text length plus pauses at `। ! ?` and `, —`.
3. Animation beats tied to speech use `cueStart(t, i)` / `cueEnd(t, i)`. Never hard-code seconds for them.
4. `SoundDesign` renders an `<Audio>` only if `assets[path]` is true; missing files are skipped silently.
5. Changing any narration audio requires `npm run srt` and a browser refresh in Studio.

## 8. Hard rules

- **Never split Bengali strings per character** (no letter-by-letter animation): it breaks conjuncts.
- Font: Hind Siliguri via `@remotion/google-fonts`; Bengali `lineHeight ≥ 1.35`.
- Safe zones: subtitles 440 px above the bottom; titles and badges ≥ 150 px from the top, 50 px from the sides.
- Deterministic animation only: `useCurrentFrame()` + Remotion `random(seed)`. No `Math.random()` or CSS transitions.
- Hooks run before any early `return null`.
- `interpolate()` input ranges must be strictly increasing; wrap computed ranges in `mono([...])`.
- SVG ids (gradients, filters, clipPaths) must be unique per scene.
- Original art only. No copyrighted characters, logos, or stock images.
- Voices: only voices the owner has the right to use; never clone a real person without permission.
- Secrets (API keys) only via environment variables, never in files.
- **Accuracy**: never present myths as facts. Label on-screen claims with a `Badge` tone:
  `record` (green, ঐতিহাসিক রেকর্ড), `legend` (orange, জনপ্রিয় গল্প), `info` (blue, তথ্য), `warn` (red).
  Verify dates, numbers and names before writing them.

## 9. Bengali narration style

- Natural Bangladeshi Bengali, documentary tone: suspenseful but warm.
- Hook question in the first 3 seconds; end with the CTA "আপনার মতামত কমেন্টে জানান!".
- `chunks` = what viewers read (Bengali digits OK). `tts` = what the voice says: numbers spelled out
  (উনিশশো পঁয়তাল্লিশ), English names written phonetically (ফ্লাইট উনিশ), `...` for a dramatic pause.
- Each subtitle chunk ≤ ~35 characters, one breath long.

## 10. Making a NEW video

1. `cp -R ~/bermuda-triangle-short ~/<topic>-short`, then delete `public/audio/narration/*` (keep `voice-ref/`) and `out/*`.
2. Rewrite `SCENES` in `src/data/script.ts` (5–7 scenes, `minSeconds` summing to about 75–85).
3. Rewrite or reuse `src/scenes/SceneN.tsx`; reuse `src/components/` first and put new reusable art there.
4. Update `SCENE_COMPONENTS` in `Video.tsx` and `fx.ts` if the scene count or effects change.
5. Rename the composition id in `Root.tsx` and the output filenames in `scripts/render.sh` and `package.json`.
6. Show the owner the Bengali script and scene plan for approval **before** writing code.
7. `npm run typecheck` → voice (section 5) → `npm run dev` check → `npm run render`.

## 11. Verification checklist (before saying "done")

- [ ] `npm run typecheck` passes
- [ ] A still frame from each scene looks right (Bengali renders, nothing clipped)
- [ ] Audio tracks visible in the Studio timeline; narration matches subtitles
- [ ] `subtitles.srt` regenerated after the final voice
- [ ] `ffprobe out/<name>-final.mp4` → 1080x1920, 30 fps, 60–90 s
- [ ] Facts double-checked, legend vs. record clearly labelled

## 12. Troubleshooting (issues already seen)

- **`npm error ENOENT ... package.json`**: you are not in the project folder or the files were never created. `cd ~/bermuda-triangle-short && ls`.
- **No sound in Studio**: audio files don't exist yet → `npm run sfx && npm run voice`, restart `npm run dev`,
  refresh the browser (Cmd+R), unmute the Studio speaker icon, press play once.
- **Bengali shows boxes**: needs internet on first run for the font; `npx remotion browser ensure`.
- **`edge-tts` / `claude` not found**: `pipx ensurepath` (or fix PATH), then reopen Terminal.
- **ElevenLabs HTTP 401**: wrong or missing key. **404/voice not found**: add the voice to My Voices.
  **Quota**: not enough credits. **Language errors**: use `MODEL=eleven_v3`.
- **Seed-VC install fails**: make sure Python 3.10 is used (`python3.10 -m venv .venv`); on Mac use `requirements-mac.txt`.
- **Converted voice sounds robotic**: better reference (cleaner, 15–25 s), `STEPS=50`, and an Edge voice of the same gender.
- **Video longer than 90 s**: lower `minSeconds`, shorten the narration, or speed up the voice.
- **Remotion version mismatch warning**: `npx remotion upgrade`.

---

## 13. Git & GitHub
- Repo: private GitHub repo `bermuda-triangle-short` (owner's account). Keep it **private**: it contains the owner's voice sample and audio.
- Not tracked (see `.gitignore`): `node_modules/`, `out/`, `.vc/`, `.tmp/`, `.env*`. Rendered MP4s are not in git.
- Tracked on purpose: `public/audio/` (music, SFX, final narration), `voice-ref/`, `CLAUDE.md`.
- Never commit API keys. Before every commit run `git status` and check that no secret or huge file is staged.
- Save work:  `git add -A && git commit -m "<short message>" && git push`
- On another machine, first time: `gh repo clone bermuda-triangle-short && cd bermuda-triangle-short && npm install`, then follow section 2.
- Before working on any machine: `git pull`. After finishing: commit + push.
- New video topic: create a new branch (`git switch -c <topic>`) or a new repo, so the Bermuda video stays intact.
- When the owner says "save" or "সেভ করো": commit with a clear message and push, then tell them in Bengali what was saved.

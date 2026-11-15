# বারমুডা ট্রায়াঙ্গেল — 2D Animated Bengali Short (Remotion)
1080x1920 · 30 fps · ~85 s

Requirements (Mac):
    brew install node ffmpeg pipx
    pipx install edge-tts && pipx ensurepath

Run:
    npm install
    npm run sfx       # music + sound effects (FFmpeg)
    npm run voice     # Bengali narration + exact subtitles.srt
    npm run dev       # preview at http://localhost:3000
    npm run render    # out/bermuda-triangle-final.mp4

Replace any file in public/audio/ with a better one of the same name
(e.g. Pixabay music/SFX or your own recorded voice); the scripts never overwrite existing files.
Edit text in src/data/script.ts, then re-run `npm run voice`.

/**
 * Writes one SRT per character (exact timings of the current dialogue) + a checklist of lines
 * with the filename each recorded line should be saved as (voice-in/sN_lK.mp3).
 * Output: elevenlabs/rumana.srt, elevenlabs/karim.srt, elevenlabs/lines.txt
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {LINES_FILE, SCENES, SPEAKERS, narrationFile, type LinesFile, type Speaker} from '../src/data/script';
import {buildTimeline} from '../src/timeline';

const dur = (rel: string) => {
  const full = path.join('public', rel);
  if (!fs.existsSync(full)) return null;
  return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${full}"`).toString());
};
const linesPath = path.join('public', LINES_FILE);
const lt: LinesFile['scenes'] = fs.existsSync(linesPath) ? JSON.parse(fs.readFileSync(linesPath, 'utf8')).scenes : [];
const tl = buildTimeline(SCENES.map((_, i) => dur(narrationFile(i))), lt);
const ts = (frame: number) => {
  const ms = Math.round((frame / tl.fps) * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};

fs.mkdirSync('elevenlabs', {recursive: true});
const rows: {who: Speaker; file: string; text: string; start: number; end: number}[] = [];
tl.scenes.forEach((s, i) =>
  s.cues.forEach((c, k) => {
    const line = SCENES[i].lines[k];
    rows.push({who: line.who, file: `s${i + 1}_l${k + 1}`, text: line.tts ?? line.text, start: s.from + c.speakStart, end: s.from + c.speakEnd});
  }),
);
(['rumana', 'karim'] as Speaker[]).forEach((who) => {
  const srt = rows
    .filter((r) => r.who === who)
    .map((r, n) => `${n + 1}\n${ts(r.start)} --> ${ts(r.end)}\n${r.text}\n`)
    .join('\n');
  fs.writeFileSync(`elevenlabs/${who}.srt`, srt, 'utf8');
});
const list = rows.map((r) => `${r.file}.mp3\t${SPEAKERS[r.who].name}\t${ts(r.start)}\t${r.text}`).join('\n');
fs.writeFileSync(
  'elevenlabs/lines.txt',
  `প্রতিটি লাইন আলাদা ফাইলে সেভ করুন, নাম হবে প্রথম কলামের মতো, তারপর ফাইলগুলো voice-in/ ফোল্ডারে রাখুন।\nফাইলের নাম\tচরিত্র\tসময়\tসংলাপ\n\n${list}\n`,
  'utf8',
);
console.log(`✓ elevenlabs/rumana.srt, elevenlabs/karim.srt, elevenlabs/lines.txt (${rows.length} lines)`);

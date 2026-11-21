import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {LINES_FILE, SCENES, SPEAKERS, narrationFile, type LinesFile} from '../src/data/script';
import {buildTimeline} from '../src/timeline';

const duration = (rel: string): number | null => {
  const full = path.join('public', rel);
  if (!fs.existsSync(full)) return null;
  try {
    const v = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${full}"`).toString().trim());
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};

const linesPath = path.join('public', LINES_FILE);
const lines: LinesFile['scenes'] = fs.existsSync(linesPath) ? (JSON.parse(fs.readFileSync(linesPath, 'utf8')) as LinesFile).scenes : [];
const durs = SCENES.map((_, i) => duration(narrationFile(i)));
const tl = buildTimeline(durs, lines);
const ts = (frame: number) => {
  const ms = Math.round((frame / tl.fps) * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};
const srt = tl.cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${SPEAKERS[c.who].name}: ${c.text}\n`).join('\n');
fs.writeFileSync('subtitles.srt', srt, 'utf8');
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/subtitles.srt', srt, 'utf8');
const missing = durs.filter((d) => d === null).length;
console.log(`✓ subtitles.srt (${tl.cues.length} cues, total ${(tl.total / tl.fps).toFixed(1)}s)` + (missing ? ` — ${missing} dialogue file(s) missing, estimated timing used` : ' — exact audio timing'));

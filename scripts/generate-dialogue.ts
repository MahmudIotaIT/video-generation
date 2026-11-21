/**
 * Dialogue voices with Edge TTS (free).
 * Each line is spoken with its speaker's voice, trimmed, then joined per scene with natural gaps.
 * Output: public/audio/narration/sceneN.mp3 + public/audio/narration/lines.json (exact line timings).
 *
 * Env: ONLY="1 3"   only these scenes (others keep their old timings)
 *      VOICE_RUMANA / VOICE_KARIM, RATE_RUMANA / RATE_KARIM, PITCH_RUMANA / PITCH_KARIM
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {LINES_FILE, SCENES, SPEAKERS, narrationFile, type LinesFile, type Speaker} from '../src/data/script';

const SR = 44100;
const CH = 2;
const BYTES_PER_SEC = SR * CH * 2;
const GAP_SAME = 0.28; // pause between two lines of the same speaker
const GAP_SWITCH = 0.5; // pause when the other character replies

const TMP = '.tmp/dialogue';
fs.mkdirSync(TMP, {recursive: true});
fs.mkdirSync('public/audio/narration', {recursive: true});

const env = (k: string, d: string) => process.env[k] || d;
const voiceFor = (who: Speaker) => {
  const s = SPEAKERS[who];
  const K = who.toUpperCase();
  return {voice: env(`VOICE_${K}`, s.voice), rate: env(`RATE_${K}`, s.rate), pitch: env(`PITCH_${K}`, s.pitch)};
};
// Light per-character colour: Karim a bit warmer/deeper, Rumana a bit brighter.
const EQ: Record<Speaker, string> = {
  karim: 'highpass=f=70,bass=g=4:f=140',
  rumana: 'highpass=f=90,treble=g=2:f=4000',
};

const only = (process.env.ONLY ?? '').split(/[\s,]+/).filter(Boolean).map(Number);
const linesPath = path.join('public', LINES_FILE);
const prev: LinesFile = fs.existsSync(linesPath) ? JSON.parse(fs.readFileSync(linesPath, 'utf8')) : {scenes: []};
const out: LinesFile = {scenes: SCENES.map((_, i) => prev.scenes?.[i] ?? null)};

const silence = (sec: number) => Buffer.alloc(Math.round(sec * SR) * CH * 2);

SCENES.forEach((sc, i) => {
  const n = i + 1;
  if (only.length && !only.includes(n)) return;
  console.log(`🎙️  Scene ${n} (${sc.lines.length} lines)`);
  const parts: Buffer[] = [];
  const times: {start: number; end: number}[] = [];
  let cursor = 0;
  sc.lines.forEach((line, k) => {
    const v = voiceFor(line.who);
    const mp3 = path.join(TMP, `s${n}_${k}.mp3`);
    const raw = path.join(TMP, `s${n}_${k}.raw`);
    // Own / ElevenLabs recording wins: voice-in/sN_lK.(mp3|wav|m4a). Otherwise Edge TTS.
    const own = ['mp3', 'wav', 'm4a'].map((e) => path.join('voice-in', `s${n}_l${k + 1}.${e}`)).find((p) => fs.existsSync(p));
    if (!own) execFileSync('edge-tts', ['--voice', v.voice, `--rate=${v.rate}`, `--pitch=${v.pitch}`, '--text', line.tts ?? line.text, '--write-media', mp3], {stdio: 'ignore'});
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', own ?? mp3,
      '-af', `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,${own ? "highpass=f=70" : EQ[line.who]}`,
      '-ar', String(SR), '-ac', String(CH), '-f', 's16le', raw,
    ]);
    const pcm = fs.readFileSync(raw);
    if (k > 0) {
      const g = (sc.lines[k - 1].who === line.who ? GAP_SAME : GAP_SWITCH) + (line.pause ?? 0);
      parts.push(silence(g));
      cursor += g;
    }
    const len = pcm.length / BYTES_PER_SEC;
    times.push({start: +cursor.toFixed(3), end: +(cursor + len).toFixed(3)});
    parts.push(pcm);
    cursor += len;
    console.log(`   ${own ? '🎧' : '🤖'} ${SPEAKERS[line.who].name}: ${line.text}  (${len.toFixed(2)}s)`);
  });
  const sceneRaw = path.join(TMP, `scene${n}.raw`);
  fs.writeFileSync(sceneRaw, Buffer.concat(parts));
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', String(SR), '-ac', String(CH), '-i', sceneRaw,
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', String(SR), '-c:a', 'libmp3lame', '-q:a', '2', path.join('public', narrationFile(i)),
  ]);
  out.scenes[i] = times;
});

fs.writeFileSync(linesPath, JSON.stringify(out, null, 1) + '\n', 'utf8');
fs.rmSync('.tmp', {recursive: true, force: true});
console.log(`✅ Dialogue ready → public/audio/narration/ + ${LINES_FILE}`);

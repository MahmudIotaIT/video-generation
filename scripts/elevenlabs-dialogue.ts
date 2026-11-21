/**
 * Downloads every dialogue line from ElevenLabs into voice-in/sN_lK.mp3 (then run `npm run voice` to assemble).
 * The API key is read from the environment only — never written anywhere.
 *
 *   export ELEVENLABS_API_KEY=...        (typed by the owner in Terminal)
 *   VOICE_ID_RUMANA=xxxx VOICE_ID_KARIM=yyyy npx tsx scripts/elevenlabs-dialogue.ts
 *
 * Env: ONLY="1 3" scenes only · FORCE=1 re-download existing files · MODEL (default eleven_v3)
 *      STABILITY (0.5) · SIMILARITY (0.75)
 */
import fs from 'node:fs';
import path from 'node:path';
import {SCENES, SPEAKERS, type Speaker} from '../src/data/script';

const KEY = process.env.ELEVENLABS_API_KEY;
const IDS: Record<Speaker, string | undefined> = {rumana: process.env.VOICE_ID_RUMANA, karim: process.env.VOICE_ID_KARIM};
const MODEL = process.env.MODEL || 'eleven_v3';
const only = (process.env.ONLY ?? '').split(/[\s,]+/).filter(Boolean).map(Number);

const main = async () => {
  if (!KEY) throw new Error('ELEVENLABS_API_KEY নেই। আগে Terminal-এ লিখুন: export ELEVENLABS_API_KEY=আপনার_কী');
  for (const who of ['rumana', 'karim'] as Speaker[]) if (!IDS[who]) throw new Error(`VOICE_ID_${who.toUpperCase()} দেওয়া হয়নি (${SPEAKERS[who].name}-এর voice ID)`);
  fs.mkdirSync('voice-in', {recursive: true});
  let made = 0;
  for (const [i, sc] of SCENES.entries()) {
    if (only.length && !only.includes(i + 1)) continue;
    for (const [k, line] of sc.lines.entries()) {
      const file = path.join('voice-in', `s${i + 1}_l${k + 1}.mp3`);
      if (fs.existsSync(file) && process.env.FORCE !== '1') {
        console.log(`↷ আছে, বাদ: ${file}`);
        continue;
      }
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${IDS[line.who]}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
        body: JSON.stringify({
          text: line.tts ?? line.text,
          model_id: MODEL,
          language_code: 'bn',
          voice_settings: {stability: Number(process.env.STABILITY ?? 0.5), similarity_boost: Number(process.env.SIMILARITY ?? 0.75)},
        }),
      });
      if (!res.ok) {
        const msg = (await res.text()).slice(0, 300);
        throw new Error(`ElevenLabs HTTP ${res.status} (${file}): ${msg}`);
      }
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      made++;
      console.log(`🎧 ${file}  ${SPEAKERS[line.who].name}: ${line.text}`);
    }
  }
  console.log(`✅ ${made}টা নতুন ফাইল voice-in/-এ। এবার চালান: npm run voice && npm run render`);
};

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});

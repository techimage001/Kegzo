# Pre-records every coach line with the free Kokoro voice (Apache-2.0). Run: python3 tools/make-voice.py
import json,subprocess,os,sys
from kokoro_onnx import Kokoro
import soundfile as sf
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(R,'assets','voice');os.makedirs(OUT,exist_ok=True)
VOICE=os.environ.get('KEGZO_VOICE','bm_george')
lines=json.loads(subprocess.check_output(['node',os.path.join(R,'tools','voice-lines.js')]))
k=Kokoro(os.environ.get('KOKORO_MODEL','/home/claude/tts/kokoro-v1.0.onnx'),os.environ.get('KOKORO_VOICES','/home/claude/tts/voices-v1.0.bin'))
dur={}
for n,L in enumerate(lines):
    print(n,L['h'],len(L['t']),flush=True)
    mp3=os.path.join(OUT,L['h']+'.mp3')
    if not os.path.exists(mp3):
        text=L['t'];speed=1.12 if len(text)>40 else 1.08
        import re,numpy as np
        parts=[p for p in re.split(r'(?<=[.!?])\s+',text) if p.strip()] or [text]
        chunks=[];sr=24000
        for p in parts:
            a,sr=k.create(p,voice=VOICE,speed=speed,lang='en-gb' if VOICE.startswith('b') else 'en-us')
            chunks+= [a,np.zeros(int(sr*(.22 if len(parts)>1 else 0)),dtype=a.dtype)]
        sf.write('/tmp/v.wav',np.concatenate(chunks),sr)
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i','/tmp/v.wav','-af','silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-1.5','-ac','1','-ar','24000','-c:a','libmp3lame','-b:a','48k',mp3],check=True)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp3]))
    dur[L['h']]=round(d,2)
json.dump(dur,open(os.path.join(R,'src','voices.json'),'w'))
print(len(dur),'lines',round(sum(dur.values())),'s total')

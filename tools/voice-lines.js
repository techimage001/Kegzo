// Lists every line the coach speaks, so each can be pre-recorded (tools/make-voice.py)
const {EX,INTRO}=require('../src/exercises.js');
const L=new Set();
const add=t=>{if(t)L.add(t)};
['Squeeze','Hold','Relax','Up a floor','Down a floor','Breathe in and drop','Lift your hips','Lower your hips and let go','Lift your knees into the plank','Slowly open your knees','Tilt your pelvis','Roll back to neutral','Breathe in, belly rises, let it drop','Breathe out slowly','Knees back together','Knees down','Knee in, and squeeze','Leg back, let it go',
 'Keep breathing','Bum stays soft','Belly relaxed','Thighs loose','Session complete. Great work.','Sound is working. You will hear the coach and the countdown.'].forEach(add);
for(let i=1;i<=30;i++)add(String(i));
for(const id in EX){add(INTRO(id));add('Nice work. Rest and breathe. Next up, '+EX[id].n)}
const h=t=>{let x=0x811c9dc5;for(let i=0;i<t.length;i++){x^=t.charCodeAt(i);x=Math.imul(x,0x01000193)>>>0}return x.toString(16).padStart(8,'0')};
process.stdout.write(JSON.stringify([...L].map(t=>({t,h:h(t)}))));

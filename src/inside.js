/* ================= INSIDE VIEW (close-up of the pelvic floor) ================= */
function mvInit(){$('#mv').innerHTML=`<svg viewBox="0 0 300 300" aria-hidden="true">
<defs><radialGradient id="mg"><stop offset="0" stop-color="#3DDC84" stop-opacity=".18"/><stop offset="1" stop-color="#3DDC84" stop-opacity="0"/></radialGradient></defs>
<circle cx="150" cy="150" r="146" fill="url(#mg)"/><circle cx="150" cy="150" r="128" fill="none" stroke="#2A2450" stroke-width="12"/>
<circle id="mvRing" cx="150" cy="150" r="128" fill="none" stroke="#3DDC84" stroke-width="12" stroke-linecap="round" transform="rotate(-90 150 150)" stroke-dasharray="804" stroke-dashoffset="804"/>
<g fill="none" stroke="#8E84CF" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M76 92c-6 34 4 62 30 80"/><path d="M224 92c6 34-4 62-30 80"/><path d="M96 108c16 10 34 14 54 14s38-4 54-14" stroke-dasharray="3 9"/></g>
<path id="mvHalo" fill="none" stroke-width="32" stroke-linecap="round"/><path id="mvBand" fill="none" stroke-width="11" stroke-linecap="round"/><path id="mvArrow" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function mvDraw(L,prog){const y=196,cy=y+30-L*62,lx=104,rx=196,ly=y-L*14,d=`M${lx} ${ly}Q150 ${cy} ${rx} ${ly}`,hot=L>=0,col=hot?'#3DDC84':'#6FB7FF';
 const b=$('#mvBand'),h=$('#mvHalo'),a=$('#mvArrow');b.setAttribute('d',d);b.setAttribute('stroke',col);h.setAttribute('d',d);h.setAttribute('stroke',col);h.style.opacity=.12+Math.abs(L)*.25;
 const ay=cy-30;if(Math.abs(L)>.08){a.setAttribute('stroke',col);a.setAttribute('d',hot?`M138 ${ay+2}l12-12 12 12`:`M138 ${ay+48}l12 12 12-12`);a.style.opacity=Math.min(1,Math.abs(L)*1.6)}else a.style.opacity=0;
 $('#mvRing').setAttribute('stroke',col);$('#mvRing').setAttribute('stroke-dashoffset',804*(1-prog))}


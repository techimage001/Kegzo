/* ================= FIGURE ENGINE (two-bone IK, poses as targets) ================= */
const LEN={torso:54,neck:20,ua:30,fa:28,th:46,sh:44,ft:14},FLOOR=262;
const rad=a=>a*Math.PI/180,dir=a=>[Math.sin(rad(a)),Math.cos(rad(a))],add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k];
function ik(R,T,a,b,s){const dx=T[0]-R[0],dy=T[1]-R[1];let d=Math.hypot(dx,dy);d=Math.max(Math.abs(a-b)+.5,Math.min(a+b-.3,d));
 const base=Math.atan2(dy,dx),A=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d)))),g=base+s*A;
 return[[R[0]+a*Math.cos(g),R[1]+a*Math.sin(g)],[R[0]+d*Math.cos(base),R[1]+d*Math.sin(base)]]}
const lerp=(a,b,u)=>a+(b-a)*u;
function lerpP(a,b,u){if(typeof a==='number'&&typeof b==='number')return lerp(a,b,u);if(Array.isArray(a)&&Array.isArray(b))return a.map((x,i)=>lerp(x,b[i],u));
 if(a&&b&&typeof a==='object'){const o={};for(const k in b)o[k]=(k in a)?lerpP(a[k],b[k],u):b[k];return o}return u<.5&&a!==undefined?a:b}
function solve(P){const td=dir(P.t),N=add(P.p,td,LEN.torso),H=add(N,dir(P.h),LEN.neck);const S={P:P.p,N,H,hip:{L:P.p,R:P.p},sh:{L:N,R:N}};
 for(const s of['L','R']){const L=P[s];const[kn,an]=ik(P.p,L.a,LEN.th,LEN.sh,L.k);const toe=add(an,dir(L.f),LEN.ft);const[el,hd]=ik(N,L.hd,LEN.ua,LEN.fa,L.e);S[s]={kn,an,toe,el,hd}}return S}
const COL={near:'#ECE7FF',far:'#8E84CF',glow:'rgba(160,140,255,.75)'};
function line(c,a,b,w,col){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
function draw(c,S,o={}){const g=o.g||1,pf=o.pf||0;c.lineCap='round';c.lineJoin='round';
 const gr=c.createLinearGradient(-100,0,500,0);gr.addColorStop(0,'rgba(140,120,255,0)');gr.addColorStop(.5,'rgba(140,120,255,.45)');gr.addColorStop(1,'rgba(140,120,255,0)');c.shadowBlur=0;line(c,[-100,FLOOR],[500,FLOOR],2,gr);
 const sx=(S.P[0]+(S.L.an[0]+S.R.an[0])/2)/2,rg=c.createRadialGradient(sx,FLOOR,2,sx,FLOOR,90);rg.addColorStop(0,'rgba(120,100,255,.28)');rg.addColorStop(1,'rgba(120,100,255,0)');c.fillStyle=rg;c.beginPath();c.ellipse(sx,FLOOR+2,90,9,0,0,7);c.fill();
 if(o.chair){c.shadowColor='rgba(140,120,255,.5)';c.shadowBlur=8*g;const cc='#5E55A0';line(c,[164,208],[216,208],7,cc);line(c,[168,208],[168,FLOOR],5,cc);line(c,[210,208],[210,FLOOR],5,cc);line(c,[164,208],[160,140],6,cc)}
 const B=(far)=>{c.shadowColor=COL.glow;c.shadowBlur=(far?6:14)*g;return far?COL.far:COL.near};
 const leg=(s,far)=>{const col=B(far),L=S[s];line(c,S.P,L.kn,16,col);line(c,L.kn,L.an,12.5,col);line(c,L.an,L.toe,8,col)};
 const arm=(s,far)=>{const col=B(far),A=S[s];line(c,S.N,A.el,11,col);line(c,A.el,A.hd,9,col);c.fillStyle=col;c.beginPath();c.arc(A.hd[0],A.hd[1],5.5,0,7);c.fill()};
 const torso=()=>{const col=B(),mid=lerpP(S.P,S.N,.55);line(c,S.P,mid,24,col);line(c,mid,S.N,28,col);line(c,S.N,lerpP(S.N,S.H,.55),10,col);c.fillStyle=col;c.beginPath();c.arc(S.H[0],S.H[1],12.5,0,7);c.fill()};
 arm('L',true);leg('L',true);torso();leg('R');arm('R');
 /* pelvic floor glow: coral = squeeze, aqua = drop */
 const a=Math.abs(pf),hot=pf>=0,p=add(S.P,dir(S.P===S.N?0:0),0),r=18+a*20;c.shadowBlur=0;
 const rg2=c.createRadialGradient(p[0],p[1],1,p[0],p[1],r);rg2.addColorStop(0,hot?`rgba(255,107,74,${.25+.65*a})`:`rgba(91,214,201,${.25+.65*a})`);rg2.addColorStop(1,hot?'rgba(255,107,74,0)':'rgba(91,214,201,0)');c.fillStyle=rg2;c.beginPath();c.arc(p[0],p[1],r,0,7);c.fill();
 c.fillStyle=hot?'#FF6B4A':'#5BD6C9';c.globalAlpha=.6+.4*a;c.beginPath();c.arc(p[0],p[1],4+a*3,0,7);c.fill();c.globalAlpha=1}
function fit(cv,C){const r=cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}
 const c=cv.getContext('2d'),s=Math.min(w/400,h/300)*C[2];c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w,h);c.setTransform(s,0,0,s,w/2-C[0]*s,h*(h>w*.8?.62:.58)-C[1]*s);return[c,s]}

/* ================= POSITIONS ================= */
const side=o=>Object.assign({v:'side'},o);
const POS={
 lying:{n:'Lying down',img:'pos-lying.webp',pt:[.335,.64],cam:[186,232,1.75],keys:[side({p:[184,252],t:90,h:92,L:{a:[124,253],f:-90,k:1,hd:[180,255],e:-1},R:{a:[128,254],f:-90,k:1,hd:[186,256],e:-1}})],
  how:'Lie on your back, knees bent, feet flat. The easiest position because gravity helps.'},
 seated:{n:'Seated',img:'pos-seated.webp',chair:1,cam:[194,200,1.4],keys:[side({p:[182,198],t:180,h:180,L:{a:[226,255],f:90,k:-1,hd:[212,196],e:1},R:{a:[230,255],f:90,k:-1,hd:[216,198],e:1}})],
  how:'Sit upright on a firm chair, feet flat, weight spread across both sit bones.'},
 standing:{n:'Standing',img:'pos-standing.webp',cam:[200,192,1.3],keys:[side({p:[200,167],t:180,h:180,L:{a:[198,255],f:90,k:-1,hd:[199,172],e:1},R:{a:[202,255],f:90,k:-1,hd:[203,172],e:1}})],
  how:'Stand tall, feet hip-width apart, knees soft. Harder, because the muscle works against gravity.'},
 walking:{n:'Walking',img:'pos-walking.webp',walk:1,cam:[200,192,1.3],keys:[side({p:[200,168],t:178,h:180,L:{a:[226,255],f:90,k:-1,hd:[186,170],e:1},R:{a:[176,250],f:112,k:-1,hd:[218,166],e:1}}),side({p:[200,168],t:178,h:180,L:{a:[176,250],f:112,k:-1,hd:[218,166],e:1},R:{a:[226,255],f:90,k:-1,hd:[186,170],e:1}})],
  how:'Walk at an easy pace and hold the squeeze for a few steps. This trains the muscle for everyday life.'}};
const IMG={};const PORDER=['lying','seated','standing','walking'];
function Fig(posId){const P=POS[posId];return{P,t:0,pose:P.keys[0],
 step(dt){this.t+=dt;if(P.walk){const u=(Math.sin(this.t*Math.PI/.55)+1)/2;this.pose=lerpP(P.keys[0],P.keys[1],u);this.pose.p=[200,168-Math.abs(Math.cos(this.t*Math.PI/.55))*3]}
  else{const b=Math.sin(this.t*1.4)*.8;this.pose=Object.assign({},P.keys[0],{t:P.keys[0].t+b*.6})}},
 render(cv,pf,z=1,lift=0){const now=performance.now()/1000,dt=Math.min(.1,now-(this.lt||now));this.lt=now;
  if(P.img){if(!cv._h)cv._h=Holo(cv);const c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);cv._h.w.style.display='block';holoDraw(cv._h,posOf(P),pf,this.t,dt,lift)}
  else{if(cv._h)cv._h.w.style.display='none';const C=P.cam;const[c,s]=fit(cv,[C[0],C[1],C[2]*z]);draw(c,solve(this.pose),{g:s,pf,chair:P.chair})}}}}
const posOf=P=>Object.keys(POS).find(k=>POS[k]===P);
/* ================= HOLOGRAM RENDERER (WebGL warp + x-ray pelvic floor + particles) ================= */
const IW=1448,IH=1086;
const RIG={
 lying:{A:[470,625],B:[505,730],U:[1,0],C:[900,640],HP:[600,700],floor:.905},
 standing:{A:[668,585],B:[760,565],U:[0,-1],C:[735,300],floor:.915},
 seated:{A:[868,652],B:[945,668],U:[0,-1],C:[880,380],floor:.905},
 walking:{A:[720,575],B:[640,548],U:[0,-1],C:[740,330],floor:.905,walk:1}};
const VS='attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const FS=`precision mediump float;uniform sampler2D tx;uniform float t,L,br,bob,lf;uniform vec2 HP;uniform vec2 P,U,C;varying vec2 v;
const vec2 K=vec2(1.3333,1.);float g(vec2 d,float r){return exp(-dot(d,d)/(r*r));}
void main(){vec2 uv=v,d=vec2(0.);
 d+=(uv-C)*.035*br*g((uv-C)*K,.13);
 d+=U*L*.016*g((uv-P)*K,.06);
 float wl=g((uv-HP)*K,.17)*(1.-smoothstep(.80,.88,uv.y));d.y-=.075*lf*wl;
 d.y+=bob;
 vec4 c=texture2D(tx,uv-d);vec3 bg=vec3(.065,.04,.17);
 float a=smoothstep(.03,.17,length(c.rgb-bg)),lum=dot(c.rgb,vec3(.3,.5,.2));
 float pg=g((uv-P)*K,.075);vec3 tint=L>=0.?vec3(1.,.42,.29):vec3(.36,.84,.79);
 c.rgb=mix(c.rgb,tint*(.35+lum*1.5),clamp(pg*abs(L)*.62,0.,1.)*a);
 c.rgb+=a*.03*sin(uv.y*1100.+t*8.);
 float sw=exp(-pow((uv.x-(fract(t*.16)*1.8-.4))/.03,2.));c.rgb+=a*sw*.18*vec3(.85,.8,1.);
 c.rgb*=1.+.06*abs(L);
 float e=smoothstep(0.,.07,uv.x)*smoothstep(0.,.07,1.-uv.x)*smoothstep(0.,.06,uv.y)*smoothstep(0.,.03,1.-uv.y);a*=e;
 gl_FragColor=vec4(c.rgb*a,a);}`;
function Holo(cv){const w=document.createElement('div');w.className='hwrap';
 w.innerHTML='<canvas class="hgl"></canvas><canvas class="hfx"></canvas><img class="hfb" alt="">';cv.after(w);
 const gc=w.querySelector('.hgl'),fx=w.querySelector('.hfx'),fb=w.querySelector('.hfb');
 let gl=null;try{gl=gc.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false})}catch(e){}
 const H={w,gl,fx,fb,pos:'',tex:null,ready:false,parts:[],rings:[],lastL:0,br:.5,t:0};
 if(gl){const sh=(ty,src)=>{const s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);return s};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){H.gl=gl=null}else{gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
   const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   H.u={};['t','L','br','bob','P','U','C','tx','lf','HP'].forEach(k=>H.u[k]=gl.getUniformLocation(pr,k));H.tex=gl.createTexture();gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA)}}
 if(!gl){gc.style.display='none';fb.style.display='block'}
 return H}
function holoSet(H,posId){if(H.pos===posId)return;H.pos=posId;H.ready=false;H.parts=[];H.rings=[];const src=IMG[POS[posId].img]||POS[posId].img;
 if(!H.gl){H.fb.src=src;H.ready=true;return}
 const im=new Image();im.onload=()=>{const gl=H.gl;gl.bindTexture(gl.TEXTURE_2D,H.tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);H.ready=true};im.src=src}
function sizeC(c){const r=c.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(c.width!==w||c.height!==h){c.width=w;c.height=h}return[w,h]}
function holoDraw(H,posId,L,t,dt,lift=0){holoSet(H,posId);const R=RIG[posId],nx=v=>[v[0]/IW,v[1]/IH];
 const A=nx(R.A),B=nx(R.B),Pm=[(A[0]+B[0])/2,(A[1]+B[1])/2],C=nx(R.C);
 const bt=L<-.1?1:L>.3?.15:.5+.35*Math.sin(t*1.1);H.br+=(bt-H.br)*Math.min(1,dt*2.2);
 const bob=R.walk?-.007*Math.abs(Math.sin(t*Math.PI/.55)):0;
 if(H.gl&&H.ready){const gl=H.gl,[w,h]=sizeC(H.w.querySelector('.hgl'));gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(H.u.t,t);gl.uniform1f(H.u.L,L);gl.uniform1f(H.u.br,H.br);gl.uniform1f(H.u.bob,bob);gl.uniform2f(H.u.P,Pm[0],Pm[1]);gl.uniform2f(H.u.U,R.U[0],R.U[1]);gl.uniform2f(H.u.C,C[0],C[1]);gl.uniform1i(H.u.tx,0);gl.uniform1f(H.u.lf,lift);const hp=R.HP?nx(R.HP):[0,0];gl.uniform2f(H.u.HP,hp[0],hp[1]);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
 else if(!H.gl){H.fb.style.transform=`translateY(${bob*100}%) scale(${1+.004*H.br})`;H.fb.style.filter=`brightness(${1+.12*Math.abs(L)})`}
 /* --- overlay: x-ray pelvic floor sling, particles, pulse rings, treadmill --- */
 const [w,h]=sizeC(H.fx),c=H.fx.getContext('2d');c.clearRect(0,0,w,h);
 const hpn=R.HP?nx(R.HP):null,X=p=>{let dy=0;if(hpn&&lift){const dx=(p[0]-hpn[0])*1.3333,dd=p[1]-hpn[1];dy=-.075*lift*Math.exp(-(dx*dx+dd*dd)/(.17*.17))*(1-Math.min(1,Math.max(0,(p[1]-.8)/.08)))}return[p[0]*w,(p[1]+bob+dy)*h]},a=X(A),b=X(B),m=[(a[0]+b[0])/2,(a[1]+b[1])/2],U=R.U,sag=w*(.026-.03*L),cp=[m[0]-U[0]*sag,m[1]-U[1]*sag];
 const hot=L>=0,k=Math.abs(L),col=hot?[255,107,74]:[91,214,201],mix=(x,y,u)=>Math.round(x+(y-x)*u),base=[214,205,255];
 const rgb=`${mix(base[0],col[0],Math.min(1,k*1.4))},${mix(base[1],col[1],Math.min(1,k*1.4))},${mix(base[2],col[2],Math.min(1,k*1.4))}`;
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]),nrm=[-(b[1]-a[1])/len,(b[0]-a[0])/len],lw=Math.max(2,w*.0075);
 c.lineCap='round';c.globalCompositeOperation='lighter';
 for(let i=-1;i<=1;i++){const o=i*lw*1.1;c.strokeStyle=`rgba(${rgb},${i?.45:.95})`;c.shadowColor=`rgba(${rgb},.9)`;c.shadowBlur=lw*(3+4*k);c.lineWidth=i?lw*.55:lw;
  c.beginPath();c.moveTo(a[0]+nrm[0]*o,a[1]+nrm[1]*o);c.quadraticCurveTo(cp[0]+nrm[0]*o*1.6,cp[1]+nrm[1]*o*1.6,b[0]+nrm[0]*o,b[1]+nrm[1]*o);c.stroke()}
 c.shadowBlur=0;[a,b].forEach(p=>{c.fillStyle=`rgba(${rgb},.9)`;c.beginPath();c.arc(p[0],p[1],lw*.9,0,7);c.fill()});
 const sc=[(a[0]+2*cp[0]+b[0])/4,(a[1]+2*cp[1]+b[1])/4];
 if(L>.45&&H.lastL<=.45)H.rings.push({r:0,a:1,c:'255,107,74'});if(L<-.35&&H.lastL>=-.35)H.rings.push({r:0,a:.8,c:'91,214,201'});H.lastL=L;
 H.rings=H.rings.filter(r=>(r.r+=dt*w*.12,r.a-=dt*1.1)>0);H.rings.forEach(r=>{c.strokeStyle=`rgba(${r.c},${r.a*.7})`;c.lineWidth=lw*.6;c.beginPath();c.arc(sc[0],sc[1],r.r+lw,0,7);c.stroke()});
 const n=Math.random()<k*1.1?1:0;
 for(let i=0;i<n;i++){const ang=Math.random()*6.283;if(hot){const R0=w*(.07+Math.random()*.05);H.parts.push({x:sc[0]+Math.cos(ang)*R0,y:sc[1]+Math.sin(ang)*R0,tx:sc[0],ty:sc[1],life:0,max:.7,hot:1})}
  else H.parts.push({x:sc[0]+(Math.random()-.5)*len*.6,y:sc[1],vx:(-U[0]+(Math.random()-.5)*.8)*w*.05,vy:(-U[1]+(Math.random()-.5)*.8)*w*.05,life:0,max:1.2,hot:0})}
 H.parts=H.parts.filter(p=>(p.life+=dt)<p.max);
 H.parts.forEach(p=>{const u=p.life/p.max;if(p.hot){p.x+=(p.tx-p.x)*Math.min(1,dt*5);p.y+=(p.ty-p.y)*Math.min(1,dt*5)}else{p.x+=p.vx*dt;p.y+=p.vy*dt}
  const al=Math.sin(u*Math.PI),rr=lw*(p.hot?.55:.7);c.fillStyle=p.hot?`rgba(255,150,120,${al})`:`rgba(120,230,215,${al*.8})`;c.beginPath();c.arc(p.x,p.y,rr,0,7);c.fill()});
 if(k>.12){c.globalCompositeOperation='lighter';const dirv=hot?[U[0],U[1]]:[-U[0],-U[1]],pr=[-dirv[1],dirv[0]],ph=(t*1.6)%1;for(let j=0;j<3;j++){const q=(ph+j/3)%1,dist=w*(.035+.07*q),al=Math.sin(q*Math.PI)*Math.min(1,k*1.5),cx=sc[0]+dirv[0]*dist,cy=sc[1]+dirv[1]*dist,sz=w*.016;c.strokeStyle=`rgba(${hot?'255,140,110':'110,225,210'},${al})`;c.lineWidth=Math.max(2,w*.005);c.shadowColor=c.strokeStyle;c.shadowBlur=lw*2;c.beginPath();c.moveTo(cx-pr[0]*sz-dirv[0]*sz*.8,cy-pr[1]*sz-dirv[1]*sz*.8);c.lineTo(cx,cy);c.lineTo(cx+pr[0]*sz-dirv[0]*sz*.8,cy+pr[1]*sz-dirv[1]*sz*.8);c.stroke()}c.shadowBlur=0}
 if(R.walk){const fy=R.floor*h,sp=w*.06,off=(t*w*.12)%sp;c.strokeStyle='rgba(160,140,255,.35)';c.lineWidth=Math.max(1,w*.002);for(let x=-off;x<w;x+=sp){c.beginPath();c.moveTo(x,fy+h*.012);c.lineTo(x+sp*.45,fy+h*.012);c.stroke()}}
 c.globalCompositeOperation='source-over'}


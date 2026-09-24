// Adapted from Acewallet's watch-pay.js: same model, loader, screen slot and camera pose.
import * as THREE from './vendor/three/build/three.module.js';
import { GLTFLoader } from './vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './vendor/three/examples/jsm/loaders/DRACOLoader.js';

const stage = document.querySelector('#stage');
const media = matchMedia('(prefers-reduced-motion: reduce)');
let active = true;
let frame = 0;
let disposed = false;
let last = 0;
let elapsed = 0;
let pointerX = 0;
let pointerY = 0;
let smoothX = 0;
let smoothY = 0;
let paused = false;
let lastPhase = -1;
let lastScreen = -1;
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t=clamp(value); return t*t*(3-2*t); };
const progress = (t,a,b) => ease((t-a)/(b-a));
const receipt = document.querySelector('.decision-receipt');
const receiptTitle = document.querySelector('#receipt-title');
const receiptDetail = document.querySelector('#receipt-detail');
const checkpoint = new URLSearchParams(location.search).get('t');
if(checkpoint !== null) { elapsed=Math.max(0, Math.min(15.9, Number(checkpoint)||0)); paused=true; }
let renderer;
const resources = new Set();

function fail() {
  document.body.classList.add('error');
  document.body.classList.remove('ready');
  parent.postMessage({type:'deltanet-watch-state',state:'fallback'}, location.origin);
}

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(2); // A small, lazy scene: keep the watch edges and screen crisp at 1x too.
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 1, .05, 100);
  camera.position.set(0, .08, 7.2);
  camera.lookAt(0, .02, 0);
  const rig = new THREE.Group();
  scene.add(rig);

  // Reuse Acewallet's neutral studio environment; omit its green and blue accent lights.
  const studio = document.createElement('canvas');
  studio.width = 512; studio.height = 256;
  const sx = studio.getContext('2d');
  const gradient = sx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#868686'); gradient.addColorStop(.3, '#474747');
  gradient.addColorStop(.52, '#141414'); gradient.addColorStop(.72, '#333333'); gradient.addColorStop(1, '#111111');
  sx.fillStyle = gradient; sx.fillRect(0, 0, 512, 256);
  // Acewallet's softbox reflections give the case a defined metallic edge.
  for(const [x,y,r,stretch] of [[150,75,130,.45],[390,90,95,.65],[50,170,70,1.3]]) {
    const light=sx.createRadialGradient(x,y,0,x,y,r); light.addColorStop(0,'#ffffff');light.addColorStop(.3,'#e8e8e8');light.addColorStop(1,'#ffffff00');
    sx.save();sx.translate(x,y);sx.scale(1,stretch);sx.translate(-x,-y);sx.fillStyle=light;sx.beginPath();sx.arc(x,y,r,0,Math.PI*2);sx.fill();sx.restore();
  }
  const environment = new THREE.CanvasTexture(studio);
  environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromEquirectangular(environment);
  scene.environment = environmentTarget.texture;
  resources.add(environmentTarget); environment.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, .65));
  const key = new THREE.DirectionalLight(0xffffff, 2.8); key.position.set(4.2, 5, 4.8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.5); rim.position.set(-4.8, 1.4, 2.6); scene.add(rim);

  const screen = document.createElement('canvas');
  screen.width = 2048; screen.height = 2048;
  const ctx = screen.getContext('2d');
  ctx.scale(2,2);
  const texture = new THREE.CanvasTexture(screen);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  resources.add(texture);
  const logo = new Image();
  logo.src = '/logo-options/split-delta.svg';
  await logo.decode();
  const mark = document.createElement('canvas'); mark.width = 100; mark.height = 100;
  const mx = mark.getContext('2d'); mx.drawImage(logo, 8, 8, 84, 84); mx.globalCompositeOperation = 'source-in'; mx.fillStyle = '#fff'; mx.fillRect(0, 0, 100, 100);

  function roundRect(x,y,w,h,r,fill) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill(); }
  function text(value,x,y,size,color='#ededed',weight=450) { ctx.font=`${weight} ${size}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`; ctx.fillStyle=color; ctx.fillText(value,x,y); }
  // Apple's long-look structure: app identity, concise title/body, action below.
  // This is interface rendering on the original display mesh, not generated imagery.
  function drawScreen(t) {
    ctx.clearRect(0,0,1024,1024);
    roundRect(44,54,936,916,182,'#000');
    ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.drawImage(mark,110,121,65,65); text('DeltaNet',190,155,43,'#bcbcbc',550);
    text('9:41',796,155,40,'#aaa');
    const show=progress(t,.7,1.5)*(1-progress(t,14.2,15.5));
    ctx.save();ctx.globalAlpha=show;
    const approved=t>=6.2;
    if(t<7.5) {
      text('Your call.',105,316,100,'#f6f6f6',600);
      text('Send the update?',108,453,66,'#e3e3e3',500);
      text('Prepared by Noura',108,550,48,'#999');
      text('Ready for your review.',108,633,45,'#999');
      const press=progress(t,5.7,6)*(1-progress(t,6.1,6.4));
      const inset=press*13;
      roundRect(104+inset,748+inset*.3,816-inset*2,142-inset*.6,69,approved ? '#ededed' : '#292929');
      ctx.textAlign='center';text(approved ? 'Approved' : 'Approve',512,819,66,approved ? '#141414' : '#f5f5f5',600);
      if(t>5.65 && t<6.5) {
        const tap=clamp((t-5.65)/.85);ctx.strokeStyle=`rgba(255,255,255,${(1-tap)*.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(725,815,22+tap*76,0,Math.PI*2);ctx.stroke();
      }
    } else {
      ctx.strokeStyle='#e5e5e5';ctx.lineWidth=6;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(512,369,89,-Math.PI/2,-Math.PI/2+Math.PI*2*progress(t,7.5,8.8));ctx.stroke();
      if(t>=10) {ctx.beginPath();ctx.moveTo(470,369);ctx.lineTo(501,399);ctx.lineTo(553,341);ctx.stroke();}
      ctx.textAlign='center';text(t<10 ? 'On its way.' : 'Sent.',512,541,t<10 ? 78 : 100,'#f4f4f4',600);
      text(t<10 ? 'Noura’s agent' : 'Your team',512,674,55,'#aaa');
      text(t<10 ? 'is taking it from here.' : 'keeps moving.',512,747,55,'#aaa');
    }
    ctx.restore();texture.needsUpdate=true;
  }
  drawScreen(media.matches ? 11 : elapsed);

  const draco = new DRACOLoader();
  draco.setDecoderPath('./vendor/three/examples/jsm/libs/draco/');
  draco.setWorkerLimit(1);
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  const gltf = await loader.loadAsync('./watch.glb');
  draco.dispose();
  if (disposed) throw new Error('Watch unmounted');
  const stale = new Set(['KsxIrenucRYdQlx','scpcAfQFCzMwocy','dutMHxWYxKkWoIl']);
  gltf.scene.traverse(node => {
    if (!node.isMesh) return;
    if (stale.has(node.name)) { node.visible=false; return; }
    resources.add(node.geometry);
    if (node.name === 'wmnqxNpNCdRfDfA') {
      node.material = new THREE.MeshBasicMaterial({map:texture, toneMapped:false});
      resources.add(node.material); return;
    }
    const band = node.name === 'yFPJxjHCZaMTTSP' || node.name === 'hFurRdLJljkLFkB';
    for(const mat of Array.isArray(node.material) ? node.material : [node.material]) {
      resources.add(mat);
      for(const value of Object.values(mat)) if(value?.isTexture) resources.add(value);
      mat.envMapIntensity=1.2;
      if(mat.normalScale) mat.normalScale.setScalar(band ? .35 : .18);
      if('roughness' in mat) mat.roughness=band ? .78 : Math.min(.38,Math.max(.2,mat.roughness ?? .3));
      if('metalness' in mat) mat.metalness=band ? 0 : Math.min(.92,mat.metalness ?? .5);
      if(!band && mat.metalness > .6) {mat.roughness=.22;mat.envMapIntensity=1.45;}
      mat.onBeforeCompile=shader => {
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\nfloat neutral = dot(diffuseColor.rgb, vec3(0.2126,0.7152,0.0722));\ndiffuseColor.rgb = vec3(neutral * ${band ? '0.10' : '1.0'});`);
      };
      mat.customProgramCacheKey=()=>band ? 'deltanet-band' : 'deltanet-metal';
    }
  });
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const scale = 3.45 / size.y;
  gltf.scene.scale.setScalar(scale);
  gltf.scene.position.copy(center).multiplyScalar(-scale);
  rig.add(gltf.scene);
  rig.scale.setScalar(.85);
  rig.rotation.set(.58, -.10, -.08);

  function resize() {
    const w=stage.clientWidth, h=stage.clientHeight;
    renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(stage); resize();
  function render(now) {
    frame=0;
    if(disposed || !active || document.hidden) return;
    const delta=last ? Math.min((now-last)/1000,.05) : 0; last=now;
    if(!media.matches && !paused) {
      elapsed=(elapsed+delta)%16;
      smoothX+=(pointerX-smoothX)*.055; smoothY+=(pointerY-smoothY)*.055;
      
    }
    const t=media.matches ? 11 : elapsed;
    const arrive=progress(t,0,1.6), resumeWork=progress(t,7,8.6), reset=progress(t,14,16);
    // A deliberate glance toward the wearer, a small press, then room for the receipt.
    const tap=progress(t,5.8,6.05)*(1-progress(t,6.1,6.5));
    rig.rotation.set(.57-smoothY*.025, (.34*(1-arrive)+.02*arrive)*(1-reset)+.34*reset +smoothX*.035, -.045*(1-arrive)+.01*arrive);
    rig.scale.setScalar(.91 - resumeWork*.10 + reset*.10 - tap*.015);
    rig.position.set(0,.13*resumeWork*(1-reset),-tap*.08);
    const phase=t<1.5 ? 0 : t<6.2 ? 1 : t<10 ? 2 : t<14.2 ? 3 : 0;
    if(phase!==lastPhase) {
      lastPhase=phase;document.body.dataset.phase=phase;stage.dataset.phase=phase;
      const copy=[['Your agent needs a decision','A quick review. Wherever you are.'],['Your agent needs a decision','A quick review. Wherever you are.'],['Approval received','Noura’s agent is sending the update.'],['Update sent','Shared progress. No follow-up needed.']][phase];
      receiptTitle.textContent=copy[0];receiptDetail.textContent=copy[1];
      stage.setAttribute('aria-label',`Apple Watch approval demo: ${copy.join('. ')}`);
      parent.postMessage({type:'deltanet-watch-phase',phase},location.origin);
    }
    receipt.style.opacity=String(progress(t,7,8)*(1-progress(t,14,15)));
    receipt.style.transform=`translate(-50%,${(1-progress(t,7,8))*8}px)`;
    const tick=Math.floor(t*30);if(tick!==lastScreen) {drawScreen(t);lastScreen=tick;}
    renderer.render(scene,camera);
    if(!media.matches && !paused) frame=requestAnimationFrame(render);
  }
  function resume() { if(frame) cancelAnimationFrame(frame); frame=0;last=0; if(active && !document.hidden) frame=requestAnimationFrame(render); }
  stage.addEventListener('pointermove',event => { if(event.pointerType==='touch') return; const r=stage.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5; });
  stage.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  // A real button-sized screen hit target using the model's display geometry.
  const raycaster=new THREE.Raycaster();
  stage.addEventListener('click',event=>{
    const r=stage.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX-r.left)/r.width*2-1,-((event.clientY-r.top)/r.height)*2+1),camera);
    const hit=raycaster.intersectObjects(rig.children,true).find(item=>item.object.name==='wmnqxNpNCdRfDfA');
    if(hit) { elapsed=5.7;paused=false;resume(); }
  });
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin || event.source!==parent) return;
    if(event.data?.type==='deltanet-watch-visibility') {active=event.data.visible;resume();}
    if(event.data?.type==='deltanet-watch-approve') {elapsed=5.7;paused=false;resume();}
    if(event.data?.type==='deltanet-watch-replay') {elapsed=0;paused=false;resume();}
    if(event.data?.type==='deltanet-watch-pause') {paused=event.data.paused;resume();}
  });
  document.addEventListener('visibilitychange',resume);
  media.addEventListener('change',resume);
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();for(const item of resources)item.dispose();renderer.dispose();},{once:true});
  document.body.classList.add('ready');
  parent.postMessage({type:'deltanet-watch-state',state:'ready'},location.origin);
  resume();
} catch(error) { console.warn('Watch preview unavailable:',error); fail(); }

import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const data={
context:{title:'Shared context',request:'Bring Omar up to speed on the checkout failure.',reply:'I found the incident, release thread, and runbook. Share them with his agent?',follow:'Yes. Include what we’ve tried.',result:'Sent. Omar has the brief and sources, with your latest notes.',pill:'3 sources ready to share',heading:'Context for Omar',description:'Only the context needed for this task.',rows:[['slack','Release investigation','#checkout-incidents'],['linear','Incident brief','ENG-241 · Checkout failure'],['google-drive','Incident runbook','Engineering · Google Drive']],foot:'Your private conversation stays private.',done:'Context received by Omar’s agent'},
skills:{title:'Shared skills',request:'Use our incident-response skill for this.',reply:'I’ll give Omar and Noura’s agents the same procedure.',follow:'Wait for verification before sending.',result:'Added. Verify first, then review the customer update. Both agents have the same skill.',pill:'Incident response · shared skill',heading:'Incident response',description:'One procedure. Two agents working together.',rows:[['doc','Investigate the release','Omar’s agent'],['doc','Verify recovery','Required before the update'],['doc','Review the customer update','Noura’s agent']],foot:'Shared with Omar’s and Noura’s agents.',done:'Both agents are using the same skill'},
coordination:{title:'Agent coordination',request:'Ask Omar to verify the fix before Noura sends the update.',reply:'On it. I’ll pass the verified result to Noura’s agent.',follow:'Let me know when it’s sent.',result:'Omar confirmed recovery. Noura approved the update, and her agent sent it.',pill:'2 agents · working together',heading:'Working with your team',description:'You stay in your own conversation.',rows:[['person','Your agent → Omar’s agent','Verify checkout recovery'],['person','Omar’s agent → Noura’s agent','Pass the verified result'],['person','Noura reviews the update','Her agent waits for approval']],foot:'People make the decisions.',done:'Approved update sent · task complete'}
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
for(const [id,d] of Object.entries(data)){
 const dir=path.join(root,id);fs.mkdirSync(dir,{recursive:true});
 fs.cpSync(path.join(root,'../../public/device/icons'),path.join(dir,'assets/icons'),{recursive:true});
 fs.cpSync(path.join(root,'../../public/apps'),path.join(dir,'assets/apps'),{recursive:true});
 fs.copyFileSync(path.join(root,'../../public/device/iphone-15-black.png'),path.join(dir,'assets/iphone-15-black.png'));
 fs.copyFileSync(path.join(root,'node_modules/gsap/dist/gsap.min.js'),path.join(dir,'gsap.min.js'));
 const icon=(name,cls='')=>`<i class="icon ${cls}" style="--icon:url('assets/icons/${name}.png')"></i>`;
 const rows=d.rows.map(([app,title,sub])=>`<div class="detail-row">${['doc','person'].includes(app)?icon(app==='doc'?'doc.text':'person.crop.circle.fill'):`<img src="assets/apps/${app}.svg">`}<span><strong>${title}</strong><small>${sub}</small></span>${icon(id === 'context' ? 'checkmark' : 'chevron.right','check')}</div>`).join('');
 fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><link rel="stylesheet" href="style.css"><script src="gsap.min.js"></script></head><body><div data-composition-id="phone-${id}" data-width="1040" data-height="1304" data-duration="40" style="width:1040px;height:1304px;position:relative;overflow:hidden"><div class="film-background"></div><div class="film-camera" data-layout-allow-overflow><div class="film-phone"><div class="screen"><div class="statusbar"><b>9:41</b><div>${icon('cellularbars')}${icon('wifi')}${icon('battery.100percent','battery')}</div></div><div class="app-nav"><div class="nav-start"><span class="nav-icon">${icon('line.3.horizontal')}</span><span class="app-name">DeltaNet ${icon('chevron.down')}</span></div><div class="nav-actions"><span class="nav-icon">${icon('square.and.pencil')}</span><span class="nav-icon">${icon('ellipsis')}</span></div></div><div class="private">${icon('lock.fill')} Your private workspace</div><div class="thread"><div class="thread-track"><p class="message user m0">${esc(d.request)}</p><p class="message assistant m1"></p><p class="message user m2">${esc(d.follow)}</p><p class="message assistant m3"></p></div></div><div class="bottom" data-layout-allow-overlap data-layout-allow-occlusion><div class="task-pill">${icon('arrow.clockwise','task-icon')}<span class="pill-copy" data-layout-allow-overlap data-layout-allow-occlusion>${d.pill}</span>${icon('chevron.right','chevron')}</div><div class="composer"><div class="draft" data-layout-allow-overlap data-layout-allow-occlusion>Message DeltaNet</div><div class="composer-tools"><div>${icon('plus')}${icon('person.badge.plus')}</div><div>${icon('mic')}<span class="send">${icon('arrow.up')}</span></div></div></div></div><div class="home"></div><div class="dimmer"></div><div class="sheet"><div class="handle"></div><div class="sheet-label">TASK DETAILS<span>${icon('xmark')}</span></div><h2>${d.heading}</h2><p class="sheet-description">${d.description}</p><div class="rows">${rows}</div><div class="sheet-footer">${icon('lock.fill')}${d.foot}</div></div><div class="tap"></div></div><img class="film-bezel" src="assets/iphone-15-black.png" width="1419" height="2796" alt=""></div></div></div><script>
const tl=gsap.timeline({paused:true});window.__timelines={'phone-${id}':tl};
const request=${JSON.stringify(d.request)},reply=${JSON.stringify(d.reply)},follow=${JSON.stringify(d.follow)},result=${JSON.stringify(d.result)};
function type(selector,text,start,seconds){tl.set(selector,{textContent:''},start);for(let i=1;i<=text.length;i++)tl.set(selector,{textContent:text.slice(0,i)},start+i/text.length*seconds)}
gsap.set('.message',{opacity:0});gsap.set('.sheet',{y:520,opacity:0});gsap.set('.dimmer,.tap,.task-pill',{opacity:0});
// The camera moves the complete device, so the bezel leaves the frame naturally on closeups.
tl.to('.film-camera',{scale:1.48,y:-490,duration:1.6,ease:'power2.inOut'},2);
type('.draft',request,1.5,4);tl.set('.draft',{textContent:'Message DeltaNet'},6).fromTo('.m0',{y:12,opacity:0},{y:0,opacity:1,duration:.35,ease:'power3.out'},6);
tl.to('.film-camera',{scale:1.48,y:310,duration:1.6,ease:'power2.inOut'},6.4);
tl.set('.m1',{opacity:1},8.2);type('.m1',reply,8.2,2.8);
tl.to('.task-pill',{opacity:1,duration:.35},12.3);
tl.to('.film-camera',{scale:1.48,y:-450,duration:1.6,ease:'power2.inOut'},14.1);
tl.set('.tap',{x:285,y:676,scale:.8},16.2).to('.tap',{opacity:.5,scale:1,duration:.16},16.2).to('.tap',{opacity:0,scale:1.2,duration:.25},16.36);
tl.to('.dimmer',{opacity:1,duration:.3},17).to('.sheet',{y:0,opacity:1,duration:.6,ease:'power3.out'},17);
tl.to('.film-camera',{scale:1.48,y:-345,duration:1.2,ease:'power2.inOut'},17.2);
[0,1,2].forEach((index)=>{const start=18.2+index*2.2;tl.to('.detail-row:nth-child('+(index+1)+')',{backgroundColor:'#303032',duration:.45},start).to('.detail-row:nth-child('+(index+1)+')',{backgroundColor:'#1c1c1e',duration:.5},start+1.75)});
tl.to('.sheet',{y:520,opacity:0,duration:.5,ease:'power2.inOut'},25.5).to('.dimmer',{opacity:0,duration:.5},25.5);
tl.to('.film-camera',{scale:1.48,y:-490,duration:1,ease:'power2.inOut'},25.7);
type('.draft',follow,26.3,2.2);tl.set('.draft',{textContent:'Message DeltaNet'},29).fromTo('.m2',{y:12,opacity:0},{y:0,opacity:1,duration:.35,ease:'power3.out'},29);
tl.set('.pill-copy',{textContent:'Working with the other agents'},29.5);
tl.to('.film-camera',{scale:1.38,y:245,duration:1.7,ease:'power2.inOut'},29.3);
tl.set('.m3',{opacity:1},31.2);type('.m3',result,31.2,3.2);
tl.set('.pill-copy',{textContent:${JSON.stringify(d.done)}},36);
tl.to('.film-camera',{scale:1,y:0,duration:1.8,ease:'power2.inOut'},36.5);
</script></body></html>`);
 fs.copyFileSync(path.join(root,'style.css'),path.join(dir,'style.css'));
}

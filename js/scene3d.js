import { abductionProgress } from './world3d-state.js';

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export async function createWorld3D(mount, labels, onReady) {
  await loadThree();
  const THREE = window.THREE;
  const world = new UfoWorld(THREE, mount, labels);
  world.setStudents(['An Nhiên', 'Bảo Ngọc', 'Gia Hân', 'Minh Khang', 'Thanh Vy']);
  world.start();
  onReady?.(world);
  return world;
}

function loadThree() {
  if (window.THREE) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = THREE_URL; script.onload = resolve; script.onerror = reject; document.head.append(script);
  });
}

class UfoWorld {
  constructor(THREE, mount, labels) {
    this.T = THREE; this.mount = mount; this.labels = labels; this.clock = new THREE.Clock();
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x04071b); this.scene.fog = new THREE.FogExp2(0x04071b, .015);
    this.camera = new THREE.PerspectiveCamera(47, 1, .1, 250);
    this.orbit = { theta: .55, phi: .93, radius: 35, dragging: false, x: 0, y: 0 };
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7)); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.replaceChildren(this.renderer.domElement);
    this.students = []; this.activeName = null; this.abducting = null; this.skin = { accent: 0x9af76d, accent2: 0x6ddaf7 };
    this.setupLights(); this.buildTown(); this.buildUfo(); this.bindCamera(); this.resize();
    new ResizeObserver(() => this.resize()).observe(mount);
  }
  setupLights() {
    const T = this.T; this.scene.add(new T.HemisphereLight(0x7dd3fc, 0x10152f, 1.65));
    const key = new T.DirectionalLight(0xbddcff, 1.55); key.position.set(22, 31, 19); key.castShadow = true; key.shadow.mapSize.set(1024,1024); key.shadow.camera.left=-28;key.shadow.camera.right=28;key.shadow.camera.top=28;key.shadow.camera.bottom=-28; this.scene.add(key);
  }
  buildTown() {
    const T=this.T; const ground = new T.Mesh(new T.CylinderGeometry(29,32,2,56),new T.MeshStandardMaterial({color:0x111a3b,roughness:.9}));ground.position.y=-1;ground.receiveShadow=true;this.scene.add(ground);
    const roadMat=new T.MeshStandardMaterial({color:0x242c51,roughness:.85});
    [[55,.14,6],[6,.14,55]].forEach(([x,y,z])=>{const road=new T.Mesh(new T.BoxGeometry(x,y,z),roadMat);road.position.y=.02;road.receiveShadow=true;this.scene.add(road);});
    const neon=new T.MeshBasicMaterial({color:0x38dff6}); const ring=new T.Mesh(new T.RingGeometry(4.8,5.12,40),neon);ring.rotation.x=-Math.PI/2;ring.position.y=.1;this.scene.add(ring);
    for(let n=-24;n<=24;n+=4){if(Math.abs(n)<6)continue; for(const [x,z,w,d] of [[n,0,1.7,.16],[0,n,.16,1.7]]){const dash=new T.Mesh(new T.BoxGeometry(w,.06,d),new T.MeshBasicMaterial({color:0x9af76d}));dash.position.set(x,.1,z);this.scene.add(dash)}}
    const configs=[[-13,-13,0xee7d8e],[-20,-8,0x806bf0],[-14,15,0x46b5db],[13,-13,0xfcbd55],[20,-8,0xa178ec],[14,15,0x49d8ac],[-21,8,0xff7595],[21,10,0x5cd3f3]];
    configs.forEach(([x,z,color],i)=>this.house(x,z,color,4.3+(i%3),4.2+(i%2)*1.2));
    for(const [x,z] of [[-8,-8],[8,-8],[-8,8],[8,8],[-18,2],[18,2],[-2,-18],[2,18]])this.tree(x,z);
    const stars=new T.BufferGeometry(), pos=[]; for(let i=0;i<500;i++){const r=52+Math.random()*72,a=Math.random()*Math.PI*2,p=Math.random()*Math.PI*.52;pos.push(r*Math.sin(p)*Math.cos(a),Math.abs(r*Math.cos(p))+7,r*Math.sin(p)*Math.sin(a))}stars.setAttribute('position',new T.Float32BufferAttribute(pos,3));this.stars=new T.Points(stars,new T.PointsMaterial({color:0xdff7ff,size:.52,transparent:true,opacity:.9}));this.scene.add(this.stars);
    this.planet=new T.Group();const p=new T.Mesh(new T.SphereGeometry(5.7,24,20),new T.MeshStandardMaterial({color:0x715ee8,emissive:0x27205c,emissiveIntensity:.8}));const pr=new T.Mesh(new T.RingGeometry(7,9.4,36),new T.MeshBasicMaterial({color:0x5fe1fb,transparent:true,opacity:.55,side:T.DoubleSide}));pr.rotation.x=1.08;this.planet.add(p,pr);this.planet.position.set(-31,23,-39);this.scene.add(this.planet);
  }
  house(x,z,color,w,h){const T=this.T,g=new T.Group(),body=new T.Mesh(new T.BoxGeometry(w,h,w),new T.MeshStandardMaterial({color,roughness:.58,metalness:.12}));body.position.y=h/2;body.castShadow=true;g.add(body);const roof=new T.Mesh(new T.ConeGeometry(w*.86,2.5,4),new T.MeshStandardMaterial({color:0x27335e,roughness:.5}));roof.position.y=h+1.22;roof.rotation.y=Math.PI/4;roof.castShadow=true;g.add(roof); for(let yi=1;yi<h;yi+=1.45)for(let xi=-1;xi<=1;xi+=2){const win=new T.Mesh(new T.PlaneGeometry(.65,.78),new T.MeshBasicMaterial({color:0xfff4a5}));win.position.set(xi*w*.25,yi,z?0:0);win.position.z=w/2+.01;g.add(win)}g.position.set(x,0,z);this.scene.add(g)}
  tree(x,z){const T=this.T,g=new T.Group(),tr=new T.Mesh(new T.CylinderGeometry(.23,.34,1.5,7),new T.MeshStandardMaterial({color:0x6f482e}));tr.position.y=.75;g.add(tr);[0,1].forEach((n)=>{const leaf=new T.Mesh(new T.ConeGeometry(1.35-n*.22,2.25,9),new T.MeshStandardMaterial({color:n?0x56de87:0x24b970}));leaf.position.y=2.05+n*.85;leaf.castShadow=true;g.add(leaf)});g.position.set(x,0,z);this.scene.add(g)}
  buildUfo(){const T=this.T;this.ufo=new T.Group();const hull=new T.Mesh(new T.CylinderGeometry(1.65,3.65,1.08,32),new T.MeshStandardMaterial({color:0xaebbd0,metalness:.8,roughness:.2}));hull.castShadow=true;this.ufo.add(hull);this.rimMat=new T.MeshStandardMaterial({color:this.skin.accent2,emissive:this.skin.accent2,emissiveIntensity:1.1});const rim=new T.Mesh(new T.TorusGeometry(3.67,.22,12,42),this.rimMat);rim.rotation.x=Math.PI/2;this.ufo.add(rim);const dome=new T.Mesh(new T.SphereGeometry(1.95,24,16,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:0x8bf4ff,transparent:true,opacity:.57,roughness:.1,metalness:.28}));dome.position.y=.42;this.ufo.add(dome);const alien=new T.Mesh(new T.SphereGeometry(.62,16,14),new T.MeshStandardMaterial({color:0xa2e75e,emissive:0x477319,emissiveIntensity:.4}));alien.position.y=1.1;this.ufo.add(alien);for(const x of [-.22,.22]){const eye=new T.Mesh(new T.SphereGeometry(.13,8,8),new T.MeshBasicMaterial({color:0x071020}));eye.position.set(x,1.2,.55);this.ufo.add(eye)}this.lights=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,orb=new T.Mesh(new T.SphereGeometry(.2,8,8),new T.MeshBasicMaterial({color:i%2?this.skin.accent:this.skin.accent2}));orb.position.set(Math.cos(a)*3.72,-.08,Math.sin(a)*3.72);this.ufo.add(orb);this.lights.push(orb)}this.beamMat=new T.MeshBasicMaterial({color:this.skin.accent,transparent:true,opacity:.13,side:T.DoubleSide,depthWrite:false});const beam=new T.Mesh(new T.ConeGeometry(4.6,14,32,1,true),this.beamMat);beam.geometry.translate(0,-7,0);beam.position.y=-.4;this.ufo.add(beam);this.beamRings=[];for(let i=0;i<4;i++){const r=new T.Mesh(new T.TorusGeometry(1.2+i*.64,.07,10,32),new T.MeshBasicMaterial({color:this.skin.accent2,transparent:true,opacity:.7}));r.rotation.x=Math.PI/2;r.position.y=-2-i*3;this.ufo.add(r);this.beamRings.push(r)}this.ufo.position.set(0,12,0);this.ufoTarget=this.ufo.position.clone();this.scene.add(this.ufo)}
  setStudents(names){this.students.forEach(a=>{this.scene.remove(a.group);a.label.remove()});this.students=[];names.forEach((name,i)=>{const T=this.T,g=new T.Group(),color=[0x55c8fa,0xa2e75e,0xff8fb7,0xffd35e,0xa98bff][i%5],mat=new T.MeshStandardMaterial({color,roughness:.45});const body=new T.Mesh(new T.CylinderGeometry(.4,.48,1.1,12),mat);body.position.y=1.08;body.castShadow=true;g.add(body);const head=new T.Mesh(new T.SphereGeometry(.49,14,12),new T.MeshStandardMaterial({color:0xf5fbff,roughness:.2}));head.position.y=1.96;g.add(head);const visor=new T.Mesh(new T.SphereGeometry(.34,12,10),new T.MeshStandardMaterial({color:0x208ec7,emissive:0x34d9f7,emissiveIntensity:.35,metalness:.8}));visor.position.set(0,1.98,.27);g.add(visor);const limbs=[];for(const [x,y] of [[-.18,.35],[.18,.35],[-.5,1.18],[.5,1.18]]){const limb=new T.Mesh(new T.CylinderGeometry(.11,.11,.65,7),new T.MeshStandardMaterial({color:0xe8efff}));limb.position.set(x,y,0);g.add(limb);limbs.push(limb)}const angle=i/Math.max(1,names.length)*Math.PI*2,dist=5+(i%3)*3.2,pos=new T.Vector3(Math.cos(angle)*dist,0,Math.sin(angle)*dist);g.position.copy(pos);this.scene.add(g);const label=document.createElement('span');label.className='student-3d-label';label.textContent=name;this.labels.append(label);this.students.push({name,group:g,label,pos,target:this.streetPoint(),speed:2.4+Math.random(),phase:Math.random()*7,limbs,abduct:false})})}
  streetPoint(){return Math.random()>.5?new this.T.Vector3((Math.random()-.5)*38,0,(Math.random()-.5)*4):new this.T.Vector3((Math.random()-.5)*4,0,(Math.random()-.5)*38)}
  setSkin(skin){this.skin={accent:parseInt(skin.accent.replace('#',''),16),accent2:parseInt(skin.accent2.replace('#',''),16)};this.rimMat.color.setHex(this.skin.accent2);this.rimMat.emissive.setHex(this.skin.accent2);this.beamMat.color.setHex(this.skin.accent);this.lights.forEach((x,i)=>x.material.color.setHex(i%2?this.skin.accent:this.skin.accent2))}
  abduct(name){const actor=this.students.find(x=>x.name===name);if(!actor)return;this.activeName=name;this.abducting={actor,start:this.clock.getElapsedTime()};this.ufoTarget.set(actor.pos.x,11.5,actor.pos.z);this.beamMat.opacity=.39}
  bindCamera(){const c=this.renderer.domElement;c.addEventListener('pointerdown',e=>{this.orbit.dragging=true;this.orbit.x=e.clientX;this.orbit.y=e.clientY});window.addEventListener('pointermove',e=>{if(!this.orbit.dragging)return;this.orbit.theta-=(e.clientX-this.orbit.x)*.007;this.orbit.phi=Math.max(.4,Math.min(1.38,this.orbit.phi-(e.clientY-this.orbit.y)*.006));this.orbit.x=e.clientX;this.orbit.y=e.clientY});window.addEventListener('pointerup',()=>this.orbit.dragging=false);c.addEventListener('wheel',e=>{e.preventDefault();this.orbit.radius=Math.max(19,Math.min(53,this.orbit.radius+e.deltaY*.025))},{passive:false})}
  resize(){const w=this.mount.clientWidth||800,h=this.mount.clientHeight||450;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h)}
  start(){this.renderer.setAnimationLoop(()=>this.tick())}
  tick(){const T=this.T,dt=Math.min(this.clock.getDelta(),.06),t=this.clock.getElapsedTime();this.students.forEach(a=>{if(a.abduct)return;const to=a.target.clone().sub(a.pos);to.y=0;if(to.length()<.6)a.target=this.streetPoint();else{to.normalize();a.pos.addScaledVector(to,a.speed*dt);a.pos.y=Math.abs(Math.sin(t*9+a.phase))*.18;a.group.position.copy(a.pos);a.group.rotation.y=Math.atan2(to.x,to.z)}const sw=Math.sin(t*12+a.phase)*.55;a.limbs.forEach((l,i)=>l.rotation.x=(i%2?1:-1)*sw)});if(!this.abducting){this.ufoTarget.set(Math.sin(t*.55)*9,12+Math.sin(t*1.4)*.5,Math.cos(t*.4)*7)}else{const elapsed=t-this.abducting.start,p=abductionProgress(elapsed);if(elapsed>.65){const a=this.abducting.actor;a.abduct=true;a.pos.lerp(new T.Vector3(this.ufo.position.x,this.ufo.position.y-1,this.ufo.position.z),Math.min(1,dt*3.8));a.pos.y+=dt*3.6;a.group.position.copy(a.pos);a.group.rotation.y+=dt*7}if(p>=1){this.abducting.actor.group.visible=false;this.abducting.actor.label.style.display='none';this.abducting=null;this.beamMat.opacity=.12}}this.ufo.position.lerp(this.ufoTarget,this.abducting?.08:.03);this.ufo.rotation.z=T.MathUtils.lerp(this.ufo.rotation.z,-(this.ufoTarget.x-this.ufo.position.x)*.05,.1);this.ufo.rotation.y+=dt*1.3;this.beamRings.forEach((r,i)=>{r.position.y=-1.2-((t*3+i*3)%12);const s=.5+Math.abs(r.position.y)/14;r.scale.set(s,s,1)});this.planet.rotation.y+=dt*.1;this.stars.rotation.y+=dt*.01;if(!this.orbit.dragging&&!this.abducting)this.orbit.theta+=dt*.055;const q=this.orbit,r=q.radius;this.camera.position.set(r*Math.sin(q.phi)*Math.sin(q.theta),r*Math.cos(q.phi),r*Math.sin(q.phi)*Math.cos(q.theta));this.camera.lookAt(0,3,0);this.updateLabels();this.renderer.render(this.scene,this.camera)}
  updateLabels(){const v=new this.T.Vector3(),w=this.mount.clientWidth,h=this.mount.clientHeight;this.students.forEach(a=>{if(a.abduct||!a.group.visible)return;v.copy(a.group.position);v.y+=2.6;v.project(this.camera);if(v.z>1){a.label.style.display='none';return}a.label.style.display='block';a.label.style.left=`${(v.x*.5+.5)*w}px`;a.label.style.top=`${(-v.y*.5+.5)*h}px`;a.label.classList.toggle('targeted',a.name===this.activeName)})}
}

const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const heroBurger=document.getElementById('heroBurger');
let pointerX=0,pointerY=0;
window.addEventListener('pointermove',e=>{pointerX=(e.clientX/window.innerWidth-.5);pointerY=(e.clientY/window.innerHeight-.5)});
function animateHero(t){const yaw=Math.sin(t*.00055)*3.2+pointerX*2.2;const pitch=Math.cos(t*.00042)*1.2-pointerY*1.1;const bob=Math.sin(t*.00105)*5;heroBurger.style.transform=`translate(-50%,-50%) translateY(${bob}px) perspective(1000px) rotateY(${yaw}deg) rotateX(${pitch}deg)`;requestAnimationFrame(animateHero)}requestAnimationFrame(animateHero);

const section=document.querySelector('.explodeSection');
const layers=[...document.querySelectorAll('.explodeLayer')];
const labels=[...document.querySelectorAll('.ingredientLabels>div')];
const compact=[-150,-82,-43,-5,35,76,114,140,169,212];
const open=[-300,-228,-166,-104,-43,20,84,143,205,274];
const widths=[88,81,82,79,77,77,73,72,76,86];
layers.forEach((el,i)=>{el.style.width=widths[i]+'%'});
function updateExplode(){const max=section.offsetHeight-innerHeight;const raw=(scrollY-section.offsetTop)/max;const p=clamp(raw);const eased=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;layers.forEach((el,i)=>{const y=lerp(compact[i],open[i],eased);const rot=lerp(0,(i%2?1.2:-1.2),eased);el.style.transform=`translate(-50%,calc(-50% + ${y}px)) rotate(${rot}deg)`});labels.forEach((el,i)=>{const start=.08+i*.045;const lp=clamp((p-start)/.11);el.style.opacity=.06+.94*lp;el.style.transform=`translateX(${lerp(20,0,lp)}px)`})}
addEventListener('scroll',updateExplode,{passive:true});addEventListener('resize',updateExplode);updateExplode();

let total=2890;const totalEl=document.getElementById('totalPrice');document.querySelectorAll('.addon').forEach(btn=>btn.addEventListener('click',()=>{const v=Number(btn.dataset.price);btn.classList.toggle('active');total+=btn.classList.contains('active')?v:-v;totalEl.textContent=total.toLocaleString('hu-HU')+' Ft'}));

const navLinks=[...document.querySelectorAll('.topbar nav a')];const ids=['fooldal','etlap','osszetevok','rolunk','kapcsolat'];function navSpy(){let active='fooldal';for(const id of ids){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.42)active=id}navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+active))}addEventListener('scroll',navSpy,{passive:true});navSpy();

// =========================================================
// VALÓDI 3D PIZZA – WebGL / Three.js
// A fenti burger kód változatlan marad.
// =========================================================
(() => {
  const pizzaSection = document.querySelector('.pizza3dSection');
  const canvas = document.getElementById('pizza3dCanvas');
  if (!pizzaSection || !canvas) return;

  const clamp01 = n => Math.max(0, Math.min(1, n));
  const smooth = t => t * t * (3 - 2 * t);

  import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js')
    .then(THREE => {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(0, .25, 12.3);

      const world = new THREE.Group();
      world.rotation.x = -0.87;
      world.rotation.z = -0.06;
      world.scale.setScalar(1.02);
      scene.add(world);

      // --- fények: meleg ételfotó-hangulat
      scene.add(new THREE.HemisphereLight(0xffe1b0, 0x120b06, 1.15));

      const key = new THREE.DirectionalLight(0xffc06b, 5.0);
      key.position.set(-4, 6, 8);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);

      const rim = new THREE.PointLight(0xff8f25, 55, 22, 2);
      rim.position.set(5.8, 1.2, 6);
      scene.add(rim);

      const fill = new THREE.PointLight(0xffe0af, 20, 18, 2);
      fill.position.set(-5, -3, 5);
      scene.add(fill);

      // --- enyhén textúrált PBR anyagok
      function noiseTexture(base, spots, density=700, size=256) {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const x = c.getContext('2d');
        x.fillStyle = base; x.fillRect(0,0,size,size);
        for(let i=0;i<density;i++){
          const r = Math.random()*2.7+.25;
          x.globalAlpha = Math.random()*.34+.06;
          x.fillStyle = spots[(Math.random()*spots.length)|0];
          x.beginPath();
          x.arc(Math.random()*size,Math.random()*size,r,0,Math.PI*2);
          x.fill();
        }
        x.globalAlpha = 1;
        const tx = new THREE.CanvasTexture(c);
        tx.colorSpace = THREE.SRGBColorSpace;
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.repeat.set(2.7,2.7);
        return tx;
      }

      const doughMap  = noiseTexture('#bd6c2d',['#7b3518','#e0a05c','#5f2714'],520);
      const cheeseMap = noiseTexture('#e5a427',['#ffd36b','#c56e18','#f5bd42'],420);
      const sauceMap  = noiseTexture('#9e2417',['#c94a2c','#6e140f','#e06b40'],500);

      const doughMat = new THREE.MeshStandardMaterial({
        map:doughMap,color:0xc17836,roughness:.72,metalness:0
      });
      const edgeMat = new THREE.MeshStandardMaterial({
        map:doughMap,color:0xd38a43,roughness:.64,metalness:0
      });
      const sauceMat = new THREE.MeshStandardMaterial({
        map:sauceMap,color:0xb62f1f,roughness:.67
      });
      const cheeseMat = new THREE.MeshStandardMaterial({
        map:cheeseMap,color:0xf0b638,roughness:.48
      });
      const pepperoniMat = new THREE.MeshStandardMaterial({
        color:0x9f281f,roughness:.58
      });
      const pepperoniEdgeMat = new THREE.MeshStandardMaterial({
        color:0x66150f,roughness:.7
      });
      const basilMat = new THREE.MeshStandardMaterial({
        color:0x2d6d2e,roughness:.62,side:THREE.DoubleSide
      });
      const oliveMat = new THREE.MeshStandardMaterial({
        color:0x17150f,roughness:.42
      });
      const cheeseStringMat = new THREE.MeshStandardMaterial({
        color:0xffd978,roughness:.36,emissive:0x2a1200,emissiveIntensity:.18
      });

      const pizza = new THREE.Group();
      world.add(pizza);

      const sliceCount = 8;
      const arc = Math.PI * 2 / sliceCount;
      const radius = 4.05;
      const chosen = 0;
      const sliceGroups = [];

      function wedgeGeometry(r, start, end, depth, bevel=.05) {
        const s = new THREE.Shape();
        s.moveTo(0,0);
        s.lineTo(Math.cos(start)*r,Math.sin(start)*r);
        s.absarc(0,0,r,start,end,false);
        s.lineTo(0,0);
        s.closePath();
        const g = new THREE.ExtrudeGeometry(s,{
          depth,
          bevelEnabled:true,
          bevelSegments:3,
          steps:1,
          bevelSize:bevel,
          bevelThickness:bevel
        });
        g.computeVertexNormals();
        return g;
      }

      function addPepperoni(group,x,y,z=.39,scale=1){
        const side = new THREE.Mesh(
          new THREE.CylinderGeometry(.34*scale,.34*scale,.075,28),
          pepperoniEdgeMat
        );
        side.rotation.x = Math.PI/2;
        side.position.set(x,y,z);
        side.castShadow = true;
        group.add(side);

        const top = new THREE.Mesh(
          new THREE.CircleGeometry(.33*scale,28),
          pepperoniMat
        );
        top.position.set(x,y,z+.044);
        top.castShadow = true;
        group.add(top);

        for(let k=0;k<5;k++){
          const speck = new THREE.Mesh(
            new THREE.SphereGeometry(.025*scale,6,6),
            new THREE.MeshStandardMaterial({color:0xd76b47,roughness:.7})
          );
          const a=Math.random()*Math.PI*2, rr=Math.random()*.21*scale;
          speck.position.set(x+Math.cos(a)*rr,y+Math.sin(a)*rr,z+.065);
          group.add(speck);
        }
      }

      function addBasil(group,x,y,z=.44,rot=0,scale=1){
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(.34,18,10),
          basilMat
        );
        leaf.scale.set(1.15*scale,.48*scale,.08*scale);
        leaf.rotation.z = rot;
        leaf.position.set(x,y,z);
        leaf.castShadow = true;
        group.add(leaf);
        return leaf;
      }

      function polar(r,a){ return [Math.cos(a)*r,Math.sin(a)*r]; }

      for(let i=0;i<sliceCount;i++){
        const g = new THREE.Group();
        const a0 = -arc/2 + i*arc + .012;
        const a1 =  arc/2 + i*arc - .012;
        const mid = (a0+a1)/2;

        const base = new THREE.Mesh(wedgeGeometry(radius,a0,a1,.22,.055),doughMat);
        base.position.z = -.22;
        base.receiveShadow = base.castShadow = true;
        g.add(base);

        const sauce = new THREE.Mesh(wedgeGeometry(radius-.30,a0+.012,a1-.012,.055,.025),sauceMat);
        sauce.position.z = .01;
        sauce.castShadow = true;
        g.add(sauce);

        const cheese = new THREE.Mesh(wedgeGeometry(radius-.38,a0+.015,a1-.015,.07,.035),cheeseMat);
        cheese.position.z = .072;
        cheese.castShadow = true;
        g.add(cheese);

        const crust = new THREE.Mesh(
          new THREE.TorusGeometry(radius-.08,.31,14,24,arc-.035),
          edgeMat
        );
        crust.position.z = .10;
        crust.rotation.z = a0 + .017;
        crust.castShadow = true;
        g.add(crust);

        // Minden szeleten külön feltétek.
        const p1=polar(2.45,mid-.09), p2=polar(3.05,mid+.10);
        addPepperoni(g,p1[0],p1[1],.21,.92);
        if(i%2===0) addPepperoni(g,p2[0],p2[1],.21,.72);

        if(i%3===0){
          const b=polar(1.75,mid+.12);
          addBasil(g,b[0],b[1],.29,mid+.7,.72);
        }

        // fekete olíva karikák
        if(i%2===1){
          const o=polar(2.05,mid+.17);
          const olive = new THREE.Mesh(new THREE.TorusGeometry(.13,.045,8,16),oliveMat);
          olive.position.set(o[0],o[1],.28);
          olive.castShadow=true;
          g.add(olive);
        }

        pizza.add(g);
        sliceGroups.push(g);
      }

      const heroSlice = sliceGroups[chosen];

      // Kiemelkedő friss bazsalikom-levelek (scrollra repülnek).
      const floatingLeaves = new THREE.Group();
      world.add(floatingLeaves);
      const floatLeaves = [
        addBasil(floatingLeaves,3.1,1.45,.85,.4,.78),
        addBasil(floatingLeaves,2.65,-1.6,.72,-.8,.66),
        addBasil(floatingLeaves,1.6,2.15,.68,1.1,.55)
      ];
      floatLeaves.forEach(l=>{ l.material = basilMat.clone(); l.material.transparent=true; l.material.opacity=0; });

      // Sajt-szálak – valódi 3D csövek.
      const strings = [];
      const stringData = [
        {start:new THREE.Vector3(.35,.22,.32), end:new THREE.Vector3(.15,.18,.32)},
        {start:new THREE.Vector3(.62,-.20,.30), end:new THREE.Vector3(.40,-.18,.31)},
        {start:new THREE.Vector3(.95,.05,.29), end:new THREE.Vector3(.72,.04,.31)}
      ];
      for(let i=0;i<3;i++){
        const mesh = new THREE.Mesh(new THREE.BufferGeometry(),cheeseStringMat);
        mesh.visible=false;
        world.add(mesh);
        strings.push(mesh);
      }

      function updateString(mesh,start,end,sag,visible){
        mesh.visible=visible;
        if(!visible) return;
        const mid = start.clone().lerp(end,.52);
        mid.y -= sag;
        mid.z += .10;
        const curve = new THREE.CatmullRomCurve3([start,mid,end]);
        const newGeo = new THREE.TubeGeometry(curve,18,.045,8,false);
        mesh.geometry.dispose();
        mesh.geometry = newGeo;
      }

      // Finom kontakt-árnyék a pizza alatt.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(4.6,64),
        new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.30,depthWrite:false})
      );
      shadow.scale.set(1,.42,1);
      shadow.position.set(0,-.65,-.75);
      world.add(shadow);

      const pizzaLabels = [...document.querySelectorAll('.pizzaLabel')];
      let pizzaProgress = 0;

      function updatePizzaScroll(){
        const max = pizzaSection.offsetHeight - innerHeight;
        const raw = (scrollY - pizzaSection.offsetTop) / Math.max(1,max);
        const p = clamp01(raw);
        pizzaProgress = p;

        // Az első részben tényleg egyben áll. Utána indul csak a szelet.
        const lift = smooth(clamp01((p-.16)/.62));
        const labelP = smooth(clamp01((p-.47)/.26));

        heroSlice.position.set(
          2.45*lift,
          .52*lift,
          2.15*lift
        );
        heroSlice.rotation.z = -.055*lift;
        heroSlice.rotation.y = -.10*lift;

        // Egész pizza finom közelítés a kamera felé, nem forog körbe.
        world.position.z = .36*lift;
        world.position.x = -.24*lift;

        // Bazsalikom-levelek felpattannak a kiemelt szelet körül.
        const leafP = smooth(clamp01((p-.40)/.35));
        floatLeaves.forEach((l,i)=>{
          l.material.opacity = .92*leafP;
          l.position.z = .85 + leafP*(1.2+i*.22);
          l.position.x += 0; // pozíció alapja fix
          l.rotation.x = leafP*(.35+i*.14);
          l.rotation.z += 0; // scroll alatt nem halmozódik
          const baseXs=[3.1,2.65,1.6], baseYs=[1.45,-1.6,2.15];
          l.position.x = baseXs[i] + leafP*(.45+i*.22);
          l.position.y = baseYs[i] + leafP*((i===1?-1:1)*.32);
          l.rotation.z = [.4,-.8,1.1][i] + leafP*(i===1?-.45:.35);
        });

        // Sajt-szálak a szelet csúcsától az eredeti pizza felé.
        const sp = smooth(clamp01((p-.27)/.48));
        const sx = heroSlice.position.x, sy = heroSlice.position.y, sz = heroSlice.position.z;
        stringData.forEach((d,i)=>{
          const start = d.start.clone();
          const end = d.end.clone().add(new THREE.Vector3(sx*.78,sy*.78,sz*.78));
          updateString(strings[i],start,end,.18+.28*sp+(i*.05),sp>.03);
          strings[i].material.transparent=true;
          strings[i].material.opacity=Math.min(1,sp*1.3);
        });

        pizzaLabels.forEach((el,i)=>{
          const local = clamp01((labelP-i*.10)/.34);
          el.style.opacity = local;
          el.style.transform = `translateX(${(1-local)*28}px)`;
        });

        const hint = document.querySelector('.pizzaHint');
        if(hint) hint.style.opacity = 1-smooth(clamp01(p/.22));
      }

      function resizePizza(){
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(1,rect.width), h = Math.max(1,rect.height);
        renderer.setSize(w,h,false);
        camera.aspect = w/h;
        camera.updateProjectionMatrix();

        if(w < 600){
          camera.position.z = 13.7;
          world.scale.setScalar(.91);
          world.rotation.x = -.82;
        }else{
          camera.position.z = 12.3;
          world.scale.setScalar(1.02);
          world.rotation.x = -.87;
        }
      }

      let running = true;
      const observer = new IntersectionObserver(entries=>{
        running = entries[0]?.isIntersecting ?? true;
      },{rootMargin:'30% 0px'});
      observer.observe(pizzaSection);

      function renderPizza(){
        if(running) renderer.render(scene,camera);
        requestAnimationFrame(renderPizza);
      }

      addEventListener('scroll',updatePizzaScroll,{passive:true});
      addEventListener('resize',()=>{resizePizza();updatePizzaScroll()});
      resizePizza();
      updatePizzaScroll();
      renderPizza();
    })
    .catch(err=>{
      console.error('A 3D pizza nem tudott betöltődni:',err);
      canvas.style.display='none';
      const wrap=document.querySelector('.pizzaCanvasWrap');
      if(wrap){
        const msg=document.createElement('div');
        msg.className='pizza3dError';
        msg.textContent='A 3D nézet betöltése sikertelen.';
        msg.style.cssText='position:absolute;inset:0;display:grid;place-items:center;color:#b9afa2;font-size:12px;letter-spacing:2px';
        wrap.appendChild(msg);
      }
    });
})();

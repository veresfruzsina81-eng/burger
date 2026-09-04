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

// ===== PIZZA SCROLL ANIMACIO - a burger kodjat nem modositja =====
const pizzaSection=document.querySelector('.pizzaSection');
const pizzaStage=document.getElementById('pizzaStage');
const pizzaSlice=document.getElementById('pizzaSlice');
const pizzaHole=document.getElementById('pizzaHole');
const cheeseThreads=document.getElementById('cheeseThreads');
const cheeseLines=[...document.querySelectorAll('.cheeseThreads i')];
const basilLeaves=[...document.querySelectorAll('.basilLeaf')];
const pizzaLabels=[...document.querySelectorAll('.pizzaLabels>div')];

function updatePizza(){
  if(!pizzaSection||!pizzaStage||!pizzaSlice)return;
  const max=pizzaSection.offsetHeight-innerHeight;
  const raw=(scrollY-pizzaSection.offsetTop)/max;
  const p=clamp(raw);
  const lift=clamp((p-.10)/.58);
  const soft=lift<.5?2*lift*lift:1-Math.pow(-2*lift+2,2)/2;
  const x=lerp(0,145,soft);
  const y=lerp(0,-105,soft);
  const r=lerp(0,11,soft);
  const s=lerp(1,1.055,soft);
  pizzaSlice.style.transform=`translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${s})`;
  pizzaHole.style.opacity=clamp((p-.14)/.16)*.96;
  const cheese=clamp((p-.20)/.34)*(1-clamp((p-.78)/.18));
  cheeseThreads.style.opacity=cheese;
  cheeseLines.forEach((line,i)=>{line.style.transform=`scaleY(${.12+cheese*(.88-i*.04)})`});
  const stageTilt=lerp(-1.4,1.8,p);
  const stageScale=lerp(.96,1.02,clamp((p-.05)/.7));
  pizzaStage.style.transform=`translate(-50%,-50%) perspective(1100px) rotateX(${lerp(2,-2,p)}deg) rotateZ(${stageTilt}deg) scale(${stageScale})`;
  basilLeaves.forEach((leaf,i)=>{
    const start=.26+i*.08;
    const lp=clamp((p-start)/.24);
    leaf.style.opacity=lp;
    leaf.style.transform=`translate(${lerp(0,34+i*13,lp)}px,${lerp(0,-45-i*18,lp)}px) rotate(${lerp(0,38+i*23,lp)}deg)`;
  });
  pizzaLabels.forEach((el,i)=>{
    const start=.18+i*.09;
    const lp=clamp((p-start)/.18);
    el.style.opacity=.08+.92*lp;
    el.style.transform=`translateX(${lerp(18,0,lp)}px)`;
  });
}
addEventListener('scroll',updatePizza,{passive:true});
addEventListener('resize',updatePizza);
updatePizza();

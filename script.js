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

// Pizza showcase — az egész pizza mozdulatlanul indul, majd a szelet kiemelkedik.
const pizzaSection=document.querySelector('.pizzaSection');
const pizzaWhole=document.querySelector('.pizzaWhole');
const pizzaBase=document.querySelector('.pizzaBase');
const pizzaSlice=document.querySelector('.pizzaSlice');
const pizzaCheese=document.querySelector('.pizzaCheese');
const pizzaLabels=[...document.querySelectorAll('.pizzaLabels>div')];
const pizzaLeaves=[...document.querySelectorAll('.pizzaLeaf')];
function easeInOut(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function updatePizza(){
  if(!pizzaSection)return;
  const max=pizzaSection.offsetHeight-innerHeight;
  const p=clamp((scrollY-pizzaSection.offsetTop)/Math.max(1,max));
  const swap=easeInOut(clamp((p-.19)/.18));
  const lift=easeInOut(clamp((p-.30)/.48));
  const cheese=easeInOut(clamp((p-.38)/.38));
  pizzaWhole.style.opacity=1-swap;
  pizzaBase.style.opacity=swap;
  const sx=lerp(182,268,lift), sy=lerp(72,-118,lift), sc=lerp(.64,.92,lift), rot=lerp(-2,5,lift);
  pizzaSlice.style.opacity=clamp((p-.23)/.11);
  pizzaSlice.style.transform=`translate(-50%,-50%) translate(${sx}px,${sy}px) rotate(${rot}deg) scale(${sc})`;
  const cx=lerp(195,236,lift), cy=lerp(-20,-2,lift), csx=lerp(.45,.62,cheese), csy=lerp(.20,.88,cheese);
  pizzaCheese.style.opacity=cheese*.94;
  pizzaCheese.style.transform=`translate(-50%,-50%) translate(${cx}px,${cy}px) scale(${csx},${csy})`;
  pizzaLeaves.forEach((el,i)=>{
    const lp=easeInOut(clamp((p-(.48+i*.035))/.28));
    el.style.opacity=lp*.95;
    const dx=[42,63,-26][i]*lp, dy=[-74,-45,-88][i]*lp, rr=[82,-56,138][i]*lp;
    const base=['rotate(34deg)','rotate(-27deg) scale(.82)','rotate(79deg) scale(.66)'][i];
    el.style.transform=`${base} translate(${dx}px,${dy}px) rotate(${rr}deg)`;
  });
  pizzaLabels.forEach((el,i)=>{
    const lp=clamp((p-(.42+i*.055))/.12);
    el.style.opacity=.06+.94*lp;
    el.style.transform=`translateX(${lerp(22,0,lp)}px)`;
  });
}
addEventListener('scroll',updatePizza,{passive:true});addEventListener('resize',updatePizza);updatePizza();

// A D.M STUDIO zárás finoman reagál a kurzorra, de nem válik harsánnyá.
const dmBrand=document.querySelector('.dmBrand');
if(dmBrand){addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*8;dmBrand.style.transform=`translateX(${x}px)`},{passive:true})}

gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero-stack", {y:-12, duration:2.2, repeat:-1, yoyo:true, ease:"sine.inOut"});

const layers = gsap.utils.toArray(".burger .layer");
const labels = gsap.utils.toArray(".labels div");

// Start as one assembled burger: all layers overlap tightly around center.
const compact = [-78,-58,-43,-29,-14,2,19,34,50,72];
const exploded = [-270,-205,-145,-88,-32,27,85,142,205,270];

layers.forEach((el,i)=>{
  gsap.set(el,{y:compact[i], scale: i===0||i===9 ? 1.02 : .98});
});

const tl = gsap.timeline({
  scrollTrigger:{
    trigger:".explode",
    start:"top top",
    end:"bottom bottom",
    scrub:1.1
  }
});

layers.forEach((el,i)=>{
  tl.to(el,{y:exploded[i], rotation:(i%2?1.3:-1.1), ease:"none"},0);
});

labels.forEach((el,i)=>{
  tl.to(el,{opacity:1,x:0,duration:.12,ease:"none"},.12+i*.055);
});

tl.to(".section-copy",{opacity:.62,y:-18,ease:"none"},0);

window.addEventListener("load",()=>ScrollTrigger.refresh());
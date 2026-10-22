(function(){
  var sec=document.getElementById('assembly');if(!sec)return;
  var v=sec.querySelector('video'),fz=sec.querySelector('.asm-fazwa'),bar=sec.querySelector('.asm-bar i'),pc=sec.querySelector('.asm-pc'),hint=sec.querySelector('.asm-hint'),glow=sec.querySelector('.asm-glow');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(x){return x<0?0:x>1?1:x}
  function fallback(){sec.classList.add('fb');fz.style.opacity=.85;fz.style.transform='translateY(-44%) scale(1)';sec.classList.add('done')}
  v.addEventListener('error',fallback);
  if(reduce){fallback();return}
  var dur=0,ready=false,tgt=0,cur=0,last=-1,run=false;
  function meta(){dur=v.duration||8;ready=true;v.currentTime=0}
  if(v.readyState>=1)meta();else v.addEventListener('loadedmetadata',meta);
  // wake iOS/Safari so frames are decodable
  var p=v.play();if(p&&p.then)p.then(function(){v.pause();v.currentTime=0}).catch(function(){});
  function measure(){
    var r=sec.getBoundingClientRect(),total=sec.offsetHeight-innerHeight;
    var s=clamp(-r.top/total);tgt=s;
  }
  function frame(){
    if(!run)return;
    measure();
    cur+=(tgt-cur)*.14;if(Math.abs(tgt-cur)<.0004)cur=tgt;
    var vp=clamp((cur-.04)/.86);            // hold start + hold end
    if(ready){var t=vp*dur;if(Math.abs(t-last)>.012){try{v.currentTime=t}catch(e){}last=t}}
    var a=clamp(cur/.4);a=a*a*(3-2*a);       // text ease-in
    fz.style.opacity=(.9*a).toFixed(3);
    fz.style.transform='translateY('+(-44+(1-a)*10).toFixed(2)+'%) scale('+(.92+.08*a).toFixed(4)+')';
    glow.style.setProperty('--g',(.3+.5*vp).toFixed(2));
    bar.style.transform='scaleX('+vp.toFixed(4)+')';
    pc.textContent=Math.round(vp*100);
    hint.style.opacity=cur>.03?0:1;
    sec.classList.toggle('done',cur>.93);
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(function(e){var on=e[0].isIntersecting;if(on&&!run){run=true;requestAnimationFrame(frame)}else if(!on)run=false},{rootMargin:'200px 0px'}).observe(sec);
})();

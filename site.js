const robo = document.getElementById('robo');
  const trackW = () => window.innerWidth - 64;
  let lastY = window.scrollY;
  let walkTimer = null;

  function positionRobot(){
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
    const x = progress * trackW();
    robo.style.transform = `translateX(${x}px)`;
  }

  function onScroll(){
    const y = window.scrollY;
    if (y > lastY) { robo.classList.remove('face-left'); }
    else if (y < lastY) { robo.classList.add('face-left'); }
    lastY = y;
    robo.classList.add('walking');
    clearTimeout(walkTimer);
    walkTimer = setTimeout(() => robo.classList.remove('walking'), 260);
    positionRobot();
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', positionRobot);
  positionRobot();

  const ariaBot = document.getElementById('ariaBot');
  const pupilL = ariaBot ? ariaBot.querySelector('.pupil.l') : null;
  const pupilR = ariaBot ? ariaBot.querySelector('.pupil.r') : null;
  const MAX_OFFSET = 4;

  function trackPointer(e){
    if(!ariaBot) return;
    const rect = ariaBot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 260, 1);
    const ox = Math.cos(angle) * MAX_OFFSET * dist;
    const oy = Math.sin(angle) * MAX_OFFSET * dist;
    const t = `translate(${ox}px, ${oy}px)`;
    if(pupilL) pupilL.style.transform = t;
    if(pupilR) pupilR.style.transform = t;
  }
  window.addEventListener('mousemove', trackPointer, { passive:true });

(function(){
  var P=window.FAZWA_PROJECTS||[], $=function(i){return document.getElementById(i)};
  function lab(s){return s==='ongoing'?'ONGOING':'COMPLETE'}
  if($('projTable'))$('projTable').innerHTML=P.map(function(p){return '<a class="prow" href="'+p.page+'"><span class="no">'+p.n+'</span><span class="nm">'+p.code+'<span class="tg">'+p.tag+'</span></span><span class="st '+p.status+'">'+lab(p.status)+'</span></a>'}).join('');
  if($('projGrid'))$('projGrid').innerHTML=P.map(function(p){return '<a class="pcard'+(p.page==='welcome-robot.html'?' feat':'')+'" href="'+p.page+'"><span class="top"><span>'+p.n+' · '+p.cat+'</span><span class="st '+p.status+'">'+lab(p.status)+'</span></span><b>'+p.code+'</b><span class="go">OPEN PROJECT PAGE →</span></a>'}).join('');

  function setOpen(a,o){a.classList.toggle('open',o);var h=a.querySelector(':scope>.acc-h');if(h)h.setAttribute('aria-expanded',o)}
  document.addEventListener('click',function(e){
    var h=e.target.closest('.acc-h');if(h){setOpen(h.parentElement,!h.parentElement.classList.contains('open'));return}
    var a=e.target.closest('a[href^="#"]');
    if(a){var t=$(a.getAttribute('href').slice(1));if(t&&t.classList.contains('acc')){e.preventDefault();setOpen(t,true);t.scrollIntoView({behavior:'smooth',block:'start'})}}
  });
  var hid=location.hash.slice(1),ht=hid&&$(hid);
  if(ht&&ht.classList.contains('acc')){setOpen(ht,true);setTimeout(function(){ht.scrollIntoView({block:'start'})},80)}

  var lb=$('lb');
  if(lb){document.querySelectorAll('.gal img').forEach(function(im){im.addEventListener('click',function(){lb.querySelector('img').src=im.src;lb.classList.add('on')});im.onerror=function(){im.alt='IMAGE NOT FOUND — CHECK FILE NAME'}});
    lb.addEventListener('click',function(){lb.classList.remove('on')});addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('on')})}

  var b=$('boot');
  if(b){
    if(document.documentElement.classList.contains('booted')){b.remove();return}
    var done=false,bar=$('btBar'),pct=$('btPct'),msg=$('btMsg'),D=2300,t0=performance.now();
    var M=[[0,'INITIALIZING FAZWA SYSTEM...'],[28,'LOADING PROJECT ARCHIVE...'],[58,'CALIBRATING SENSORS...'],[88,'SYSTEM ONLINE']];
    document.body.style.overflow='hidden';
    function fin(){if(done)return;done=true;try{sessionStorage.setItem('fz_boot','1')}catch(e){}b.classList.add('out');document.body.style.overflow='';setTimeout(function(){b.remove()},600)}
    function step(now){
      if(done)return;
      var r=Math.min((now-t0)/D,1),v=Math.round(100*r*r*(3-2*r));
      bar.style.width=v+'%';pct.textContent=v;
      for(var i=M.length-1;i>=0;i--){if(v>=M[i][0]){msg.textContent=M[i][1];break}}
      if(r<1)requestAnimationFrame(step);else setTimeout(fin,380);
    }
    requestAnimationFrame(step);b.addEventListener('click',fin);setTimeout(fin,5000);
  }
})();

(function(){var im=document.querySelector("#ariaBot img");if(im)im.onerror=function(){if(im.src.indexOf("robo.jpg")<0)im.src="robo.jpg"}})();
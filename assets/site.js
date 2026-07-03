(function(){
  var nav=document.getElementById('nav');
  if(nav){var onScroll=function(){nav.classList.toggle('scrolled',window.scrollY>20)};onScroll();window.addEventListener('scroll',onScroll,{passive:true});}
  var burger=document.getElementById('burger'), mmenu=document.getElementById('mmenu');
  if(burger&&mmenu){
    burger.addEventListener('click',function(){
      var open=mmenu.classList.toggle('open');
      burger.setAttribute('aria-expanded',open);
      burger.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      document.body.style.overflow=open?'hidden':'';
    });
    mmenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
      mmenu.classList.remove('open');burger.setAttribute('aria-expanded',false);document.body.style.overflow='';
    })});
  }
  var tpTrack=document.getElementById('tpTrack');
  if(tpTrack){
    document.querySelectorAll('.tp-nav button[data-tp]').forEach(function(b){
      b.addEventListener('click',function(){
        var card=tpTrack.querySelector('.tcard');
        var step=(card?card.offsetWidth+22:400)*parseInt(b.getAttribute('data-tp'),10);
        tpTrack.scrollBy({left:step,behavior:'smooth'});
      });
    });
  }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  var show=function(e){e.classList.add('in')};
  if(reduce){els.forEach(show);return;}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){show(x.target);io.unobserve(x.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e)});
  }else{els.forEach(show)}
  var fallback=function(){els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)show(e)})};
  window.addEventListener('scroll',fallback,{passive:true});window.addEventListener('resize',fallback);fallback();
  setTimeout(function(){els.forEach(show)},2600);
})();

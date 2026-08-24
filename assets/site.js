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
    var closeMenu=function(){
      mmenu.classList.remove('open');burger.setAttribute('aria-expanded',false);
      burger.setAttribute('aria-label','Menü öffnen');document.body.style.overflow='';
    };
    mmenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu)});
    var brand=document.querySelector('.brand');
    if(brand)brand.addEventListener('click',closeMenu);
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
  var needChips=document.getElementById('needChips'), needEcho=document.getElementById('needEcho');
  if(needChips&&needEcho){
    needChips.querySelectorAll('.need-chip').forEach(function(chip){
      chip.addEventListener('click',function(){
        var wasOn=chip.getAttribute('aria-pressed')==='true';
        needChips.querySelectorAll('.need-chip').forEach(function(c){c.setAttribute('aria-pressed','false')});
        needEcho.classList.remove('show');
        if(wasOn){return;}
        chip.setAttribute('aria-pressed','true');
        setTimeout(function(){needEcho.textContent=chip.getAttribute('data-echo');needEcho.classList.add('show');},150);
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

/* Kontaktformular → Lechcode-Worker → direkt in Lauras Postfach.
   Läuft nur auf Seiten mit #cf (beziehung.html, business.html). Cookiefrei. */
(function(){
  var WORKER='https://lechcode-api.nameless-waterfall-55e5.workers.dev';
  var SITE='laura-schnelle';
  var f=document.getElementById('cf'), m=document.getElementById('cfmsg');
  if(!f||!m) return;
  var btn=f.querySelector('button[type=submit]');
  var ERR='Da ist leider etwas schiefgelaufen. Schreib mir gern direkt an coaching@lauraschnelle.com.';
  var val=function(id){var e=document.getElementById(id);return e?e.value.trim():''};
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(val('_honey')) return;                       /* Honeypot: Bot, still verwerfen */
    var name=val('name'), email=val('email');
    if(!name||!email){ m.className='form-msg err'; m.textContent='Magst du mir noch deinen Namen und deine E-Mail dalassen?'; return; }
    var firma=val('firma'), text=val('msg');
    if(firma) text = 'Firma: '+firma+(text? '\n\n'+text : '');
    var label=btn.innerHTML; btn.disabled=true; btn.textContent='Wird gesendet …';
    m.className='form-msg'; m.textContent='';
    fetch(WORKER+'/contact',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({site:SITE,name:name,email:email,message:text})})
      .then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok){ m.className='form-msg ok'; m.textContent='Danke dir! Deine Nachricht ist angekommen — ich melde mich persönlich zurück.'; f.reset(); btn.textContent='Gesendet ✓'; }
        else{ m.className='form-msg err'; m.textContent=(d&&d.meldung)||ERR; btn.disabled=false; btn.innerHTML=label; }
      })
      .catch(function(){ m.className='form-msg err'; m.textContent=ERR; btn.disabled=false; btn.innerHTML=label; });
  });
})();

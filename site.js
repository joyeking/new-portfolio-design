(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor=document.querySelector('.cursor');
  if(cursor&&!reduce&&matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',e=>{cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;cursor.style.opacity='.82'});
    document.querySelectorAll('a,button,summary,.case-row,.index-card,.project-card,.post-card').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('is-active'));el.addEventListener('pointerleave',()=>cursor.classList.remove('is-active'))});
  }
  // Mobile menu: one <nav> that is a row on desktop and a panel on small screens.
  // The open state lives in data-open so CSS owns both layouts and JS owns no geometry.
  const menuBtn=document.querySelector('[data-menu-btn]');
  const menu=document.getElementById('site-menu');
  if(menuBtn&&menu){
    const setOpen=open=>{menu.dataset.open=String(open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');const use=menuBtn.querySelector('use');if(use)use.setAttribute('href',open?'#i-chevron-down':'#i-menu')};
    setOpen(false);
    menuBtn.addEventListener('click',()=>setOpen(menu.dataset.open!=='true'));
    menu.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});
    addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.dataset.open==='true'){setOpen(false);menuBtn.focus()}});
    addEventListener('resize',()=>{if(matchMedia('(min-width: 861px)').matches)setOpen(false)});
  }
  // The engine's data-sc-count handles the numbers; the bespoke odometer is gone.
  document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type=submit]');
    const status=form.querySelector('[data-form-status]');
    const data=new FormData(form);
    const subject=`New project enquiry from ${data.get('name')||'a visitor'}`;
    const body=[
      `Name: ${data.get('name')||''}`,
      `Email: ${data.get('email')||''}`,
      `Service: ${data.get('service')||''}`,
      '',
      data.get('brief')||''
    ].join('\n');
    if(status){status.textContent='Your email app should open with the enquiry ready to send.';status.classList.add('is-done');}
    if(button){button.disabled=true;button.textContent='Email draft ready';}
    location.href=`mailto:yohannesassefa17@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }));
  document.querySelectorAll('a[data-route]').forEach(a=>a.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduce||!document.startViewTransition)return;e.preventDefault();document.startViewTransition(()=>location.href=a.href)}));
  const rootEl=document.documentElement;
  const modeSwitch=document.querySelector('[data-mode-switch]');
  const themeKey='portfolio-theme';
  const themeQuery=matchMedia('(prefers-color-scheme: dark)');
  const readTheme=()=>{try{return localStorage.getItem(themeKey)||localStorage.getItem('theme')}catch(e){return null}};
  const applyTheme=(theme,persist=false)=>{
    const next=theme==='dark'?'dark':'light';
    rootEl.dataset.theme=next;
    rootEl.style.colorScheme=next;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=next==='dark'?'#181714':'#e7e5df';
    if(modeSwitch)modeSwitch.setAttribute('aria-pressed',String(next==='dark'));
    if(persist){try{localStorage.setItem(themeKey,next)}catch(e){}}
  };
  const savedTheme=readTheme();
  applyTheme(savedTheme==='dark'?'dark':savedTheme==='light'?'light':themeQuery.matches?'dark':'light');
  if(modeSwitch)modeSwitch.addEventListener('click',()=>applyTheme(rootEl.dataset.theme==='dark'?'light':'dark',true));
  const updateSystemTheme=event=>{if(!readTheme())applyTheme(event.matches?'dark':'light')};
  if(themeQuery.addEventListener)themeQuery.addEventListener('change',updateSystemTheme);else themeQuery.addListener(updateSystemTheme);
  addEventListener('storage',event=>{if(event.key==='theme'||event.key===themeKey)applyTheme(readTheme()||'light')});
  document.querySelectorAll('.browser-frame[data-frame]').forEach(frame=>{
    frame.querySelectorAll('.device').forEach(btn=>btn.addEventListener('click',()=>{
      frame.querySelectorAll('.device').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-pressed','false')});
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed','true');
      const screen=frame.querySelector('.frame-screen');
      screen.style.width=`min(${btn.dataset.w}, 100%)`;
      screen.style.maxWidth='100%';
    }));
  });
  document.querySelectorAll('.frame-load').forEach(btn=>btn.addEventListener('click',()=>{
    const screen=btn.closest('.frame-screen');
    const iframe=document.createElement('iframe');
    iframe.src=btn.dataset.src;iframe.title=`${btn.dataset.title||'Project'} live site preview`;iframe.loading='lazy';
    iframe.setAttribute('allow','fullscreen');
    screen.replaceChildren(iframe);
  }));
  // v13: the header floats over the paper so the hero portrait can break its
  // line. It only earns a background once the page has scrolled beneath it.
  const navEl=document.querySelector('[data-nav]');
  if(navEl){
    const sync=()=>navEl.classList.toggle('is-stuck',scrollY>24);
    addEventListener('scroll',sync,{passive:true});
    sync();
  }
  if(window.ScrollCraft){ScrollCraft.mount(document.body)}
})();
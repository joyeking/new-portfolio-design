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
    if(meta)meta.content=next==='dark'?'#101114':'#f3f1ea';
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
  // Native scroll-snap rails for the homepage index and Projects page artwork.
  document.querySelectorAll('[data-snap-carousel]').forEach(carousel=>{
    const track=carousel.querySelector('[data-snap-track]');
    const cards=[...carousel.querySelectorAll('.snap-card')];
    if(!track||!cards.length)return;
    const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0);
    const prev=carousel.querySelector('[data-snap-prev]'),next=carousel.querySelector('[data-snap-next]');
    const update=()=>{const end=track.scrollWidth-track.clientWidth; if(prev)prev.disabled=track.scrollLeft<=2; if(next)next.disabled=track.scrollLeft>=end-2};
    const scroll=distance=>track.scrollBy({left:distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    prev?.addEventListener('click',()=>scroll(-step()));
    next?.addEventListener('click',()=>scroll(step()));
    track.addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  });
  // Album-rail-inspired Projects gallery: layered artwork with no descriptions.
  document.querySelectorAll('[data-design-carousel]').forEach(carousel=>{
    const stage=carousel.querySelector('[data-design-stage]');
    const slides=[...carousel.querySelectorAll('[data-design-slide]')];
    const title=carousel.querySelector('[data-design-title]');
    const kind=carousel.querySelector('[data-design-kind]');
    if(!stage||!slides.length)return;
    let active=0,dragStart=null,lastWheel=0;
    const render=()=>{
      // Neighbours sit beside the active design instead of hiding behind it: the
      // gap follows the slide's own width, capped by the stage so the deck stays in frame.
      const spread=Math.min((slides[0].offsetWidth||340)+64,stage.clientWidth*.5);
      slides.forEach((slide,index)=>{
        let offset=index-active;
        if(offset>slides.length/2)offset-=slides.length;
        if(offset< -slides.length/2)offset+=slides.length;
        const visible=Math.abs(offset)<=3;
        slide.classList.toggle('is-active',offset===0);
        slide.classList.toggle('is-visible',visible);
        slide.setAttribute('aria-hidden',String(!visible));
        slide.tabIndex=offset===0?0:-1;
        slide.style.transform=`translate(-50%,-50%) translateX(${offset*spread}px) rotate(${offset*-5}deg) scale(${offset===0?1:Math.max(.68,1-Math.abs(offset)*.1)})`;
        slide.style.zIndex=String(20-Math.abs(offset));
        slide.style.opacity=visible?String(Math.max(.32,1-Math.abs(offset)*.16)):'0';
        slide.style.filter=offset===0?'none':`blur(${Math.min(Math.abs(offset)*3,8)}px) saturate(.58)`;
        slide.style.pointerEvents=visible?'auto':'none';
      });
      const current=slides[active];
      if(title)title.textContent=current.querySelector('img')?.alt||'';
      if(kind)kind.textContent=current.dataset.kind||'';
    };
    const move=step=>{active=(active+step+slides.length)%slides.length;render()};
    slides.forEach((slide,index)=>slide.addEventListener('click',event=>{
      if(stage.dataset.dragged==='true'){event.preventDefault();return}
      if(index!==active){event.preventDefault();active=index;render()}
    }));
    carousel.querySelector('.design-prev')?.addEventListener('click',()=>move(-1));
    carousel.querySelector('.design-next')?.addEventListener('click',()=>move(1));
    stage.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
      if(event.key==='ArrowRight'){event.preventDefault();move(1)}
    });
    const pin=carousel.closest('[data-carousel-pin]');
    const syncPinned=()=>{
      if(!pin)return;
      const rect=pin.getBoundingClientRect();
      const travel=Math.max(rect.height-innerHeight,1);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      const target=Math.min(slides.length-1,Math.floor(progress*slides.length));
      if(target!==active){active=target;render()}
    };
    if(pin){addEventListener('scroll',syncPinned,{passive:true});addEventListener('resize',syncPinned,{passive:true});}
    else stage.addEventListener('wheel',event=>{
      const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      if(Math.abs(delta)<18||Date.now()-lastWheel<420)return;
      event.preventDefault();lastWheel=Date.now();move(delta>0?1:-1);
    },{passive:false});
    stage.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      dragStart={x:event.clientX,y:event.clientY,moved:false,id:event.pointerId};
    });
    addEventListener('pointermove',event=>{
      if(!dragStart||event.pointerId!==dragStart.id)return;
      const dx=event.clientX-dragStart.x,dy=event.clientY-dragStart.y;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>10){dragStart.moved=true;stage.classList.add('is-dragging')}
    });
    const endDrag=event=>{
      if(!dragStart||event.pointerId!==dragStart.id)return;
      const dx=event.clientX-dragStart.x,moved=dragStart.moved;
      stage.classList.remove('is-dragging');
      if(moved&&Math.abs(dx)>35){move(dx<0?1:-1);stage.dataset.dragged='true';setTimeout(()=>delete stage.dataset.dragged,350)}
      dragStart=null;
    };
    addEventListener('pointerup',endDrag);
    addEventListener('pointercancel',event=>{if(dragStart&&event.pointerId===dragStart.id){dragStart=null;stage.classList.remove('is-dragging')}});
    addEventListener('resize',render,{passive:true});
    render();syncPinned();requestAnimationFrame(()=>requestAnimationFrame(syncPinned));
  });
  // Prism-style landing work: each cover and its challenge copy move together.
  document.querySelectorAll('[data-prism-carousel]').forEach(carousel=>{
    const stage=carousel.querySelector('[data-prism-stage]');
    const slides=[...carousel.querySelectorAll('[data-prism-slide]')];
    const ticks=[...carousel.querySelectorAll('[data-prism-tick]')];
    const status=carousel.querySelector('[data-prism-status]');
    if(!stage||!slides.length)return;
    let active=0,dragStart=null,lastWheel=0;
    const render=()=>{
      const spread=Math.min(stage.clientWidth*.46,530);
      slides.forEach((slide,index)=>{
        let offset=index-active;
        if(offset>slides.length/2)offset-=slides.length;
        if(offset< -slides.length/2)offset+=slides.length;
        const distance=Math.abs(offset),visible=distance<=1;
        slide.classList.toggle('is-active',offset===0);
        slide.setAttribute('aria-hidden',String(offset!==0));
        slide.tabIndex=offset===0?0:-1;
        slide.style.transform=`translate(-50%,0) translateX(${offset*spread}px) scale(${offset===0?1:.76})`;
        slide.style.zIndex=String(10-distance);
        slide.style.opacity=offset===0?'1':visible?'.48':'0';
        slide.style.filter=offset===0?'none':'grayscale(.62) saturate(.55)';
        slide.style.pointerEvents=visible?'auto':'none';
      });
      ticks.forEach((tick,index)=>{
        const selected=index===active;
        tick.classList.toggle('is-active',selected);
        tick.setAttribute('aria-current',String(selected));
      });
      const current=slides[active];
      if(status)status.textContent=`${current.querySelector('strong')?.textContent||'Project'} selected`;
    };
    const select=index=>{active=(index+slides.length)%slides.length;render()};
    const move=step=>select(active+step);
    slides.forEach((slide,index)=>slide.addEventListener('click',event=>{
      if(stage.dataset.dragged==='true'){event.preventDefault();return}
      if(index!==active){event.preventDefault();select(index)}
    }));
    ticks.forEach(tick=>tick.addEventListener('click',()=>select(Number(tick.dataset.prismTick))));
    carousel.querySelector('[data-prism-prev]')?.addEventListener('click',()=>move(-1));
    carousel.querySelector('[data-prism-next]')?.addEventListener('click',()=>move(1));
    stage.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
      if(event.key==='ArrowRight'){event.preventDefault();move(1)}
    });
    const pin=carousel.closest('[data-carousel-pin]');
    const syncPinned=()=>{
      if(!pin)return;
      const rect=pin.getBoundingClientRect();
      const travel=Math.max(rect.height-innerHeight,1);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      const target=Math.min(slides.length-1,Math.floor(progress*slides.length));
      if(target!==active){active=target;render()}
    };
    if(pin){addEventListener('scroll',syncPinned,{passive:true});addEventListener('resize',syncPinned,{passive:true});}
    else stage.addEventListener('wheel',event=>{
      const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      if(Math.abs(delta)<24||Date.now()-lastWheel<560)return;
      event.preventDefault();lastWheel=Date.now();move(delta>0?1:-1);
    },{passive:false});
    stage.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      dragStart={x:event.clientX,y:event.clientY,moved:false,id:event.pointerId};
    });
    addEventListener('pointermove',event=>{
      if(!dragStart||event.pointerId!==dragStart.id)return;
      const dx=event.clientX-dragStart.x,dy=event.clientY-dragStart.y;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>10){dragStart.moved=true;stage.classList.add('is-dragging')}
    });
    const endDrag=event=>{
      if(!dragStart||event.pointerId!==dragStart.id)return;
      const dx=event.clientX-dragStart.x,moved=dragStart.moved;
      stage.classList.remove('is-dragging');
      if(moved&&Math.abs(dx)>35){move(dx<0?1:-1);stage.dataset.dragged='true';setTimeout(()=>delete stage.dataset.dragged,350)}
      dragStart=null;
    };
    addEventListener('pointerup',endDrag);
    addEventListener('pointercancel',event=>{if(dragStart&&event.pointerId===dragStart.id){dragStart=null;stage.classList.remove('is-dragging')}});
    addEventListener('resize',render,{passive:true});
    render();syncPinned();requestAnimationFrame(()=>requestAnimationFrame(syncPinned));
  });
  // The homepage uses ScrollTrigger for purposeful entry and scroll-linked movement.
  // Native scrolling remains in control; if GSAP cannot load, every element stays visible.
  const landing=document.querySelector('.hero[data-sc-act]');
  if(landing&&window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    const landingMotion=gsap.matchMedia();
    landingMotion.add('(prefers-reduced-motion: no-preference)',()=>{
      const intro=gsap.timeline({defaults:{ease:'power3.out'}});
      intro.fromTo('[data-home-copy]',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.7},.38)
        .fromTo('[data-home-portrait]',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.85},.22)
        .fromTo('.hero-actions',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.55},.62)
        .fromTo('[data-home-meta], [data-home-stats]',{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.5,stagger:.08},.78);

      gsap.to('.hero-portrait',{y:-22,ease:'none',scrollTrigger:{trigger:landing,start:'top top',end:'bottom top',scrub:.6}});
      gsap.utils.toArray('#featured [data-home-work]').forEach((item)=>{
        const image=item.querySelector('.thumb');
        const copy=item.querySelector('.body');
        if(image)gsap.fromTo(image,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.9,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 84%',once:true}});
        if(copy)gsap.fromTo(copy,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.65,ease:'power2.out',scrollTrigger:{trigger:item,start:'top 80%',once:true}});
      });
      gsap.utils.toArray('.friction-list article').forEach((item)=>gsap.fromTo(item,{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.55,ease:'power2.out',scrollTrigger:{trigger:item,start:'top 86%',once:true}}));
      addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
    });
  }
  if(window.ScrollCraft){ScrollCraft.mount(document.body)}
})();

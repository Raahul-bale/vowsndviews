const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !open);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('open');
  }));
}

const filterButtons = document.querySelectorAll('.filter-button');
const portfolioTiles = document.querySelectorAll('.portfolio-tile');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle('is-selected', item === button));
  portfolioTiles.forEach((tile) => { tile.hidden = filter !== 'all' && tile.dataset.category !== filter; });
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = Boolean(window.gsap && window.ScrollTrigger && !reduceMotion);

if (hasGsap) {
  document.body.classList.add('has-gsap');
  gsap.registerPlugin(ScrollTrigger);

  const heroItems = document.querySelectorAll('.hero-copy > *, .portfolio-hero-copy > *, .about-hero-copy > *');
  gsap.fromTo(heroItems, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .75, stagger: .1, ease: 'power2.out', delay: .12 });

  document.querySelectorAll('.hero-visual > img, .portfolio-hero-photo > img, .about-hero-image > img').forEach((image) => {
    gsap.fromTo(image, { clipPath: 'inset(0 0 100% 0)', scale: 1.04 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.35, ease: 'power3.out', delay: .12 });
    gsap.to(image, { scale: 1.055, duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' });
    gsap.to(image, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  document.querySelectorAll('.service-image img, .gallery img, .approach-photo img, .portfolio-tile .tile-image img').forEach((image, index) => {
    const drift = [7, -11, 4, -8, 12, -5][index % 6];
    gsap.fromTo(image, { scale: 1.12 }, { scale: 1.015, ease: 'none', scrollTrigger: { trigger: image, start: 'top 100%', end: 'bottom 15%', scrub: .9 } });
    gsap.to(image, { yPercent: drift, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  });

  gsap.utils.toArray('.photo-overlay-note').forEach((note) => {
    gsap.fromTo(note, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: .8, delay: .75, ease: 'power2.out' });
    const flower = note.querySelector('i');
    if (flower) gsap.to(flower, { y: -7, rotation: 18, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });

  const revealGroups = [
    '.intro-content', '.service-card', '.quote-band > *', '.portfolio-top', '.gallery figure',
    '.approach-photo', '.approach-copy > *', '.contact > *', '.portfolio-intro > *', '.portfolio-tile',
    '.portfolio-cta > *', '.about-story-content > *', '.team-card', '.team-heading > *', '.about-cta > *'
  ];
  revealGroups.forEach((selector) => gsap.utils.toArray(selector).forEach((element) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  }));

  gsap.utils.toArray('.intro h2, .section-heading h2, .portfolio-top h2, .approach h2, .portfolio-intro h2, .team-heading h2, .about-story-content h2').forEach((heading) => {
    gsap.fromTo(heading, { clipPath: 'inset(0 0 100% 0)', y: 24 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 86%', once: true } });
  });

  document.querySelectorAll('.botanical-break path').forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', scrollTrigger: { trigger: path.parentElement, start: 'top 85%', once: true } });
  });

  const story = document.querySelector('.story-scroll');
  if (story) {
    const photos = [...story.querySelectorAll('.story-visual img')];
    const chapters = [...story.querySelectorAll('.story-chapter')];
    const counter = story.querySelector('.story-count');
    const progress = story.querySelector('.story-progress span');
    let current = 0;
    photos.forEach((photo, index) => photo.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'));
    chapters.forEach((chapter, index) => chapter.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'));
    const activate = (index) => {
      if (index === current) return;
      const previous = current;
      current = index;
      photos[previous].classList.remove('is-active');
      chapters[previous].classList.remove('is-active');
      photos[previous].setAttribute('aria-hidden', 'true');
      chapters[previous].setAttribute('aria-hidden', 'true');
      photos[index].classList.add('is-active');
      chapters[index].classList.add('is-active');
      photos[index].setAttribute('aria-hidden', 'false');
      chapters[index].setAttribute('aria-hidden', 'false');
      counter.innerHTML = `0${index + 1} <i>/</i> 03`;
      gsap.fromTo(photos[index], { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: .8, ease: 'power2.out' });
      gsap.fromTo(chapters[index].querySelectorAll('span,h2,p'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .55, stagger: .07, ease: 'power2.out' });
    };
    ScrollTrigger.create({ trigger: story, start: 'top top+=86', end: 'bottom bottom', onUpdate: (self) => {
      activate(Math.min(2, Math.floor(self.progress * 3)));
      gsap.set(progress, { scaleX: self.progress, transformOrigin: 'left center' });
    } });
  }
}

// Mobile swipe plus arrow controls for the homepage photo filmstrip.
document.querySelectorAll('.filmstrip-shell').forEach((shell) => {
  const strip = shell.querySelector('.filmstrip');
  shell.querySelector('.filmstrip-prev')?.addEventListener('click', () => strip.scrollBy({ left: -strip.clientWidth * .72, behavior: reduceMotion ? 'auto' : 'smooth' }));
  shell.querySelector('.filmstrip-next')?.addEventListener('click', () => strip.scrollBy({ left: strip.clientWidth * .72, behavior: reduceMotion ? 'auto' : 'smooth' }));
});

// Rose curtain transition for local page-to-page navigation.
if (!reduceMotion) {
  const curtain = document.createElement('div');
  curtain.className = 'page-transition is-entering';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<svg viewBox="0 0 180 90" aria-hidden="true"><path d="M8 68C48 63 68 48 90 20c12-15 32-14 53-4M52 51c-13-15-13-29-2-41 12 13 12 27-1 41Zm31-23c-3-15 2-25 14-31 5 14 1 25-14 31Zm10-8c15-5 27-1 35 11-14 6-26 2-35-11Z"/></svg><span>VOWS & VIEWS</span>';
  document.body.append(curtain);
  window.setTimeout(() => curtain.classList.remove('is-entering'), 720);
  window.addEventListener('pageshow', (event) => { if (event.persisted) curtain.classList.remove('is-leaving', 'is-entering'); });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const destination = new URL(link.href, location.href);
    if (!['http:', 'https:', 'file:'].includes(destination.protocol) || destination.origin !== location.origin || destination.pathname === location.pathname) return;
    event.preventDefault();
    curtain.classList.add('is-leaving');
    window.setTimeout(() => { location.href = destination.href; }, 520);
  });
}

// A subtle rose cursor bloom appears only on desktop fine pointers.
if (window.matchMedia('(pointer: fine) and (min-width: 900px)').matches && !reduceMotion) {
  const bloom = document.createElement('div');
  bloom.className = 'cursor-bloom';
  bloom.setAttribute('aria-hidden', 'true');
  bloom.innerHTML = '<span>✳</span>';
  document.body.append(bloom);
  if (window.gsap) gsap.set(bloom, { xPercent: -50, yPercent: -50 });
  const xTo = window.gsap ? gsap.quickTo(bloom, 'x', { duration: .35, ease: 'power3' }) : (x) => bloom.style.left = `${x}px`;
  const yTo = window.gsap ? gsap.quickTo(bloom, 'y', { duration: .35, ease: 'power3' }) : (y) => bloom.style.top = `${y}px`;
  document.addEventListener('pointermove', (event) => { xTo(event.clientX); yTo(event.clientY); });
  document.querySelectorAll('.hero-visual,.portfolio-hero-photo,.about-hero-image,.service-card,.gallery figure,.portfolio-tile a,.team-card,a.button').forEach((target) => {
    target.addEventListener('pointerenter', () => bloom.classList.add('is-visible'));
    target.addEventListener('pointerleave', () => bloom.classList.remove('is-visible'));
  });
}

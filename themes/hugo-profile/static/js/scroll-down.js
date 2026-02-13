(() => {
  const btn = document.querySelector('.hero-scroll-down');
  const hero = document.querySelector('#hero');
  const about = document.querySelector('#about');
  if (!btn || !hero) return;

  const SHOW_AT_TOP_PX = 8;
  let aboutSeen = false;
  let ticking = false;

  const setVisible = (on) => {
    btn.classList.toggle('is-visible', on);
    btn.classList.toggle('is-hidden', !on);
  };

  const aboutIsVisible = () => {
    if (!about) return false;
    const r = about.getBoundingClientRect();
    // "starts appearing" (tweak if you want it earlier/later)
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  };

  const heroIsVisible = () => {
    const r = hero.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  const evaluate = () => {
    const nearTop = window.scrollY <= SHOW_AT_TOP_PX;

    // update aboutSeen if we can observe it
    const aboutVisibleNow = aboutIsVisible();
    if (aboutVisibleNow) aboutSeen = true;
    // if user goes back up enough that About is no longer visible, clear the flag
    if (!aboutVisibleNow && nearTop) aboutSeen = false;

    const shouldShow =
      nearTop &&
      heroIsVisible() &&
      !aboutVisibleNow &&
      !aboutSeen;

    setVisible(shouldShow);
  };

  const scheduleEvaluate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      evaluate();
    });
  };

  // Initial + on refresh/back-forward cache restore
  window.addEventListener('pageshow', scheduleEvaluate, { passive: true });
  document.addEventListener('DOMContentLoaded', scheduleEvaluate, { passive: true });

  // Re-evaluate on scroll/resize (so it can reappear when back on top)
  window.addEventListener('scroll', scheduleEvaluate, { passive: true });
  window.addEventListener('resize', scheduleEvaluate, { passive: true });

  // Track About visibility (more reliable than polling alone)
  if (about && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) aboutSeen = true;
        }
        // After updates, re-evaluate visibility rules
        scheduleEvaluate();
      },
      { threshold: 0.08 }
    );
    io.observe(about);
  }

  // Final immediate evaluation
  evaluate();
})();
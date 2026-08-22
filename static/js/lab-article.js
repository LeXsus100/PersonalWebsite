(() => {
  const compactHeader = document.querySelector('[data-lab-reading-header]');
  const articleHeader = document.querySelector('[data-lab-article-header]');
  const toTop = document.querySelector('[data-lab-to-top]');

  if (!articleHeader || (!compactHeader && !toTop)) return;

  let ticking = false;

  const headerOffset = () => {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--header-offset');
    return Number.parseFloat(value) || 78;
  };

  const update = () => {
    const scrollY = window.scrollY;

    if (compactHeader) {
      const compactVisible = articleHeader.getBoundingClientRect().bottom <= headerOffset() + 8;
      compactHeader.classList.toggle('is-visible', compactVisible);
      compactHeader.setAttribute('aria-hidden', String(!compactVisible));
    }

    if (toTop) {
      const topVisible = scrollY > Math.max(420, window.innerHeight * 0.55);
      toTop.classList.toggle('is-visible', topVisible);
    }
  };

  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  if (toTop) {
    toTop.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleUpdate, { passive: true });
  update();
})();

(() => {
  const galleries = [...document.querySelectorAll('[data-lab-gallery]')];
  const standaloneImages = [...document.querySelectorAll('[data-lightbox-src]')]
    .filter((trigger) => !trigger.closest('[data-lab-gallery]'));

  if (!galleries.length && !standaloneImages.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'article-lightbox';
  dialog.setAttribute('aria-label', 'Full-screen image viewer');
  dialog.innerHTML = `
    <div class="article-lightbox__surface">
      <div class="article-lightbox__topbar">
        <span class="article-lightbox__counter" data-lightbox-counter></span>
        <button class="article-lightbox__close" type="button" data-lightbox-close aria-label="Close full-screen image">&#215;</button>
      </div>
      <div class="article-lightbox__stage">
        <button class="article-lightbox__nav article-lightbox__nav--previous" type="button" data-lightbox-previous aria-label="Previous image">&#8592;</button>
        <img data-lightbox-image alt="">
        <button class="article-lightbox__nav article-lightbox__nav--next" type="button" data-lightbox-next aria-label="Next image">&#8594;</button>
      </div>
      <p class="article-lightbox__caption" data-lightbox-caption></p>
      <div class="article-lightbox__thumbnails" data-lightbox-thumbnails aria-label="Gallery previews"></div>
    </div>`;
  document.body.append(dialog);

  const lightboxImage = dialog.querySelector('[data-lightbox-image]');
  const lightboxCaption = dialog.querySelector('[data-lightbox-caption]');
  const lightboxCounter = dialog.querySelector('[data-lightbox-counter]');
  const lightboxThumbnails = dialog.querySelector('[data-lightbox-thumbnails]');
  const lightboxPrevious = dialog.querySelector('[data-lightbox-previous]');
  const lightboxNext = dialog.querySelector('[data-lightbox-next]');
  const lightboxClose = dialog.querySelector('[data-lightbox-close]');

  let lightboxItems = [];
  let lightboxIndex = 0;
  let openingTrigger = null;

  const itemFromTrigger = (trigger) => ({
    src: trigger.dataset.lightboxSrc,
    alt: trigger.dataset.lightboxAlt || '',
    caption: trigger.dataset.lightboxCaption || ''
  });

  const renderLightbox = () => {
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    lightboxCaption.hidden = !item.caption;
    lightboxCounter.textContent = lightboxItems.length > 1
      ? `${lightboxIndex + 1} / ${lightboxItems.length}`
      : 'Image preview';

    const multiple = lightboxItems.length > 1;
    lightboxPrevious.hidden = !multiple;
    lightboxNext.hidden = !multiple;
    lightboxThumbnails.hidden = !multiple;

    [...lightboxThumbnails.children].forEach((thumbnail, index) => {
      const active = index === lightboxIndex;
      thumbnail.classList.toggle('is-active', active);
      if (active) thumbnail.setAttribute('aria-current', 'true');
      else thumbnail.removeAttribute('aria-current');
    });
  };

  const setLightboxIndex = (index) => {
    const total = lightboxItems.length;
    if (!total) return;
    lightboxIndex = (index + total) % total;
    renderLightbox();
  };

  const buildLightboxThumbnails = () => {
    lightboxThumbnails.replaceChildren();
    lightboxItems.forEach((item, index) => {
      const button = document.createElement('button');
      const image = document.createElement('img');
      button.type = 'button';
      button.className = 'article-lightbox__thumbnail';
      button.setAttribute('aria-label', `Show image ${index + 1} of ${lightboxItems.length}`);
      image.src = item.src;
      image.alt = '';
      button.append(image);
      button.addEventListener('click', () => setLightboxIndex(index));
      lightboxThumbnails.append(button);
    });
  };

  const openLightbox = (items, index, trigger) => {
    lightboxItems = items;
    lightboxIndex = index;
    openingTrigger = trigger;
    buildLightboxThumbnails();
    renderLightbox();
    document.body.classList.add('has-open-lightbox');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    lightboxClose.focus();
  };

  lightboxPrevious.addEventListener('click', () => setLightboxIndex(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => setLightboxIndex(lightboxIndex + 1));
  lightboxClose.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setLightboxIndex(lightboxIndex - 1);
    if (event.key === 'ArrowRight') setLightboxIndex(lightboxIndex + 1);
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-open-lightbox');
    if (openingTrigger?.isConnected) openingTrigger.focus();
  });

  galleries.forEach((gallery) => {
    const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
    const openButtons = [...gallery.querySelectorAll('[data-gallery-open]')];
    const thumbnails = [...gallery.querySelectorAll('[data-gallery-thumbnail]')];
    const previous = gallery.querySelector('[data-gallery-previous]');
    const next = gallery.querySelector('[data-gallery-next]');
    const counter = gallery.querySelector('[data-gallery-counter]');
    const items = openButtons.map(itemFromTrigger);
    let index = 0;

    const show = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== index; });
      thumbnails.forEach((thumbnail, thumbnailIndex) => {
        const active = thumbnailIndex === index;
        thumbnail.classList.toggle('is-active', active);
        if (active) thumbnail.setAttribute('aria-current', 'true');
        else thumbnail.removeAttribute('aria-current');
      });
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    };

    previous?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));
    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      thumbnail.addEventListener('click', () => show(thumbnailIndex));
    });
    openButtons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => openLightbox(items, buttonIndex, button));
    });
  });

  standaloneImages.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox([itemFromTrigger(trigger)], 0, trigger));
  });
})();

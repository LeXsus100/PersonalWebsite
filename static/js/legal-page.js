(() => {
  const compactHeader = document.querySelector('[data-legal-reading-header]');
  const pageHeader = document.querySelector('[data-legal-page-header]');

  if (!compactHeader || !pageHeader) return;

  const getHeaderOffset = () => {
    const siteHeader = document.querySelector('body > header, header');
    return siteHeader ? siteHeader.getBoundingClientRect().height : 78;
  };

  const updateCompactHeader = () => {
    const shouldShow = pageHeader.getBoundingClientRect().bottom <= getHeaderOffset() + 8;
    compactHeader.classList.toggle('is-visible', shouldShow);
    compactHeader.setAttribute('aria-hidden', String(!shouldShow));
  };

  document.addEventListener('scroll', updateCompactHeader, { passive: true });
  window.addEventListener('resize', updateCompactHeader);
  window.addEventListener('pageshow', updateCompactHeader);
  updateCompactHeader();
})();

const originalFavicons = [
  { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-chrome-192x192.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicons/favicon-180x180.png' },
];

export const setFavicon = (href: string): void => {
  const faviconElements = document.querySelectorAll('link[rel="icon"]');

  faviconElements.forEach((faviconEl) => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = href;

    faviconEl?.parentNode?.replaceChild(link, faviconEl);
  });
};

export const resetFavicons = () => {
  const faviconElements = document.querySelectorAll('link[rel="icon"]');

  originalFavicons.forEach(({ rel, type, href }, index) => {
    const faviconEl = faviconElements[index];

    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.type = type;

    faviconEl?.parentNode?.replaceChild(link, faviconEl);
  });
};

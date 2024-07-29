// cssLoader.js

export function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = browser.runtime.getURL(filename);
  document.head.appendChild(link);
}
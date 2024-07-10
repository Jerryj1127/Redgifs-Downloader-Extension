// cssLoader.js

export function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL(filename);
  document.head.appendChild(link);
}
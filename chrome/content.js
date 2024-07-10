// content.js
(async function() {
  const cssLoader = await import(chrome.runtime.getURL('modules/cssLoader.js'));
  const downloadButton = await import(chrome.runtime.getURL('modules/downloadButton.js'));
  const mutationObserver = await import(chrome.runtime.getURL('modules/mutationObserver.js'));
  const storageManager = await import(chrome.runtime.getURL('modules/storageManager.js'));

  cssLoader.loadCSS('css/styles.css');
  mutationObserver.observeDOM(downloadButton.addDownloadButton);
})();
// content.js

(async function() {
  const cssLoader = await import(browser.runtime.getURL('modules/cssLoader.js'));
  const downloadButton = await import(browser.runtime.getURL('modules/downloadButton.js'));
  const copyLinkButton = await import(browser.runtime.getURL('modules/copyLinkButton.js'));
  const mutationObserver = await import(browser.runtime.getURL('modules/mutationObserver.js'));

  cssLoader.loadCSS('css/styles.css');

  const addButtons = (sideBarWrap) => {
    downloadButton.addDownloadButton(sideBarWrap);
    copyLinkButton.addCopyLinkButton(sideBarWrap);
  };

  mutationObserver.observeDOM(addButtons);
})();

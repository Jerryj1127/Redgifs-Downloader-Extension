// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ lastUpdateCheck: 0 }, () => {
    console.log('RedGifs Downloader has been installed.');
  });
});

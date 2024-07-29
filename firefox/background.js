browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ lastUpdateCheck: 0 }, () => {
    console.log('RedGifs Downloader has been installed.');
  });
});

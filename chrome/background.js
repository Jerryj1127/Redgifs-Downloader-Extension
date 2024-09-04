// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ lastUpdateCheck: 0 }, () => {
    console.log('RedGifs Downloader has been installed.');
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started with ID:", downloadId);
        

        //
        chrome.downloads.onChanged.addListener(function(delta) {
          if (delta.id === downloadId && delta.state && delta.state.current === "complete") {

            // Query for the download item to get the file size
            chrome.downloads.search({ id: downloadId }, function(results) {
              if (results && results.length > 0) {
                const downloadItem = results[0];
                const size = downloadItem.fileSize;  // File size in bytes
                console.log('Download completed. File size:', size);

                
                sendResponse({ success: true, fileSize: size });
              }
            });
          }
        });
      }
    });

    return true;
  }
});

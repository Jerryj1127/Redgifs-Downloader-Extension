// storageManager.js

// Get storage value
export function getCounter(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  }
  
// Set storage value
export function setCounter(values) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(values, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
  
export function incrementDownloadCounter(duration, size) {
    chrome.storage.local.get(['downloadCounter', 'totalDuration', 'totalSize'], function(result) {
      const newCounter = (result.downloadCounter || 0) + 1;
  
      chrome.storage.local.set({ downloadCounter: newCounter }, function() {
        if (chrome.runtime.lastError) {
          console.log('Error saving download counter:', chrome.runtime.lastError.message);
        } else {
          console.log('Download counter updated:', newCounter);
          if (newCounter % 50 == 0) {
            chrome.tabs.create({ url: `https://redgifsdownloader.onrender.com/support?count=${newCounter}` });
          }
        }
      });
  
      chrome.storage.local.set({ totalDuration: (result.totalDuration || 0) + duration, totalSize: (result.totalSize || 0) + size }, function() {
        if (chrome.runtime.lastError) {
          console.log('Error saving video stats:', chrome.runtime.lastError.message);
        } else {
          console.log('Video stats updated:');
          console.log('Total Duration:', (result.totalDuration || 0) + duration);
          console.log('Total Size:', (result.totalSize || 0) + size);
        }
      });
    });
  }
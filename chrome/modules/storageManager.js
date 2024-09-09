// storageManager.js

export function getStorageItem(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

export function setStorageItem(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

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
    const newDuration = (result.totalDuration || 0) + duration;
    const newSize = (result.totalSize || 0) + size;

    chrome.storage.local.set({ downloadCounter: newCounter, totalDuration: newDuration, totalSize: newSize }, function() {
      if (chrome.runtime.lastError) {
        console.log('Error saving data:', chrome.runtime.lastError.message);
      } else {
        console.log('Download counter updated:', newCounter);
        console.log('Total Duration updated:', newDuration);
        console.log('Total Size updated:', newSize);

        if (newCounter % 20 === 0) {
          chrome.runtime.sendMessage({
                        action: "openSupportTab",
                        count: newCounter,
                        duration: newDuration,
                        size: newSize
          });
        }
      }
    });
  });
}

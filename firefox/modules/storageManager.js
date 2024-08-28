// storageManager.js

export function getStorageItem(key) {
  return new Promise((resolve) => {
    browser.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

export function setStorageItem(key, value) {
  return new Promise((resolve) => {
    browser.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

// Get storage value
export function getCounter(keys) {
    return new Promise((resolve) => {
      browser.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  }
  
// Set storage value
export function setCounter(values) {
  return new Promise((resolve, reject) => {
    browser.storage.local.set(values, () => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
  
export function incrementDownloadCounter(duration, size) {
    browser.storage.local.get(['downloadCounter', 'totalDuration', 'totalSize'], function(result) {
      const newCounter = (result.downloadCounter || 0) + 1;
  
      browser.storage.local.set({ downloadCounter: newCounter }, function() {
        if (browser.runtime.lastError) {
          console.log('Error saving download counter:', browser.runtime.lastError.message);
        } else {
          console.log('Download counter updated:', newCounter);
          if (newCounter % 50 == 0) {
            browser.tabs.create({ url: `https://redgifsdlr123.onrender.com/support?count=${newCounter}` });
          }
        }
      });
  
      browser.storage.local.set({ totalDuration: (result.totalDuration || 0) + duration, totalSize: (result.totalSize || 0) + size }, function() {
        if (browser.runtime.lastError) {
          console.log('Error saving video stats:', browser.runtime.lastError.message);
        } else {
          console.log('Video stats updated:');
          console.log('Total Duration:', (result.totalDuration || 0) + duration);
          console.log('Total Size:', (result.totalSize || 0) + size);
        }
      });
    });
  }
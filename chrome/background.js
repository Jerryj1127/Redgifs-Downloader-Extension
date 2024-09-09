// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ lastUpdateCheck: 0 }, () => {
    console.log('RedGifs Downloader has been installed.');
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download") {
    console.log("ivide ")
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
  else if (message.action === "openSupportTab") {
    chrome.tabs.create({ url: `https://redgifsdlr123.onrender.com/support?count=${message.count}&size=${message.size}&duration=${message.duration}` }, function(tab) {
      if (chrome.runtime.lastError) {
        console.error('Error creating tab:', chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("Tab created with ID:", tab.id);
        sendResponse({ success: true });
      }
    });
    return true; // Keep the message channel open for asynchronous sendResponse
  }

  // else if (message.action === "openSupportTab") {
  //   // Create a form and submit it with POST method
  //   const form = document.createElement('form');
  //   form.method = 'POST';
  //   form.action = 'https://redgifsdlr123.onrender.com/support';
  //   form.target = '_blank'; // Open the form submission in a new tab
  
  //   // Create input elements to hold the POST parameters
  //   const countInput = document.createElement('input');
  //   countInput.type = 'hidden';
  //   countInput.name = 'count';
  //   countInput.value = message.count;
  
  //   const sizeInput = document.createElement('input');
  //   sizeInput.type = 'hidden';
  //   sizeInput.name = 'size';
  //   sizeInput.value = message.size;
  
  //   const durationInput = document.createElement('input');
  //   durationInput.type = 'hidden';
  //   durationInput.name = 'duration';
  //   durationInput.value = message.duration;
  
  //   // Append the inputs to the form
  //   form.appendChild(countInput);
  //   form.appendChild(sizeInput);
  //   form.appendChild(durationInput);
  
  //   // Append the form to the document body and submit it
  //   document.body.appendChild(form);
  //   form.submit();
  
  //   // Remove the form after submission
  //   document.body.removeChild(form);
  
  //   sendResponse({ success: true });
  //   return true; // Keep the message channel open for asynchronous sendResponse
  // }
  

});

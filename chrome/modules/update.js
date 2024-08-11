// update.js

// Function to check for updates
async function checkForUpdate() {
  const currentVersion = chrome.runtime.getManifest().version; // Get the current version dynamically

  try {
    const response = await fetch('https://redgifsdlr.onrender.com//extension/latest/');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const latestVersion = await response.text();
    const updateNeeded = isNewerVersion(latestVersion.trim(), currentVersion);
    chrome.storage.local.set({ updateNeeded });
  } catch (error) {
    console.log('Error checking for updates:', error);
  }
}

function isNewerVersion(latest, current) {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);

  for (let i = 0; i < latestParts.length; i++) {
    if (latestParts[i] > (currentParts[i] || 0)) return true;
    if (latestParts[i] < (currentParts[i] || 0)) return false;
  }
  return false;
}

// Function to update the last check timestamp
async function updateLastCheckTimestamp() {
  const now = Date.now();
  chrome.storage.local.set({ lastUpdateCheck: now });
}

// Function to determine if an update check is needed
async function isUpdateCheckNeeded() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastUpdateCheck'], (result) => {
      const lastCheck = result.lastUpdateCheck || 0;
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
      resolve(now - lastCheck > oneDay);
    });
  });
}

// Function to handle the update check process
export async function handleUpdateCheck() {
  const updateCheckNeeded = await isUpdateCheckNeeded();
  if (updateCheckNeeded) {
    await checkForUpdate();
    await updateLastCheckTimestamp();
  }
}

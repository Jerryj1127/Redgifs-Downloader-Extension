// popup.js

import { getCounter } from './modules/storageManager.js';
import { handleUpdateCheck } from './modules/update.js'
import { formatDuration, formatSize } from './modules/utils.js';


document.addEventListener('DOMContentLoaded', async function() {

    const home = "https://redgifsdlr123.onrender.com"

    const version = browser.runtime.getManifest().version;
    document.querySelector('.version').innerText = `v${version}B`;

    // Update the stats
    const result = await getCounter(['downloadCounter', 'totalSize', 'totalDuration']);
    
    document.getElementById('total-downloads').innerText = result.downloadCounter || 0;
    document.getElementById('total-data').innerText = formatSize(result.totalSize || 0);
    document.getElementById('content-time').innerText = formatDuration(result.totalDuration || 0);

    // Homepage and Report Error links
    document.getElementById('homepage').href = home;
    document.getElementById('report-error').href = `${home}#contact`;
    document.getElementById('bmc-url').href = `${home}/bmc`;

    // Handle update check
    await handleUpdateCheck();

    // Check if update is needed and display the update message
    browser.storage.local.get(['updateNeeded'], function(result) {
        if (result.updateNeeded) {
            document.getElementById('update-message').style.display = 'block';
            document.getElementById('update-url').href = `${home}/extension`;

        }
    });
});

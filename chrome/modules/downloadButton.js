// downloadButton.js

import { incrementDownloadCounter } from './storageManager.js';
import { isDownloading, addDownload, removeDownload } from './downloadTracker.js';
import { getToken, fetchNewToken } from './token.js';

async function fetchGifData(gifName) {
  try {
    let authToken = await getToken();
    let url = `https://api.redgifs.com/v2/gifs/${encodeURIComponent(gifName)}`;

    let headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'authorization': `Bearer ${authToken}`,
      'cache-control': 'no-cache',
      'dnt': '1',
      'origin': 'https://www.redgifs.com',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://www.redgifs.com/',
      'user-agent': navigator.userAgent
    };

    let response = await fetch(url, { headers });

    if (response.status === 401) {
      // Token might be expired, generate a new token
      authToken = await fetchNewToken();
      headers['authorization'] = `Bearer ${authToken}`;
      response = await fetch(url, { headers });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      urls: data.gif.urls,
      duration: data.gif.duration
    };
  } catch (error) {
    console.error('Error fetching GIF data:', error);
    throw error;
  }
}

export function addDownloadButton(sideBarWrap) {
  if (!sideBarWrap.querySelector('.download-button')) {
    const listItem = document.createElement('li');
    listItem.classList.add('SideBar-Item');

    const button = document.createElement('button');
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 16l6-6h-4V4h-4v6H6l6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    button.classList.add('download-button', 'rg-button', 'icon');
    button.setAttribute('aria-label', 'Download');

    listItem.appendChild(button);

    const sideBar = sideBarWrap.querySelector('.SideBar');
    if (sideBar) {
      const items = sideBar.querySelectorAll('.SideBar-Item');
      if (items.length > 1) {
        sideBar.insertBefore(listItem, items[items.length - 1]);
      } else {
        sideBar.appendChild(listItem);
      }
    } else {
      const newSideBar = document.createElement('ul');
      newSideBar.classList.add('SideBar');
      newSideBar.appendChild(listItem);
      sideBarWrap.appendChild(newSideBar);
    }

    // Check if the video is already downloading
    const videoElement = sideBarWrap.closest('.GifPreview');
    if (videoElement) {
      const userInfoDateElement = videoElement.querySelector('.UserInfo-Text .UserInfo-Date');
      if (userInfoDateElement) {
        const videoUrl = userInfoDateElement.href;
        const gifName = videoUrl.split('/')[4];
        if (isDownloading(gifName)) {
          button.innerHTML = '<div class="loading-circle"></div>';
          button.disabled = true;
        }
      }
    }

    button.addEventListener('click', handleDownloadClick);
  }
}

async function handleDownloadClick(event) {
  const button = event.target.closest('button');
  const sideBarWrap = button.closest('.GifPreview-SideBarWrap');
  const videoElement = sideBarWrap.closest('.GifPreview');

  if (videoElement) {
    const userInfoDateElement = videoElement.querySelector('.UserInfo-Text .UserInfo-Date');
    if (userInfoDateElement) {
      const videoUrl = userInfoDateElement.href;
      const gifName = videoUrl.split('/')[4];
      if (videoUrl) {
        button.innerHTML = '<div class="loading-circle"></div>';
        button.disabled = true;
        addDownload(gifName);
        try {
          const gifData = await fetchGifData(gifName);
          const fallback = await fetch(`https://redgifsdlr.onrender.com/ext/api?url=${encodeURIComponent(videoUrl)}&v=${chrome.runtime.getManifest().version}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (gifData.urls) {
            let fileName = gifData.urls.hd.split('/').pop().split('?')[0];
            if (fileName.endsWith('.jpg')) {
                fileName = fileName.replace('-large', '');}
            const downloadResponse = await fetch(gifData.urls.hd); // Adjust URL based on the quality you need
            const blob = await downloadResponse.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${fileName}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            const contentLength = downloadResponse.headers.get('content-length');
            const size = contentLength ? parseInt(contentLength, 10) : blob.size;
            const duration = gifData.duration;

            removeDownload(gifName);  // Remove from the ongoing downloads list
            console.log("RedGifs Downloader :: Downloaded ", gifName)
            incrementDownloadCounter(duration, size);
          } else {
            console.error('Failed to get download URL:', gifData);
          }
        } catch (error) {
          console.error('Error downloading video:', error);
          removeDownload(gifName);  // Remove from the ongoing downloads list in case of error
        } finally {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 16l6-6h-4V4h-4v6H6l6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
          button.disabled = false;
        }
      } else {
        console.error('No video URL found.');
      }
    } else {
      console.error('No UserInfo-Date element found.');
    }
  } else {
    console.error('No GifPreview element found.');
  }
}

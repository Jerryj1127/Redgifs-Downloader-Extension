// downloadButton.js

import { incrementDownloadCounter } from './storageManager.js';
import { isDownloading, addDownload, removeDownload } from './downloadTracker.js';
import { generateToken } from './token.js';

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
        const filename = videoUrl.split('/')[4];
        if (isDownloading(filename)) {
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
      const filename = videoUrl.split('/')[4];
      if (videoUrl) {
        button.innerHTML = '<div class="loading-circle"></div>';
        button.disabled = true;
        addDownload(filename);
        try {
          const response = await fetch(`https://redgifsdownloader.onrender.com/extension/api?url=${encodeURIComponent(videoUrl)}&token=${generateToken(videoUrl)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
          if (data.download_url) {
            const downloadResponse = await fetch(`https://redgifsdownloader.onrender.com${data.download_url}`);
            const blob = await downloadResponse.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${filename}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            const contentLength = downloadResponse.headers.get('content-length');
            const size = contentLength ? parseInt(contentLength, 10) : blob.size;
            const duration = data.duration;

            removeDownload(filename);  // Remove from the ongoing downloads list
            incrementDownloadCounter(duration, size);
          } else {
            console.error('Failed to get download URL:', data.error);
          }
        } catch (error) {
          console.error('Error downloading video:', error);
          removeDownload(filename);  // Remove from the ongoing downloads list in case of error
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

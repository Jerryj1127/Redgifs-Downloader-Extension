// downloadTracker.js
const ongoingDownloads = new Set();

export function isDownloading(filename) {
  return ongoingDownloads.has(filename);
}

export function addDownload(filename) {
  ongoingDownloads.add(filename);
}

export function removeDownload(filename) {
  ongoingDownloads.delete(filename);
}

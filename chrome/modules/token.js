// token.js

import { getStorageItem, setStorageItem } from './storageManager.js';

let tokenKey = 'authToken';
let tokenExpiryKey = 'tokenExpiryTime';

async function fetchNewToken() {
  console.log("RedGifs Downloader :: Fetching new token");
  const response = await fetch('https://api.redgifs.com/v2/auth/temporary', {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'dnt': '1',
      'origin': 'https://www.redgifs.com',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://www.redgifs.com/',
      'user-agent': navigator.userAgent
    }
  });
  const data = await response.json();
  const token = data.token;
  const expiryTime = Date.now() + (23 * 3600 * 1000); // Assuming the token is valid for 23 hours
  setStorageItem(tokenKey, token);
  setStorageItem(tokenExpiryKey, expiryTime);
  return token;
}

async function getToken() {
  let token = await getStorageItem(tokenKey);
  let expiryTime = await getStorageItem(tokenExpiryKey);

  if (!token || Date.now() >= expiryTime) {
    return await fetchNewToken();
  }
  return token;
}

export { getToken, fetchNewToken };

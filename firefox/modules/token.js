// token.js

export function generateToken(url) {
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const secret = 'Redgifs Downloader'; 
    
    
    const hash = (data, secret) => {
        return data.split('').reduce((hash, char) => {
            return hash + char.charCodeAt(0) * secret.length;
        }, 0).toString(16);
    };
    
    const data = `${url}:${timestamp}`;
    const token = btoa(`${data}:${hash(data, secret)}`);
    
    return token;
}

export function getUrl(url)
{
    const baseUrl = "http://localhost:3000";

    let currentUrl = baseUrl;

    if(!url.startsWith("/"))
        currentUrl += '/';

    currentUrl += url;

    return currentUrl;
}
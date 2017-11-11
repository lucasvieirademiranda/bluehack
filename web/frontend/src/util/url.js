export function getUrl(url)
{
    const baseUrl = "http://localhost:80";

    let currentUrl = baseUrl;

    if(!url.startsWith("/"))
        currentUrl += '/';

    currentUrl += url;

    return currentUrl;
}
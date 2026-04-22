export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const targetUrl = `https://snappost-serve.pages.dev${url.pathname}${url.search}`;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("X-Forwarded-Host", url.hostname);
    newHeaders.set("Host", "snappost-serve.pages.dev");

    return fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
    });
  },
};

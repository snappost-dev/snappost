export async function proxyToLegacyApi(request: Request, legacyPath: string): Promise<Response> {
  const url = new URL(request.url);
  const target = new URL(`${url.protocol}//${url.host}${legacyPath}`);
  const proxiedRequest = new Request(target.toString(), request);
  return fetch(proxiedRequest);
}

function getContentType(pathname) {
  if (pathname.endsWith('.js.br')) {
    return 'application/javascript; charset=utf-8';
  }

  if (pathname.endsWith('.wasm.br')) {
    return 'application/wasm';
  }

  return 'application/octet-stream';
}

export async function onRequest(context) {
  const assetResponse = await context.env.ASSETS.fetch(context.request);
  const headers = new Headers(assetResponse.headers);

  headers.set('Content-Encoding', 'br');
  headers.set('Content-Type', getContentType(new URL(context.request.url).pathname));
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate, no-transform');

  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

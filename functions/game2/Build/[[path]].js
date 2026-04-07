function getContentType(pathname) {
  if (pathname.endsWith('.js')) {
    return 'application/javascript; charset=utf-8';
  }

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
  const pathname = new URL(context.request.url).pathname;

  if (pathname.endsWith('.br')) {
    headers.set('Content-Encoding', 'br');
  } else {
    headers.delete('Content-Encoding');
  }

  headers.set('Content-Type', getContentType(pathname));
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate, no-transform');

  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

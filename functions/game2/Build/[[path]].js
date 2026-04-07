function getContentType(pathname) {
  if (pathname.endsWith('.js')) {
    return 'application/javascript; charset=utf-8';
  }

  if (pathname.endsWith('.js.gz')) {
    return 'application/javascript; charset=utf-8';
  }

  if (pathname.endsWith('.wasm.gz')) {
    return 'application/wasm';
  }

  return 'application/octet-stream';
}

export async function onRequest(context) {
  const assetResponse = await context.env.ASSETS.fetch(context.request);
  const body = await assetResponse.arrayBuffer();
  const headers = new Headers(assetResponse.headers);
  const pathname = new URL(context.request.url).pathname;

  if (pathname.endsWith('.gz')) {
    headers.set('Content-Encoding', 'gzip');
  } else {
    headers.delete('Content-Encoding');
  }

  headers.set('Content-Type', getContentType(pathname));
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate, no-transform');
  headers.set('Content-Length', String(body.byteLength));

  return new Response(body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

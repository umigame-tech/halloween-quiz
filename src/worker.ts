/**
 * Cloudflare Worker entry point for serving static assets
 */

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // API routes
    if (pathname.startsWith('/api/')) {
      return handleApiRoutes(request, pathname);
    }

    // Serve static assets from the dist directory
    // The ASSETS binding is configured in wrangler.jsonc
    if (env.ASSETS) {
      try {
        // Map routes to their corresponding HTML files
        const htmlRoutes: Record<string, string> = {
          '/': '/index.html',
          '/quiz-list': '/quiz-list.html',
          '/quiz': '/quiz.html',
          '/result': '/result.html',
          '/explanation': '/explanation.html',
        };

        // Check if this is a mapped route
        if (htmlRoutes[pathname]) {
          const assetUrl = new URL(request.url);
          assetUrl.pathname = htmlRoutes[pathname];
          const assetRequest = new Request(assetUrl, request);
          return env.ASSETS.fetch(assetRequest);
        }

        // Try to serve the file directly (for CSS, JS, images, etc.)
        return env.ASSETS.fetch(request);
      } catch (error) {
        console.error('Error serving asset:', error);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

/**
 * Handle API routes
 */
async function handleApiRoutes(request: Request, pathname: string): Promise<Response> {
  const method = request.method;

  // /api/hello
  if (pathname === '/api/hello') {
    if (method === 'GET') {
      return Response.json({
        message: 'Hello, world!',
        method: 'GET',
      });
    }
    if (method === 'PUT') {
      return Response.json({
        message: 'Hello, world!',
        method: 'PUT',
      });
    }
  }

  // /api/hello/:name
  const helloNameMatch = pathname.match(/^\/api\/hello\/([^/]+)$/);
  if (helloNameMatch) {
    const name = helloNameMatch[1];
    return Response.json({
      message: `Hello, ${name}!`,
    });
  }

  return new Response('Not Found', { status: 404 });
}

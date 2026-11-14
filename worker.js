export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      let response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new URL('/index.html', request.url));
      }
      return response;
    } catch {
      return await env.ASSETS.fetch(new URL('/index.html', request.url));
    }
  },
};

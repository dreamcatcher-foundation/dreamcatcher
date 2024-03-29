import path from 'path';

const SERVER = Bun.serve({
  port: Bun.env.Port || 3000,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname == '/') return (() => {
      return new Response('Home');
    })();
    return new Response('404!');
  },
});
console.log(`Listening on port ${SERVER.port}`);
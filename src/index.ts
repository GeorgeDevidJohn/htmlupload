const worker = {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Redirect Worker root requests to the Next.js homepage route.
    // The homepage route "/" is rendered by src/app/page.tsx.
    if (url.pathname === "/") {
      return Response.redirect(`${url.origin}/`, 302);
    }

    return Response.redirect(`${url.origin}/`, 302);
  },
};

export default worker;

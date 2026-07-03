import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/published",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return new Response("Missing slug.", { status: 400 });
    }

    const file = await ctx.runQuery(api.htmlFiles.getPublishedFileBySlug, { slug });
    if (!file) {
      return new Response("This published link is no longer active.", {
        status: 404,
      });
    }

    return new Response(file.content, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }),
});

export default http;

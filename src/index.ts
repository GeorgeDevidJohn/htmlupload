export interface Env {
  CONVEX_DEPLOYMENT: string;
  NEXT_PUBLIC_CONVEX_URL: string;
  NEXT_PUBLIC_CONVEX_SITE_URL: string;
}

const worker = {
  async fetch(_request: Request, env: Env): Promise<Response> {
    const payload = {
      status: "ok",
      message: "htmlupload worker is running",
      convexDeployment: env.CONVEX_DEPLOYMENT,
      convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
      convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 200,
    });
  },
};

export default worker;

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /products routes
     */
    "/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+|products/).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of the request (e.g. demo.metaparlour.io, demo.localhost:3000)
  const hostname = req.headers.get("host") || "modevz.ca" || "modevz.com" || "localhost:3000";

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  /*  You have to replace ".metaparlour.io" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
        .replace(`.modevz.ca` || `.modevz.com` || `.moconsultantz.com`, "")
      : hostname.replace(`.localhost:3000`, "");


  // rewrites for app pages
  if (currentHost == "consultantz") {
    url.pathname = `/consultantz${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost == "devz") {
    url.pathname = `/devz${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost == "vestmentz" || currentHost == "hodl" || currentHost == "whitepaper" || currentHost == "token") {
    url.pathname = `/vestmentz/mocoin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (hostname === "localhost:3000" || hostname === "moconsultantz.com") {
    console.log(path)
    if (path.startsWith("/devz") || path.startsWith("/vestmentz") || path.startsWith("/consultantz")) {
      console.log(path)
      return NextResponse.rewrite(new URL(`${path}`, req.url));
    }
    else{
      return NextResponse.rewrite(new URL(`/consultantz${path}`, req.url));
    }
  }

  if (hostname === "modevz.ca" || hostname === "modevz.com") {
    return NextResponse.rewrite(new URL(`/devz${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/consultantz/${currentHost}${path}`, req.url)
  );
}

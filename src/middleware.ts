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
    "/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+|products/|icons/|qualifications/).*)",
    // Excluded above, but the Art by Jyxdi site needs its own copies of
    // these and redirects for old Shopify product links.
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt",
    "/products/:path*",
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
        .replace(`.moconsultantz.com`, "").replace(`.modevz.com`, "").replace(`.modevz.ca`, "")
      : hostname.replace(`.localhost:3000`, "");

  // Art by Jyxdi, a client storefront migrated from Shopify. Also answers on
  // jyxdi.com so the old domain can be pointed here later.
  if (currentHost === "jyxdi" || hostname === "jyxdi.com" || hostname === "www.jyxdi.com") {
    return jyxdiResponse(req, path);
  }

  // The paths added to the matcher for Jyxdi keep their normal behaviour
  // everywhere else.
  if (["/sitemap.xml", "/robots.txt", "/llms.txt"].includes(path) || path.startsWith("/products/")) {
    return NextResponse.next();
  }

  if (path.startsWith("/feed") || path.startsWith("/moos")) {
      return NextResponse.rewrite(new URL(`${path}`, req.url));
    }
  
  // rewrites for app pages
  if (currentHost == "consultantz") {
    url.pathname = `/consultantz${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost == "devz") {
    url.pathname = `/devz${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost == "vestmentz" || currentHost == "hodl" || currentHost == "whitepaper" || currentHost == "mocoin") {
    url.pathname = `/vestmentz/mocoin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost == "joxavier" || currentHost == "josh") {
    url.pathname = `/consultantz/team/joxavier/${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  else if (currentHost == "kellman") {
    url.pathname = `/consultantz/team/kellman/${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  else if (currentHost === "domin8ai") {
    url.pathname = `/moos/domin8AI${path}`;
    return NextResponse.rewrite(url);
  }

    else if (currentHost === "primaspaces") {
    url.pathname = `/devz/primaspaces${path}`;
    return NextResponse.rewrite(url);
  }

  else if (currentHost === "xavieracademy" || currentHost === "academy") {
    url.pathname = `/devz/xavieracademy${path}`;
    return NextResponse.rewrite(url);
  }

  else if (currentHost === "ank") {
    url.pathname = `/devz/ank${path}`;
    return NextResponse.rewrite(url);
  }

  if (hostname === "localhost:3000" || hostname === "moconsultantz.com") {
    console.log(path)
    if (path.startsWith("/devz") || path.startsWith("/vestmentz") || path.startsWith("/consultantz") || path.startsWith("/feed") || path.startsWith("/moos") || path.startsWith("/josh") || path.startsWith("/services") || path.startsWith("/technical-consulting") || path.startsWith("/plans") || path.startsWith("/start")) {
      console.log("cechk" + path)
      return NextResponse.rewrite(new URL(`${path}`, req.url));
    }
    if (path.startsWith("/articles")) {
      return NextResponse.rewrite(new URL(`/feed/0${path}`, req.url));
    }
    else {
      return NextResponse.rewrite(new URL(`/consultantz${path}`, req.url));
    }
  }

  if (hostname === "modevz.ca" || hostname === "modevz.com") {
    if (path.startsWith("/devz") || path.startsWith("/vestmentz") || path.startsWith("/consultantz") || path.startsWith("/feed") || path.startsWith("/moos") || path.startsWith("/services") || path.startsWith("/technical-consulting") || path.startsWith("/plans") || path.startsWith("/start")) {
      console.log(path)
      return NextResponse.rewrite(new URL(`${path}`, req.url));
    }
    if (path.startsWith("/articles")) {
      return NextResponse.rewrite(new URL(`/feed/0${path}`, req.url));
    }
    if (path.startsWith("/about") || path.startsWith("/newsletter")) {
      return NextResponse.rewrite(new URL(`/consultantz${path}`, req.url));
    }
    else {
      return NextResponse.rewrite(new URL(`/devz${path}`, req.url));
    }
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/consultantz/${currentHost}${path}`, req.url)
  );
}

// Old Shopify URLs mapped to their new pages, so existing links and search
// results keep working (permanent redirects pass ranking to the new URL).
const JYXDI_REDIRECTS: Record<string, string> = {
  "/collections/art": "/art",
  "/collections/all": "/art",
  "/collections/frontpage": "/art",
  "/collections": "/art",
  "/pages/contact": "/commissions",
  "/pages/bio": "/bio",
};

function jyxdiResponse(req: NextRequest, path: string) {
  const normalised = path.length > 1 ? path.replace(/\/+$/, "") : path;

  const redirectTo =
    JYXDI_REDIRECTS[normalised] ??
    // Product handles are kept as artwork slugs.
    (normalised.startsWith("/products/") ? `/art/${normalised.slice("/products/".length)}` : undefined);
  if (redirectTo) {
    const target = req.nextUrl.clone();
    target.pathname = redirectTo;
    target.search = "";
    return NextResponse.redirect(target, 308);
  }

  const files: Record<string, string> = {
    "/sitemap.xml": "/api/jyxdi/sitemap",
    "/robots.txt": "/api/jyxdi/robots",
    "/llms.txt": "/api/jyxdi/llms",
  };
  const target = req.nextUrl.clone();
  target.pathname = files[normalised] ?? `/jyxdi${normalised === "/" ? "" : normalised}`;
  return NextResponse.rewrite(target);
}

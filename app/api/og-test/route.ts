import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Fetch a page as each social crawler sees it, then fetch the card it points
 * at the same way.
 *
 * This has to run on the server. A browser cannot set User-Agent on fetch, and
 * cross-origin reads of someone else's site are blocked, so a client-side
 * version of this test can only ever pretend.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRAWLERS = [
  { id: "facebook", label: "Facebook", ua: "facebookexternalhit/1.1" },
  { id: "x", label: "X", ua: "Twitterbot/1.0" },
  { id: "linkedin", label: "LinkedIn", ua: "LinkedInBot/1.0" },
  { id: "slack", label: "Slack", ua: "Slackbot-LinkExpanding 1.0" },
  { id: "discord", label: "Discord", ua: "Discordbot/2.0" },
  { id: "whatsapp", label: "WhatsApp", ua: "WhatsApp/2.23" },
] as const;

const TIMEOUT_MS = 10_000;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/** Reserved v4 ranges, as [first octet, second octet range]. */
const RESERVED_V4: [number, [number, number]][] = [
  [0, [0, 255]],
  [10, [0, 255]],
  [127, [0, 255]],
  // CGNAT
  [100, [64, 127]],
  // link local, including the cloud metadata address
  [169, [254, 254]],
  [172, [16, 31]],
  [192, [168, 168]],
  // benchmarking
  [198, [18, 19]],
];

const V6_PREFIXES = ["fc", "fd", "fe80", "::ffff:"];

/** Reserved ranges. A URL box on a public site is an SSRF hole without this. */
const isPrivate = (ip: string) => {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    return (
      v === "::1" || v === "::" || V6_PREFIXES.some((p) => v.startsWith(p))
    );
  }
  const [a, b] = ip.split(".").map(Number);
  // multicast and reserved
  if (a >= 224) {
    return true;
  }
  return RESERVED_V4.some(
    ([first, [lo, hi]]) => a === first && b >= lo && b <= hi
  );
};

const assertPublic = async (raw: string) => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That is not a URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https.");
  }
  const host = url.hostname.replaceAll(/^\[|\]$/g, "");
  if (isIP(host)) {
    if (isPrivate(host)) {
      throw new Error("That address is not reachable from the internet.");
    }
    return url;
  }
  // Resolve first: a public-looking name can still point at a private address.
  const answers = await lookup(host, { all: true }).catch(() => []);
  if (answers.length === 0) {
    throw new Error("That host does not resolve.");
  }
  if (answers.some((a) => isPrivate(a.address))) {
    throw new Error("That address is not reachable from the internet.");
  }
  return url;
};

const withTimeout = async <T>(fn: (signal: AbortSignal) => Promise<T>) => {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), TIMEOUT_MS);
  try {
    return await fn(c.signal);
  } finally {
    clearTimeout(t);
  }
};

/** Read og:image and friends without pulling in a parser. */
const readMeta = (html: string) => {
  const pick = (key: string) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']|` +
        `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`,
      "i"
    );
    const m = html.match(re);
    return m ? (m[1] ?? m[2] ?? "").trim() : "";
  };
  return {
    card: pick("twitter:card"),
    description: pick("og:description") || pick("description"),
    height: pick("og:image:height"),
    image: pick("og:image") || pick("twitter:image"),
    title:
      pick("og:title") ||
      (html.match(/<title[^>]*>([^<]*)</i)?.[1] ?? "").trim(),
    width: pick("og:image:width"),
  };
};

interface Hop {
  status: number;
  url: string;
}

/** Follow redirects by hand so each hop can be reported and re-validated. */
const trace = async (target: string, ua: string, accept: string) => {
  const hops: Hop[] = [];
  let current = target;
  for (let i = 0; i < 5; i += 1) {
    const url = await assertPublic(current);
    const res = await withTimeout((signal) =>
      fetch(url, {
        headers: { Accept: accept, "User-Agent": ua },
        redirect: "manual",
        signal,
      })
    );
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get("location");
      if (!next) {
        return { hops, res, url: current };
      }
      hops.push({ status: res.status, url: current });
      current = new URL(next, current).toString();
      continue;
    }
    return { hops, res, url: current };
  }
  throw new Error("Too many redirects.");
};

export const POST = async (request: Request) => {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Send a JSON body with a url." },
      { status: 400 }
    );
  }

  const input = (body.url ?? "").trim();
  if (!input) {
    return Response.json({ error: "Enter a URL." }, { status: 400 });
  }

  const target = /^https?:\/\//i.test(input) ? input : `https://${input}`;

  try {
    await assertPublic(target);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }

  // 1. the page, as each crawler
  const pages = await Promise.all(
    CRAWLERS.map(async (c) => {
      try {
        const { res, hops, url } = await trace(target, c.ua, "text/html,*/*");
        const text = res.ok ? await res.text() : "";
        const html = text.slice(0, 400_000);
        return {
          finalUrl: url,
          id: c.id,
          label: c.label,
          meta: html ? readMeta(html) : null,
          ok: res.ok,
          redirects: hops.length,
          status: res.status,
        };
      } catch (error) {
        return {
          error: (error as Error).message,
          finalUrl: target,
          id: c.id,
          label: c.label,
          meta: null,
          ok: false,
          redirects: 0,
          status: 0,
        };
      }
    })
  );

  const found = pages.find((p) => p.meta?.image)?.meta ?? null;
  const imageUrl = found?.image ? new URL(found.image, target).toString() : "";

  // 2. the card itself, as each crawler. A page that unfurls everywhere and an
  //    image that 403s to one of them is the failure people actually hit.
  const images = imageUrl
    ? await Promise.all(
        CRAWLERS.map(async (c) => {
          try {
            const { res, hops, url } = await trace(
              imageUrl,
              c.ua,
              "image/*,*/*"
            );
            const type = res.headers.get("content-type") ?? "";
            const len = Number(res.headers.get("content-length") ?? 0);
            let bytes = len;
            if (res.ok && len === 0) {
              const buf = await res.arrayBuffer();
              bytes = Math.min(buf.byteLength, MAX_IMAGE_BYTES);
            }
            return {
              bytes,
              contentType: type,
              finalUrl: url,
              id: c.id,
              label: c.label,
              ok: res.ok && type.startsWith("image/"),
              redirects: hops.length,
              status: res.status,
            };
          } catch (error) {
            return {
              bytes: 0,
              contentType: "",
              error: (error as Error).message,
              finalUrl: imageUrl,
              id: c.id,
              label: c.label,
              ok: false,
              redirects: 0,
              status: 0,
            };
          }
        })
      )
    : [];

  return Response.json(
    { imageUrl, images, meta: found, pages, url: target },
    { headers: { "Cache-Control": "no-store" } }
  );
};

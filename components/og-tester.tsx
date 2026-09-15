"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Meta {
  card: string;
  description: string;
  height: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
  width: string;
}

interface Check {
  bytes?: number;
  contentType?: string;
  error?: string;
  id: string;
  label: string;
  ok: boolean;
  redirects: number;
  status: number;
}

interface Finding {
  detail: string;
  level: "tip" | "warn";
  title: string;
}

interface Result {
  findings: Finding[];
  imageUrl: string;
  images: Check[];
  meta: Meta | null;
  pages: (Check & { meta: Meta | null })[];
  url: string;
}

const host = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

const kb = (n: number) => (n ? `${Math.round(n / 1024)} KB` : "");

/* Each platform frames a shared link its own way. These are those frames. */

const Shell = ({
  name,
  children,
}: {
  children: React.ReactNode;
  name: string;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
      {name}
    </span>
    {children}
  </div>
);

const Shot = ({ src, className }: { className?: string; src: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    alt=""
    src={src}
    className={cn("aspect-[1200/630] w-full object-cover", className)}
  />
);

const XPreview = ({ m, src }: { m: Meta; src: string }) => (
  <Shell name="X">
    <div className="overflow-hidden rounded-2xl border">
      <Shot src={src} />
      <div className="bg-muted/40 flex flex-col gap-0.5 px-3 py-2">
        <span className="text-muted-foreground text-xs">
          {host(m.url || src)}
        </span>
        <span className="line-clamp-1 text-sm">{m.title}</span>
        <span className="text-muted-foreground line-clamp-2 text-xs">
          {m.description}
        </span>
      </div>
    </div>
    {m.card === "summary_large_image" ? null : (
      <span className="text-[11px] text-amber-600 dark:text-amber-500">
        Without <code>summary_large_image</code> X shows a small square instead.
      </span>
    )}
  </Shell>
);

const FacebookPreview = ({ m, src }: { m: Meta; src: string }) => (
  <Shell name="Facebook">
    <div className="overflow-hidden rounded-lg border">
      <Shot src={src} />
      <div className="bg-muted/60 flex flex-col gap-0.5 px-3 py-2.5">
        <span className="text-muted-foreground text-[11px] uppercase">
          {host(m.url || src)}
        </span>
        <span className="line-clamp-1 text-sm font-semibold">{m.title}</span>
        <span className="text-muted-foreground line-clamp-1 text-xs">
          {m.description}
        </span>
      </div>
    </div>
  </Shell>
);

const LinkedInPreview = ({ m, src }: { m: Meta; src: string }) => (
  <Shell name="LinkedIn">
    <div className="overflow-hidden rounded-sm border">
      <Shot src={src} />
      <div className="bg-muted/60 flex flex-col gap-1 px-3 py-2.5">
        <span className="line-clamp-2 text-sm font-semibold">{m.title}</span>
        <span className="text-muted-foreground text-[11px]">
          {host(m.url || src)}
        </span>
      </div>
    </div>
  </Shell>
);

const SlackPreview = ({ m, src }: { m: Meta; src: string }) => (
  <Shell name="Slack">
    <div className="border-l-4 border-l-neutral-400 pl-3">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs font-semibold">
          {m.siteName || host(m.url || src)}
        </span>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {m.title}
        </span>
        <span className="text-muted-foreground line-clamp-2 text-xs">
          {m.description}
        </span>
        <Shot src={src} className="mt-1 rounded-md" />
      </div>
    </div>
  </Shell>
);

const DiscordPreview = ({ m, src }: { m: Meta; src: string }) => (
  <Shell name="Discord">
    <div className="bg-muted/50 rounded-md border-l-4 border-l-indigo-500 p-3">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-[11px]">
          {m.siteName || host(m.url || src)}
        </span>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {m.title}
        </span>
        <span className="text-muted-foreground line-clamp-3 text-xs">
          {m.description}
        </span>
        <Shot src={src} className="mt-1 rounded" />
      </div>
    </div>
  </Shell>
);

const Dot = ({ ok }: { ok: boolean }) => (
  <span
    aria-hidden
    className={cn(
      "size-1.5 shrink-0 rounded-full",
      ok ? "bg-emerald-500" : "bg-red-500"
    )}
  />
);

const CheckRow = ({ c, detail }: { c: Check; detail?: string }) => (
  <div className="flex items-center gap-2 py-1 text-sm">
    <Dot ok={c.ok} />
    <span className="w-20 shrink-0">{c.label}</span>
    <span className="text-muted-foreground tabular-nums">
      {c.status || "failed"}
    </span>
    {detail ? (
      <span className="text-muted-foreground truncate">{detail}</span>
    ) : null}
    {c.redirects > 0 ? (
      <span className="text-amber-600 dark:text-amber-500">
        {c.redirects} redirect{c.redirects > 1 ? "s" : ""}
      </span>
    ) : null}
    {c.error ? (
      <span className="text-muted-foreground truncate">{c.error}</span>
    ) : null}
  </div>
);

const Findings = ({ findings }: { findings: Finding[] }) =>
  findings.length === 0 ? (
    <p className="text-sm text-emerald-600 dark:text-emerald-500">
      Nothing to fix. Every tag is set and every crawler got the image.
    </p>
  ) : (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">
        {findings.length} thing{findings.length > 1 ? "s" : ""} worth fixing
      </h2>
      <ul className="flex flex-col gap-2">
        {findings.map((f) => (
          <li
            key={f.title}
            className="flex gap-2.5 rounded-lg border p-3 text-sm"
          >
            <span
              aria-hidden
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                f.level === "warn" ? "bg-amber-500" : "bg-sky-500"
              )}
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{f.title}</span>
              <span className="text-muted-foreground">{f.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );

const Checks = ({ result }: { result: Result }) => {
  const [open, setOpen] = useState(false);
  const allOk =
    result.images.every((i) => i.ok) && result.pages.every((p) => p.ok);

  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-left text-sm transition-colors"
      >
        <Dot ok={allOk} />
        {open ? "Hide" : "Show"} what each crawler got
      </button>
      {open ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-muted-foreground mb-1 text-[11px] tracking-widest uppercase">
              The page
            </h3>
            {result.pages.map((p) => (
              <CheckRow
                key={p.id}
                c={p}
                detail={p.ok && !p.meta?.image ? "no og:image" : undefined}
              />
            ))}
          </div>
          <div>
            <h3 className="text-muted-foreground mb-1 text-[11px] tracking-widest uppercase">
              The image
            </h3>
            {result.images.map((i) => (
              <CheckRow
                key={i.id}
                c={i}
                detail={[i.contentType, kb(i.bytes ?? 0)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

const Report = ({ result }: { result: Result }) => {
  const m = result.meta;
  const src = result.imageUrl;
  if (!m || !src) {
    return (
      <p className="text-sm">
        No <code>og:image</code> on that page, so most platforms will show a
        bare link.
      </p>
    );
  }
  const bytes = result.images.find((i) => i.ok)?.bytes ?? 0;

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">How it looks when shared</h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {m.width && m.height ? `${m.width}×${m.height}` : null}
            {kb(bytes) ? ` · ${kb(bytes)}` : null}
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <XPreview m={m} src={src} />
          <FacebookPreview m={m} src={src} />
          <LinkedInPreview m={m} src={src} />
          <SlackPreview m={m} src={src} />
          <DiscordPreview m={m} src={src} />
        </div>
      </section>
      <Findings findings={result.findings} />
      <Checks result={result} />
    </>
  );
};

export const OgTester = () => {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || busy) {
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/og-test", {
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error ?? "That did not work.");
      }
    } catch {
      setError("Could not reach the scanner.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          inputMode="url"
          placeholder="yoursite.com/some-page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="URL to scan"
        />
        <Button
          type="submit"
          disabled={busy || !url.trim()}
          className="shrink-0 px-5"
          sound="click"
        >
          {busy ? "Scanning…" : "Scan"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {result ? <Report result={result} /> : null}
    </div>
  );
};

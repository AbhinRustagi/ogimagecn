"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PageResult {
  id: string;
  label: string;
  ok: boolean;
  status: number;
  redirects: number;
  meta: {
    image: string;
    title: string;
    description: string;
    card: string;
  } | null;
  error?: string;
}

interface ImageResult {
  id: string;
  label: string;
  ok: boolean;
  status: number;
  redirects: number;
  contentType: string;
  bytes: number;
  error?: string;
}

interface Result {
  url: string;
  imageUrl: string;
  meta: {
    title: string;
    description: string;
    card: string;
    width: string;
    height: string;
  } | null;
  pages: PageResult[];
  images: ImageResult[];
}

const kb = (n: number) => (n ? `${Math.round(n / 1024)} KB` : "");

const Dot = ({ ok }: { ok: boolean }) => (
  <span
    aria-hidden
    className={cn(
      "size-1.5 shrink-0 rounded-full",
      ok ? "bg-emerald-500" : "bg-red-500"
    )}
  />
);

const Row = ({
  label,
  ok,
  status,
  redirects,
  detail,
  error,
}: {
  label: string;
  ok: boolean;
  status: number;
  redirects: number;
  detail?: string;
  error?: string;
}) => (
  <div className="flex items-center gap-2 py-1 text-sm">
    <Dot ok={ok} />
    <span className="w-20 shrink-0">{label}</span>
    <span className="text-muted-foreground tabular-nums">
      {status || "failed"}
    </span>
    {detail ? (
      <span className="text-muted-foreground truncate">{detail}</span>
    ) : null}
    {redirects > 0 ? (
      <span className="text-amber-600 dark:text-amber-500">
        {redirects} redirect{redirects > 1 ? "s" : ""}
      </span>
    ) : null}
    {error ? (
      <span className="text-muted-foreground truncate">{error}</span>
    ) : null}
  </div>
);

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
      setError("Could not reach the tester.");
    } finally {
      setBusy(false);
    }
  };

  const anyRedirect =
    result?.images.some((i) => i.redirects > 0) ||
    result?.pages.some((p) => p.redirects > 0);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          inputMode="url"
          placeholder="yoursite.com/some-page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="URL to test"
        />
        <Button
          type="submit"
          disabled={busy || !url.trim()}
          className="shrink-0 px-4"
        >
          {busy ? "Testing…" : "Test"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {result ? (
        <div className="flex flex-col gap-6">
          {result.imageUrl ? (
            <figure className="flex flex-col gap-2">
              <div className="bg-muted overflow-hidden rounded-lg border">
                {/* the card as it actually is, not a mock of it */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt="The card this page points at"
                  className="w-full"
                  width={1200}
                  height={630}
                />
              </div>
              <figcaption className="text-muted-foreground truncate text-xs">
                {result.meta?.title ? (
                  <span className="text-foreground">{result.meta.title}</span>
                ) : null}{" "}
                {result.meta?.card ? `· ${result.meta.card}` : null}{" "}
                {result.meta?.width && result.meta?.height
                  ? `· ${result.meta.width}x${result.meta.height}`
                  : null}
              </figcaption>
            </figure>
          ) : (
            <p className="text-sm">
              No <code>og:image</code> found on that page.
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="mb-1 text-xs font-medium tracking-widest uppercase">
                The page
              </h3>
              {result.pages.map((p) => (
                <Row
                  key={p.id}
                  label={p.label}
                  ok={p.ok && Boolean(p.meta?.image)}
                  status={p.status}
                  redirects={p.redirects}
                  detail={p.ok && !p.meta?.image ? "no og:image" : undefined}
                  error={p.error}
                />
              ))}
            </section>

            <section>
              <h3 className="mb-1 text-xs font-medium tracking-widest uppercase">
                The image
              </h3>
              {result.images.length === 0 ? (
                <p className="text-muted-foreground py-1 text-sm">
                  Nothing to fetch.
                </p>
              ) : (
                result.images.map((i) => (
                  <Row
                    key={i.id}
                    label={i.label}
                    ok={i.ok}
                    status={i.status}
                    redirects={i.redirects}
                    detail={[i.contentType, kb(i.bytes)]
                      .filter(Boolean)
                      .join(" · ")}
                    error={i.error}
                  />
                ))
              )}
            </section>
          </div>

          {anyRedirect ? (
            <p className="text-muted-foreground text-xs">
              A redirect on the image is the usual reason a card works in one
              place and not another. Point <code>metadataBase</code> at the host
              you actually serve from.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

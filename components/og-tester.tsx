"use client";

import {
  ChevronDownIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import {
  BlueskyIcon,
  DiscordIcon,
  FacebookIcon,
  GoogleIcon,
  LinkedInIcon,
  NotionIcon,
  PinterestIcon,
  RedditIcon,
  SlackIcon,
  TeamsIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { BlueskyPreview } from "@/components/scan/bluesky-preview";
import { DiscordPreview } from "@/components/scan/discord-preview";
import { FacebookPreview } from "@/components/scan/facebook-preview";
import { GooglePreview } from "@/components/scan/google-preview";
import { LinkedInPreview } from "@/components/scan/linkedin-preview";
import { NotionPreview } from "@/components/scan/notion-preview";
import { PinterestPreview } from "@/components/scan/pinterest-preview";
import { RedditPreview } from "@/components/scan/reddit-preview";
import { SlackPreview } from "@/components/scan/slack-preview";
import { TeamsPreview } from "@/components/scan/teams-preview";
import { TelegramPreview } from "@/components/scan/telegram-preview";
import { WhatsAppPreview } from "@/components/scan/whatsapp-preview";
import { XPreview } from "@/components/scan/x-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

const kb = (n: number) => (n ? `${Math.round(n / 1024)} KB` : "");

/* 2xx reads as fine, 3xx as a detour, everything else as broken. */
const statusTone = (status: number) => {
  if (status >= 200 && status < 300) {
    return "text-emerald-600 dark:text-emerald-500";
  }
  if (status >= 300 && status < 400) {
    return "text-amber-600 dark:text-amber-500";
  }
  return "text-red-600 dark:text-red-500";
};

/* The label strip above each platform's own framing of the link. */
const Shell = ({
  name,
  icon,
  children,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  name: string;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
      {icon}
      {name}
    </span>
    {children}
  </div>
);

const Findings = ({ findings }: { findings: Finding[] }) =>
  findings.length === 0 ? (
    <Alert>
      <CircleCheckIcon />
      <AlertTitle>All good</AlertTitle>
      <AlertDescription>
        Nothing to fix. Every tag is set and every crawler got the image.
      </AlertDescription>
    </Alert>
  ) : (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">
        {findings.length} thing{findings.length > 1 ? "s" : ""} worth fixing
      </h2>
      <ul className="flex flex-col gap-2">
        {findings.map((f) => (
          <li key={f.title}>
            <Alert variant="warning">
              <TriangleAlertIcon />
              <AlertTitle>{f.title}</AlertTitle>
              <AlertDescription>{f.detail}</AlertDescription>
            </Alert>
          </li>
        ))}
      </ul>
    </section>
  );

const Checks = ({ result }: { result: Result }) => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between gap-2 text-left text-sm transition-colors"
      >
        <span>What each crawler got</span>
        <ChevronDownIcon className="size-4 shrink-0 transition-transform data-[state=open]:rotate-180" />
      </button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="flex flex-col pt-2">
        {result.images.map((img) => {
          const detail = [img.contentType, kb(img.bytes ?? 0)]
            .filter(Boolean)
            .join(" · ");
          return (
            <div
              key={img.id}
              className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0"
            >
              <span className="shrink-0">{img.label}</span>
              <div className="text-muted-foreground flex min-w-0 items-center gap-0.5">
                <span
                  className={cn("text-xs tabular-nums", statusTone(img.status))}
                >
                  {img.status || "failed"}
                </span>
                {detail ? (
                  <span className="truncate text-xs">· {detail}</span>
                ) : null}
                {img.redirects > 0 ? (
                  <span className="text-xs text-amber-600 dark:text-amber-500">
                    · {img.redirects} redirect{img.redirects > 1 ? "s" : ""}
                  </span>
                ) : null}
                {img.error ? (
                  <span className="truncate text-xs">· {img.error}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

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

  return (
    <div className="grid gap-10 md:grid-cols-6">
      <div className="flex flex-col gap-6 md:col-span-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-medium">OG Image</h2>
            <span className="text-muted-foreground text-xs tabular-nums">
              {m.width && m.height ? `${m.width}×${m.height}` : null}
            </span>
          </div>
          {/* oxlint-disable-next-line nextjs/no-img-element */}
          <img
            alt=""
            src={src}
            className="aspect-1200/630 w-full object-cover rounded-lg"
          />
        </div>
        <Findings findings={result.findings} />
        <Checks result={result} />
      </div>
      <div className="flex flex-col gap-6 md:col-span-4">
        <h2 className="text-sm font-medium">Preview</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Shell name="X/Twitter" icon={<XIcon />}>
            <XPreview
              card={m.card}
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Facebook" icon={<FacebookIcon />}>
            <FacebookPreview
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="LinkedIn" icon={<LinkedInIcon />}>
            <LinkedInPreview image={src} title={m.title} url={m.url} />
          </Shell>
          <Shell name="Slack" icon={<SlackIcon />}>
            <SlackPreview
              description={m.description}
              image={src}
              siteName={m.siteName}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Discord" icon={<DiscordIcon />}>
            <DiscordPreview
              description={m.description}
              image={src}
              siteName={m.siteName}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Microsoft Teams" icon={<TeamsIcon />}>
            <TeamsPreview
              description={m.description}
              image={src}
              siteName={m.siteName}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="WhatsApp" icon={<WhatsAppIcon />}>
            <WhatsAppPreview
              description={m.description}
              image={src}
              title={m.title}
            />
          </Shell>
          <Shell name="Telegram" icon={<TelegramIcon />}>
            <TelegramPreview
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Pinterest" icon={<PinterestIcon />}>
            <PinterestPreview
              description={m.description}
              image={src}
              title={m.title}
            />
          </Shell>
          <Shell name="Reddit" icon={<RedditIcon />}>
            <RedditPreview
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Bluesky" icon={<BlueskyIcon />}>
            <BlueskyPreview
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Notion" icon={<NotionIcon />}>
            <NotionPreview
              description={m.description}
              image={src}
              title={m.title}
              url={m.url}
            />
          </Shell>
          <Shell name="Google" icon={<GoogleIcon />}>
            <GooglePreview
              description={m.description}
              siteName={m.siteName}
              title={m.title}
              url={m.url}
            />
          </Shell>
        </div>
      </div>
    </div>
  );
};

const urlSchema = z.url("Enter a valid URL");

export const OgTester = () => {
  const [url, setUrl] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const run = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFieldError("");
    setError("");

    const parsed = urlSchema.safeParse(url);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0].message);
      return;
    }

    if (busy) {
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/og-test", {
        body: JSON.stringify({ url: parsed.data }),
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
      <form
        onSubmit={run}
        noValidate
        className="flex flex-col justify-center gap-2 sm:flex-row"
      >
        <div className="flex flex-col gap-1.5 max-w-lg flex-1">
          <Input
            type="text"
            inputMode="url"
            placeholder="yoursite.com/some-page"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (fieldError) {
                setFieldError("");
              }
            }}
            aria-label="URL to scan"
            aria-invalid={!!fieldError}
            className={cn(
              "flex-1",
              fieldError && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {fieldError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError}
            </p>
          ) : null}
        </div>
        <Button
          type="submit"
          disabled={busy}
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

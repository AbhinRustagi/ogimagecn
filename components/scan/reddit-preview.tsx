import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface RedditPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* Reddit renders a shared link as a post tile: image on top, a single hard-
   truncated title line, then the domain as a small muted label. */
export const RedditPreview = ({
  className,
  description,
  image,
  title,
  url,
}: RedditPreviewProps) => (
  <div className={cn("bg-card overflow-hidden rounded-lg border", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
    <div className="flex flex-col gap-0.5 px-3 py-2.5">
      <span className="line-clamp-1 text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground line-clamp-1 text-xs">
        {description}
      </span>
      <span className="text-muted-foreground text-[11px]">
        {host(url || image)}
      </span>
    </div>
  </div>
);

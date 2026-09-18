import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface SlackPreviewProps {
  className?: string;
  description?: string;
  image: string;
  siteName?: string;
  title?: string;
  url?: string;
}

/* Slack hangs the unfurl off a grey rule, picture last. */
export const SlackPreview = ({
  className,
  description,
  image,
  siteName,
  title,
  url,
}: SlackPreviewProps) => (
  <div className={cn("border-l-4 border-l-neutral-400 pl-3", className)}>
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-semibold">
        {siteName || host(url || image)}
      </span>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {title}
      </span>
      <span className="text-muted-foreground line-clamp-2 text-xs">
        {description}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={image}
        className="aspect-1200/630 w-full object-cover mt-1 rounded-md"
      />
    </div>
  </div>
);

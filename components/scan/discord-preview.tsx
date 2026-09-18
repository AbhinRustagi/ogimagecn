import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface DiscordPreviewProps {
  className?: string;
  description?: string;
  image: string;
  siteName?: string;
  title?: string;
  url?: string;
}

/* Discord tints the embed and keeps three lines of description. */
export const DiscordPreview = ({
  className,
  description,
  image,
  siteName,
  title,
  url,
}: DiscordPreviewProps) => (
  <div
    className={cn(
      "bg-muted/50 rounded-md border-l-4 border-l-indigo-500 p-3",
      className
    )}
  >
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-[11px]">
        {siteName || host(url || image)}
      </span>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {title}
      </span>
      <span className="text-muted-foreground line-clamp-3 text-xs">
        {description}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={image}
        className="aspect-1200/630 w-full object-cover mt-1 rounded"
      />
    </div>
  </div>
);

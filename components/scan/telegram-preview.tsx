import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface TelegramPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* Telegram reads picture, title, description, then the domain last. */
export const TelegramPreview = ({
  className,
  description,
  image,
  title,
  url,
}: TelegramPreviewProps) => (
  <div className={cn("rounded-lg border p-3", className)}>
    <div className="flex flex-col gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={image}
        className="aspect-1200/630 w-full object-cover rounded-md"
      />
      <span className="mt-1 text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground line-clamp-2 text-xs">
        {description}
      </span>
      <span className="text-muted-foreground text-[11px]">
        {host(url || image)}
      </span>
    </div>
  </div>
);

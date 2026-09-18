import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface FacebookPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* Facebook shouts the domain in caps above a bold title. */
export const FacebookPreview = ({
  className,
  description,
  image,
  title,
  url,
}: FacebookPreviewProps) => (
  <div className={cn("overflow-hidden rounded-lg border", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
    <div className="bg-muted/60 flex flex-col gap-0.5 px-3 py-2.5">
      <span className="text-muted-foreground text-[11px] uppercase">
        {host(url || image)}
      </span>
      <span className="line-clamp-1 text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground line-clamp-1 text-xs">
        {description}
      </span>
    </div>
  </div>
);

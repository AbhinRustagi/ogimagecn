import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface XPreviewProps {
  className?: string;
  card?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* X stacks the picture above a muted caption block, corners heavily rounded. */
export const XPreview = ({
  card,
  className,
  description,
  image,
  title,
  url,
}: XPreviewProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="overflow-hidden rounded-2xl border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
      <div className="bg-muted/40 flex flex-col gap-0.5 px-3 py-2">
        <span className="text-muted-foreground text-xs">
          {host(url || image)}
        </span>
        <span className="line-clamp-1 text-sm">{title}</span>
        <span className="text-muted-foreground line-clamp-2 text-xs">
          {description}
        </span>
      </div>
    </div>
    {card === "summary_large_image" ? null : (
      <span className="text-[11px] text-amber-600 dark:text-amber-500">
        Without <code>summary_large_image</code> X shows a small square instead.
      </span>
    )}
  </div>
);

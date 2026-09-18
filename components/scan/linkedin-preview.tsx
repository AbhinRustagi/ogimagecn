import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface LinkedInPreviewProps {
  className?: string;
  image: string;
  title?: string;
  url?: string;
}

/* LinkedIn drops the description entirely and leads with the title. */
export const LinkedInPreview = ({
  className,
  image,
  title,
  url,
}: LinkedInPreviewProps) => (
  <div className={cn("overflow-hidden rounded-sm border", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
    <div className="bg-muted/60 flex flex-col gap-1 px-3 py-2.5">
      <span className="line-clamp-2 text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground text-[11px]">
        {host(url || image)}
      </span>
    </div>
  </div>
);

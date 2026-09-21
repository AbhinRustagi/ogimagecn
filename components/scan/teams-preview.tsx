import { cn } from "@/lib/utils";

/* Crawlers show the bare hostname, never the full URL. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface TeamsPreviewProps {
  className?: string;
  description?: string;
  image: string;
  siteName?: string;
  title?: string;
  url?: string;
}

/* Teams attaches a bordered card under the message: site name, bold title,
   description, then the image. No accent left-rule like Slack and Discord. */
export const TeamsPreview = ({
  className,
  description,
  image,
  siteName,
  title,
  url,
}: TeamsPreviewProps) => (
  <div className={cn("bg-card overflow-hidden rounded-lg border", className)}>
    <div className="flex flex-col gap-1 px-3 py-2.5">
      <span className="text-muted-foreground text-[11px]">
        {siteName || host(url || image)}
      </span>
      <span className="line-clamp-2 text-sm font-semibold">{title}</span>
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

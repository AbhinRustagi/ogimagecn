import { cn } from "@/lib/utils";

/* Notion prints the full URL, so the bare hostname is only a fallback. */
const host = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

export interface NotionPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* Notion turns a pasted link into a fixed-height bookmark: the picture cropped
   into a box on the left, title and description on the right, and the link
   exactly as pasted (not og:url) muted at the foot. */
export const NotionPreview = ({
  className,
  description,
  image,
  title,
  url,
}: NotionPreviewProps) => (
  <div
    className={cn("flex h-32 overflow-hidden rounded-[10px] border", className)}
  >
    <div className="relative flex-[1_1_100px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={image}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
    <div className="flex min-w-0 flex-[4_1_180px] flex-col justify-between gap-3 px-5 pt-4 pb-3">
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-medium">
          {title || host(url || image)}
        </span>
        {description ? (
          <span className="line-clamp-2 text-xs">{description}</span>
        ) : null}
      </div>
      <span className="text-muted-foreground truncate text-xs">
        {url || host(image)}
      </span>
    </div>
  </div>
);

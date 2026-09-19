import { cn } from "@/lib/utils";

/* Bluesky shows the host of the shared link as is, www included. */
const host = (value: string) => {
  try {
    return new URL(value).host;
  } catch {
    return value;
  }
};

export interface BlueskyPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
  url?: string;
}

/* Bluesky puts the picture on top, then a bold title (the link itself when
   there is none) and the description in the same color, with the domain muted
   below a thin rule. */
export const BlueskyPreview = ({
  className,
  description,
  image,
  title,
  url,
}: BlueskyPreviewProps) => (
  <div className={cn("overflow-hidden rounded-[12px] border", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
    <div className="flex flex-col gap-0.5 border-t px-3 pt-2 pb-1">
      <span className="line-clamp-3 text-sm font-semibold wrap-anywhere">
        {title || url}
      </span>
      {description ? (
        <span className="line-clamp-2 text-xs">{description}</span>
      ) : null}
    </div>
    <div className="text-muted-foreground mx-3 flex items-center gap-0.5 border-t pt-1.5 pb-2">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 shrink-0">
        <path
          fill="currentColor"
          d="M4.4 9.493C4.14 10.28 4 11.124 4 12a8 8 0 1 0 10.899-7.459l-.953 3.81a1 1 0 0 1-.726.727l-3.444.866-.772 1.533a1 1 0 0 1-1.493.35L4.4 9.493Zm.883-1.84L7.756 9.51l.44-.874a1 1 0 0 1 .649-.52l3.306-.832.807-3.227a7.993 7.993 0 0 0-7.676 3.597ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.43.162a1 1 0 0 1 .77-.29l1.89.121a1 1 0 0 1 .494.168l2.869 1.928a1 1 0 0 1 .336 1.277l-.973 1.946a1 1 0 0 1-.894.553h-2.92a1 1 0 0 1-.831-.445L9.225 14.5a1 1 0 0 1 .126-1.262l1.08-1.076Zm.915 1.913.177-.177 1.171.074 1.914 1.286-.303.607h-1.766l-1.194-1.79Z"
        />
      </svg>
      <span className="truncate text-[11px]">{host(url || image)}</span>
    </div>
  </div>
);

import { cn } from "@/lib/utils";

export interface PinterestPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
}

/* Pinterest shows no domain at all, just the pin and its caption. */
export const PinterestPreview = ({
  className,
  description,
  image,
  title,
}: PinterestPreviewProps) => (
  <div className={cn("overflow-hidden rounded-lg border", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" src={image} className="aspect-1200/630 w-full object-cover" />
    <div className="flex flex-col gap-1 px-3 py-2">
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground line-clamp-2 text-xs">
        {description}
      </span>
    </div>
  </div>
);

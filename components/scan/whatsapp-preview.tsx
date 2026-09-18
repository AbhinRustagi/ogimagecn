import { cn } from "@/lib/utils";

export interface WhatsAppPreviewProps {
  className?: string;
  description?: string;
  image: string;
  title?: string;
}

/* WhatsApp puts the card in a green chat bubble and drops the domain. */
export const WhatsAppPreview = ({
  className,
  description,
  image,
  title,
}: WhatsAppPreviewProps) => (
  <div
    className={cn(
      "rounded-lg border bg-emerald-50 p-3 dark:bg-emerald-950/30",
      className
    )}
  >
    <div className="flex flex-col gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={image}
        className="aspect-1200/630 w-full object-cover rounded"
      />
      <span className="mt-1 text-sm font-semibold">{title}</span>
      <span className="text-muted-foreground line-clamp-2 text-xs">
        {description}
      </span>
    </div>
  </div>
);

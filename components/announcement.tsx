import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

export const Announcement = () => (
  <Badge asChild variant="secondary">
    <Link href={ROUTES.SCAN}>
      Scan any URL for its link preview <ArrowRightIcon />
    </Link>
  </Badge>
);

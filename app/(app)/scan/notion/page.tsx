import type { Metadata } from "next";
import Link from "next/link";

import { OgTester } from "@/components/og-tester";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Preview how your Open Graph image, title, and description appear in a Notion bookmark. Scan a URL and compare its previews across platforms.",
  path: ROUTES.SCAN_NOTION,
  title: "Notion Open Graph Preview",
});

const NotionScanPage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex flex-col gap-4 py-16 md:py-20 lg:py-24">
        <PageHero
          description="Paste a URL to preview its Notion bookmark, including the image, title, description, and link. Compare it with other platforms and find Open Graph issues before sharing."
          title="Notion Open Graph Preview"
        />

        <Link
          className="text-muted-foreground hover:text-foreground self-center text-sm underline underline-offset-4"
          href={ROUTES.SCAN}
        >
          Back to the Open Graph scanner
        </Link>

        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default NotionScanPage;

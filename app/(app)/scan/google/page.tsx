import type { Metadata } from "next";
import Link from "next/link";

import { OgTester } from "@/components/og-tester";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Paste a URL and see the search result Google builds from it: the title tag, the meta description and the breadcrumb URL, next to the card every other platform shows.",
  path: ROUTES.SCAN_GOOGLE,
  title: "Google Search Result Preview",
});

const ScanGooglePage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex flex-col gap-4 py-16 md:py-20 lg:py-24">
        <PageHero
          description="Google writes a result from the title tag and meta description, not the Open Graph pair, and trims both to fit. Paste a URL to see where it cuts, then check the same page against every other platform."
          title="Google Search Result Preview"
        />

        <p className="text-muted-foreground mx-auto text-sm">
          Checking another platform?{" "}
          <Link className="underline underline-offset-4" href={ROUTES.SCAN}>
            Scan every preview at once
          </Link>
          .
        </p>

        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default ScanGooglePage;

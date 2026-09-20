import type { Metadata } from "next";
import Link from "next/link";

import { OgTester } from "@/components/og-tester";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Paste a URL and see how its Reddit post tile renders — image, title, and domain — plus anything worth fixing.",
  path: ROUTES.SCAN_REDDIT,
  title: "Reddit Open Graph Preview",
});

const ScanRedditPage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex flex-col gap-4 py-16 md:py-20 lg:py-24">
        <PageHero
          description={
            <>
              Paste a URL and see the post tile the way Reddit will show it
              in the feed, plus anything worth fixing. Every check is a real
              fetch made as that crawler.{" "}
              <Link
                href={ROUTES.SCAN}
                className="underline underline-offset-4"
              >
                Back to all platforms
              </Link>
              .
            </>
          }
          title="Reddit"
        />

        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default ScanRedditPage;

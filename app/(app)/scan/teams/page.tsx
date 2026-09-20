import type { Metadata } from "next";
import Link from "next/link";

import { OgTester } from "@/components/og-tester";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Paste a URL and see how it unfurls in Microsoft Teams — site name, title, description, and image — plus anything worth fixing.",
  path: ROUTES.SCAN_TEAMS,
  title: "Microsoft Teams Link Preview Checker",
});

const ScanTeamsPage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex flex-col gap-4 py-16 md:py-20 lg:py-24">
        <PageHero
          description={
            <>
              Paste a URL and see the card the way Microsoft Teams will show
              it under the message, plus anything worth fixing. Every check is
              a real fetch made as that crawler.{" "}
              <Link
                href={ROUTES.SCAN}
                className="underline underline-offset-4"
              >
                Back to all platforms
              </Link>
              .
            </>
          }
          title="Microsoft Teams"
        />

        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default ScanTeamsPage;

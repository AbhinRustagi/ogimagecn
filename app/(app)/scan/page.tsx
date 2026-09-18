import type { Metadata } from "next";

import { OgTester } from "@/components/og-tester";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Paste a URL and see how Facebook, X, LinkedIn, Slack, Discord and WhatsApp each fetch its Open Graph card, plus the card itself.",
  path: ROUTES.SCAN,
  title: "Scan",
});

const ScanPage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex flex-col gap-4 py-16 md:py-20 lg:py-24">
        <PageHero
          description="Paste a URL and see the card the way each platform will show it, plus anything worth fixing. Every check is a real fetch made as that crawler, not a guess and not a cached third party result."
          title="Scan"
        />

        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default ScanPage;

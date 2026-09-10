import type { Metadata } from "next";

import { OgTester } from "@/components/og-tester";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Paste a URL and see how Facebook, X, LinkedIn, Slack, Discord and WhatsApp each fetch its Open Graph card, plus the card itself.",
  path: ROUTES.TEST,
  title: "Test yours",
});

const TestPage = () => (
  <PageTransition>
    <section className="container-wrapper relative">
      <div className="container flex max-w-3xl flex-col gap-4 py-16 md:py-20">
        <h1 className="from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Test yours
        </h1>
        <p className="text-muted-foreground text-balance">
          Paste any URL. Each crawler fetches the page for real, then fetches
          the card it points at, and the card is shown as it actually renders.
          No mock, no cached third party debugger.
        </p>
        <div className="mt-4">
          <OgTester />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default TestPage;

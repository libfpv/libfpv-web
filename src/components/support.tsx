import { Bomb, Check, Clock, ListOrdered, Sparkles, Coffee } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslations } from "next-intl";

import { links } from "@/config";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { PatreonIcon } from "@/components/icons";
import { tags } from "@/lib/rich";

// The perks, as listed in libfpv's overlay Kamikaze tab (LIBFPV_KAMIKAZE_PROMOTE).
// The Kamikaze perk is a prebuilt LIBFPV_KAMIKAZE=ON build, not locked code: anyone can compile it.
// Text: support.perks.<id> in dicts/<locale>.json.
const perks = [
  { id: "kamikaze", icon: Bomb, note: true },
  { id: "early", icon: Clock },
  { id: "queue", icon: ListOrdered },
  { id: "more", icon: Sparkles },
];

export default function Support() {
  const t = useTranslations("support");
  const checks = t.raw("checks") as string[];

  return (
    <section id="support" className="relative scroll-mt-16 overflow-hidden py-24 lg:py-32">
      <div className="glow-blob left-1/2 top-24 h-[36rem] w-[60rem] -translate-x-1/2 opacity-70" />
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", tags)}
          description={t.rich("description", tags)}
        />

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Patreon */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-patreon/30 bg-card p-8 shadow-[0_2rem_6rem_-2rem_rgba(255,66,77,0.35)] sm:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-patreon/20 blur-3xl" />
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-patreon text-white">
                  <PatreonIcon className="size-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t("monthly")}</div>
                  <h3 className="text-2xl font-extrabold tracking-tight">{t("patron")}</h3>
                </div>
                <span className="ml-auto hidden rounded-full bg-patreon/15 px-3 py-1 text-xs font-semibold text-patreon sm:inline">
                  {t("impact")}
                </span>
              </div>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {perks.map((p) => (
                  <li key={p.id} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background">
                      <p.icon className="size-5 text-patreon" />
                    </div>
                    <div>
                      <div className="font-semibold leading-6">{t.rich(`perks.${p.id}.title`, tags)}</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.rich(`perks.${p.id}.body`, tags)}</p>
                      {p.note && <p className="mt-1 text-xs italic text-muted-foreground/80">{t.rich(`perks.${p.id}.note`, tags)}</p>}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col items-start gap-6 border-t pt-8 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Button asChild size="lg" variant="patreon" className="w-full sm:w-auto">
                    <a href={links.patreon} target="_blank" rel="noreferrer">
                      <PatreonIcon />
                      {t("subscribe")}
                    </a>
                  </Button>
                  <p className="mt-3 hidden text-sm text-muted-foreground sm:block">
                    {t.rich("scan", tags)}
                  </p>
                </div>
                <div className="hidden rounded-xl bg-white p-2.5 shadow-md sm:block">
                  <QRCodeSVG value={links.patreon} size={104} level="M" marginSize={0} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* one-off */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-[2rem] border bg-card p-8 shadow-lg sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-coffee text-coffee-foreground">
                  <Coffee className="size-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t("oneTime")}</div>
                  <h3 className="text-2xl font-extrabold tracking-tight">{t("props")}</h3>
                </div>
              </div>

              <p className="mt-6 leading-7 text-muted-foreground">
                {t.rich("oneTimeBody", tags)}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {checks.map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="size-4 text-coffee-ink" />
                    {t.rich(`checks.${i}`, tags)}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <Button asChild size="lg" variant="coffee" className="w-full">
                  <a href={links.buyMeACoffee} target="_blank" rel="noreferrer">
                    <Coffee />
                    {t("coffee")}
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          {t.rich("footnote", tags)}
        </Reveal>
      </div>
    </section>
  );
}

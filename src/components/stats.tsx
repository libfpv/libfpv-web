import { useTranslations } from "next-intl";

import Reveal from "@/components/reveal";
import { games } from "@/data/games";

export default function Stats() {
  const t = useTranslations("stats");
  const stats = [
    { value: "100%", label: t("openSource") },
    { value: "BF 2025.12", label: t("betaflight") },
    { value: "1 kHz", label: t("loop") },
    { value: String(games.length), label: t("games", { count: games.length }) },
  ];

  return (
    <section className="relative border-y bg-card/40">
      <div className="container grid grid-cols-2 divide-border py-10 md:grid-cols-4 md:divide-x">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="px-4 py-3 text-center">
            <div className="font-osd text-4xl uppercase tracking-wide lg:text-5xl">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import Reveal from "@/components/reveal";
import { games } from "@/data/games";

const stats = [
  { value: "100%", label: "open source & free" },
  { value: "BF 2025.12", label: "real Betaflight firmware" },
  { value: "1 kHz", label: "simulation loop" },
  { value: String(games.length), label: "games and counting" },
];

export default function Stats() {
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

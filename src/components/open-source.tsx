import { ArrowUpRight, GitFork, Heart, Scale, Code2 } from "lucide-react";

import { links } from "@/config";
import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import StarCount from "@/components/star-count";

const points = [
  {
    icon: Heart,
    title: "libfpv stays free",
    body: "The simulator itself is 100% open source and free, and it will stay that way. No paywall, no locked features.",
  },
  {
    icon: Code2,
    title: "Every line on GitHub",
    body: "The library and its patches to Betaflight and SimITL are public. So are all of today's game mods.",
  },
  {
    icon: Scale,
    title: "GPL-3.0, with MIT parts",
    body: "The library is GPL-3.0-or-later. The C API header, client code, renderers and examples are also MIT, so an integration can use any license, open or closed.",
  },
  {
    icon: GitFork,
    title: "Open to every integration",
    body: "A plain C API, documented inline, loads from any engine or mod loader. Bring a drone to your favourite game, and share it however you like.",
  },
];

export default function OpenSource({ stars }: { stars: number | null }) {
  return (
    <section id="open-source" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border bg-card p-8 shadow-xl sm:p-12 lg:p-16">
            <div className="glow-blob -left-20 -top-20 h-80 w-80 opacity-80" />
            <div className="glow-blob -bottom-24 right-0 h-96 w-96 opacity-60" />

            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="font-osd text-xl uppercase tracking-[0.2em] text-bf">Open source</p>
                <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Made in the open, for the modding community.
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  libfpv is 100% open source and free. FPV pilots get to fly through the worlds they grew up
                  with, and modders get a ready drone instead of writing a flight model from scratch. Read
                  the code, file an issue, send a pull request, or build a mod of your own.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a href={links.github} target="_blank" rel="noreferrer">
                      <GithubIcon className="size-5" />
                      hammerill/libfpv
                      <StarCount stars={stars} className="bg-primary-foreground/15" />
                      <ArrowUpRight />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={`${links.github}/issues`} target="_blank" rel="noreferrer">
                      Report an issue
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {points.map((p, i) => (
                  <Reveal key={p.title} delay={i * 80}>
                    <div className="h-full rounded-2xl border bg-background/60 p-5 backdrop-blur">
                      <p.icon className="size-5 text-bf" />
                      <h3 className="mt-3 font-bold">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{p.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

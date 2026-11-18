import { ArrowUpRight, BookOpen, GitFork, Heart, Scale, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { links } from "@/config";
import Reveal from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import StarCount from "@/components/star-count";
import { tags } from "@/lib/rich";

// Text: openSource.points.<id> in dicts/<locale>.json.
const points = [
  { id: "free", icon: Heart },
  { id: "github", icon: Code2 },
  { id: "license", icon: Scale },
  { id: "integration", icon: GitFork },
];

export default function OpenSource({ stars }: { stars: number | null }) {
  const t = useTranslations("openSource");
  return (
    <section id="open-source" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border bg-card p-8 shadow-xl sm:p-12 lg:p-16">
            <div className="glow-blob -left-20 -top-20 h-80 w-80 opacity-80" />
            <div className="glow-blob -bottom-24 right-0 h-96 w-96 opacity-60" />

            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="font-osd text-xl uppercase tracking-[0.2em] text-bf">{t("eyebrow")}</p>
                <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {t.rich("title", tags)}
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  {t.rich("body", tags)}
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
                      {t("issue")}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="ghost">
                    <a href={links.blog} target="_blank" rel="noreferrer">
                      <BookOpen />
                      {t("blog")}
                      <ArrowUpRight />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {points.map((p, i) => (
                  <Reveal key={p.id} delay={i * 80}>
                    <div className="h-full rounded-2xl border bg-background/60 p-5 backdrop-blur">
                      <p.icon className="size-5 text-bf" />
                      <h3 className="mt-3 font-bold">{t.rich(`points.${p.id}.title`, tags)}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t.rich(`points.${p.id}.body`, tags)}</p>
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

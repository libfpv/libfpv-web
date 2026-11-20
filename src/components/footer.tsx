import Image from "next/image";
import { useTranslations } from "next-intl";

import { links } from "@/config";
import { games } from "@/data/games";
import { Link } from "@/navigation";
import { GithubIcon, InstagramIcon, PatreonIcon, TiktokIcon, YoutubeIcon } from "@/components/icons";
import { tags } from "@/lib/rich";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t bg-card/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Image
            src="/libfpv-logo.svg"
            alt="libfpv"
            width={198}
            height={30}
            className="h-auto w-[198px] [image-rendering:pixelated] dark:drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.25)]"
          />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            {t.rich("about", tags)}
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { href: links.github, label: "GitHub", Icon: GithubIcon },
              { href: links.patreon, label: "Patreon", Icon: PatreonIcon },
              { href: links.social.youtube, label: "YouTube", Icon: YoutubeIcon },
              { href: links.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: links.social.tiktok, label: "TikTok", Icon: TiktokIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border transition hover:bg-accent"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            <Link href="/games" className="transition hover:text-bf">
              {t("games")}
            </Link>
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {games.map((g) => (
              <li key={g.id}>
                <Link href={`/games/${g.id}`} className="transition hover:text-foreground">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("project")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={links.github} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                {t("source")}
              </a>
            </li>
            <li>
              <a href={links.docs.integration} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                {t("integration")}
              </a>
            </li>
            <li>
              <a href={links.blog} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                {t("blog")}
              </a>
            </li>
            <li>
              <a href={links.patreon} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                Patreon
              </a>
            </li>
            <li>
              <a href={links.author} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                Hammerill
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t("license", { year: new Date().getFullYear() })}</span>
          <span>
            {t.rich("disclaimer", tags)}
          </span>
        </div>
      </div>
    </footer>
  );
}

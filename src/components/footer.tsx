import Image from "next/image";

import { links } from "@/config";
import { games } from "@/data/games";
import { GithubIcon, InstagramIcon, PatreonIcon, TiktokIcon, YoutubeIcon } from "@/components/icons";

export default function Footer() {
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
            A drop-in FPV quadcopter for any game, with real Betaflight firmware in the loop. Free and open
            source under GPL-3.0-or-later.
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
          <h3 className="text-sm font-semibold">Games</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {games.map((g) => (
              <li key={g.id}>
                <a href={g.repo} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Project</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={links.github} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                Source code
              </a>
            </li>
            <li>
              <a href={links.docs.integration} target="_blank" rel="noreferrer" className="transition hover:text-foreground">
                Integration guide
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
          <span>© {new Date().getFullYear()} Hammerill. libfpv is GPL-3.0-or-later.</span>
          <span>
            Not affiliated with Betaflight or any game publisher. Game names and footage belong to their owners.
          </span>
        </div>
      </div>
    </footer>
  );
}

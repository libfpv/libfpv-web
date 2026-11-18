"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight, Expand, Play } from "lucide-react";
import { useTranslations } from "next-intl";

type Step = { keys: string[]; text: string };

/**
 * The keys that get a player from the title screen to the drone. It is tucked
 * under the embed's bottom edge, so it reads as part of it and nobody misses
 * that F7 is what launches the drone.
 */
function Steps({ steps }: { steps: Step[] }) {
  const t = useTranslations("webBuild");
  return (
    <div
      role="note"
      aria-label={t("howTo")}
      className="relative -mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-b-2xl border border-t-0 bg-card px-4 pb-2.5 pt-6 text-sm text-muted-foreground shadow-sm"
    >
      {steps.map((s, i) => {
        const launch = s.keys.includes("F7");
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden />}
            {s.keys.map((k, j) => (
              <kbd
                key={j}
                className={
                  "rounded-md border px-2 py-0.5 font-mono text-xs text-foreground shadow-[0_2px_0_hsl(var(--border))] " +
                  (launch ? "border-bf/60 bg-bf/15 font-bold" : "bg-background font-semibold")
                }
              >
                {t.has(`keys.${k}`) ? t(`keys.${k}`) : k}
              </kbd>
            ))}
            <span className={launch ? "font-semibold text-foreground" : undefined}>{s.text}</span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * A game's clip that turns into its playable web build on click. The iframe
 * (WASM game + libfpv, a few dozen MB) only loads once the visitor asks for it.
 */
export default function WebBuild({
  url,
  title,
  steps,
  children,
}: {
  url: string;
  title: string;
  steps?: Step[];
  children: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  const t = useTranslations("webBuild");

  const media = playing ? (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
      <iframe
        src={url}
        title={t("iframe", { game: title })}
        className="absolute inset-0 h-full w-full"
        allow="fullscreen; gamepad; autoplay"
        allowFullScreen
      />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/80"
      >
        <Expand className="size-3.5" />
        {t("fullScreen")}
      </a>
    </div>
  ) : (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group/play absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl text-white"
        aria-label={t("playLabel", { game: title })}
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover/play:scale-110">
          <Play className="ml-1 size-9 fill-current" />
        </span>
        <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold backdrop-blur">
          {t("play")}
        </span>
      </button>
    </div>
  );

  if (!steps || steps.length === 0) return media;

  return (
    <div className="relative">
      <div className="relative z-10">{media}</div>
      <Steps steps={steps} />
    </div>
  );
}

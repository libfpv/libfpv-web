"use client";

import { useState, type ReactNode } from "react";
import { Expand, Play } from "lucide-react";

/**
 * A game's clip that turns into its playable web build on click. The iframe
 * (WASM game + libfpv, a few dozen MB) only loads once the visitor asks for it.
 */
export default function WebBuild({ url, title, children }: { url: string; title: string; children: ReactNode }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
        <iframe
          src={url}
          title={`${title} with libfpv, in the browser`}
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
          Full screen
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group/play absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl text-white"
        aria-label={`Play ${title} with libfpv in your browser`}
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover/play:scale-110">
          <Play className="ml-1 size-9 fill-current" />
        </span>
        <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold backdrop-blur">
          Play it right here, in your browser
        </span>
      </button>
    </div>
  );
}

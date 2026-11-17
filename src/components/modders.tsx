import { ArrowRight, BookOpen, FileCode2, Globe, Package, Radio, Cpu, MonitorPlay } from "lucide-react";

import { links } from "@/config";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";

const code = `fpv_global_config cfg;
fpv_global_config_defaults(&cfg);
cfg.data_dir = "<writable folder>";
cfg.coords = fpv_coords_preset(FPV_COORDS_Y_UP_RIGHT_HANDED, 1.0f);
fpv_global_init(&cfg);                        // once

fpv_static_surfaces_load(&level_mesh, 1);     // world collision
fpv_drone *d;
fpv_drone_create(NULL, &d);                   // spawn

// every frame
fpv_drone_tick(d, dt, &frame);
// place the camera at frame.camera, draw the drone at
// frame.position / frame.rotation, then draw the OSD and overlay

fpv_global_terminate();                       // on unload / exit`;

function Highlighted({ src }: { src: string }) {
  // Tiny highlighter: comments, strings, fpv_* identifiers and FPV_* constants.
  const re = /(\/\/.*$)|("[^"]*")|(\bfpv_[a-z_0-9]+\b)|(\bFPV_[A-Z_0-9]+\b)|(\b\d+(?:\.\d+)?f?\b)/gm;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1]
      ? "text-slate-500 italic"
      : m[2]
        ? "text-emerald-300"
        : m[3]
          ? "text-sky-300"
          : m[4]
            ? "text-amber-300"
            : "text-fuchsia-300";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return <>{out}</>;
}

const steps = [
  { icon: Radio, title: "Your radio", body: "Transmitter, gamepad or keyboard, read through an embedded SDL3 (the Gamepad API in a browser)." },
  { icon: Cpu, title: "libfpv", body: "Betaflight + physics stepped at 1 kHz, colliding with the game's world." },
  { icon: MonitorPlay, title: "The game", body: "Gets the drone's pose, cameras, OSD and sound, and draws the frame." },
];

const docs = [
  { icon: FileCode2, title: "libfpv.h", body: "The whole API, documented inline", href: links.docs.header },
  { icon: BookOpen, title: "Integration guide", body: "Hooks, shaders, lessons from real mods", href: links.docs.integration },
  { icon: Globe, title: "Web builds", body: "Compile game + mod to WebAssembly", href: links.docs.web },
  { icon: Package, title: "Publishing", body: "One ZIP or one link for players", href: links.docs.publishing },
];

export default function Modders() {
  return (
    <section id="modders" className="relative scroll-mt-16 border-y bg-card/40 py-24 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="For modders"
          title="Give your favourite game a drone."
          description="libfpv has no renderer of its own and a plain C API, so it loads from any engine or mod loader. The game supplies collision and draws the result; libfpv does everything else."
        />

        {/* pipeline */}
        <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((s, i) => (
            <div key={s.title} className="contents">
              <Reveal delay={i * 120}>
                <div className="flex h-full flex-col items-center rounded-2xl border bg-background p-6 text-center shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full border bg-card">
                    <s.icon className="size-5 text-bf" />
                  </div>
                  <h3 className="mt-4 font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center text-muted-foreground">
                  <ArrowRight className="size-5 rotate-90 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <Reveal className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1020] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-3 rounded-full bg-red-400/80" />
                <span className="size-3 rounded-full bg-amber-400/80" />
                <span className="size-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">your_mod.c</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-slate-200">
                <code>
                  <Highlighted src={code} />
                </code>
              </pre>
            </div>
          </Reveal>

          <div className="grid gap-3">
            {docs.map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
                    <d.icon className="size-5 text-bf" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-sm text-muted-foreground">{d.body}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

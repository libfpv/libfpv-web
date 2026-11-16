import {
  Cpu,
  Gamepad2,
  Wind,
  Boxes,
  Tv,
  Globe,
  Orbit,
  Volume2,
  MapPin,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { cn } from "@/lib/utils";

type Feature = { icon: LucideIcon; title: string; body: string; wide?: boolean };

const features: Feature[] = [
  {
    icon: Cpu,
    title: "Betaflight in the loop",
    body: "Not a lookalike: the real Betaflight 2025.12 runs inside the game through SimITL. Rates, modes, filters, arming and turtle mode behave as on your quad. Connect Betaflight Configurator, or paste a diff all from your real drone.",
    wide: true,
  },
  {
    icon: Gamepad2,
    title: "Your radio, your gamepad",
    body: "Plug in your transmitter in USB joystick mode. A setup wizard maps arm, angle, beeper, turtle and air mode. Gamepad and keyboard work too.",
  },
  {
    icon: Wind,
    title: "Wind that fights back",
    body: "The game's weather becomes real wind: gustier up high, calm behind buildings, helicopter downwash and blast waves. Betaflight has to hold the quad against it.",
  },
  {
    icon: Tv,
    title: "A real goggle feed",
    body: "Fisheye lens, uptilt, and a 5.8 GHz link budget: snow, sparkles, torn lines and colour loss with range, walls and crashes. Digital links break up and freeze.",
    wide: true,
  },
  {
    icon: Boxes,
    title: "Physics presets",
    body: "From a BetaFPV Air65 tiny whoop to a 7\" long-range cruiser. Frame, motors, props, battery, VTX and camera are presets, with real cameras like the Caddx Ratel 2 and HDZero Nano 90.",
  },
  {
    icon: MapPin,
    title: "Full OSD with GPS",
    body: "Betaflight's own MAX7456 fonts, analog or HD. Speed, altitude, vario, distance and a home arrow pointing back to your character.",
  },
  {
    icon: Volume2,
    title: "Motor sound",
    body: "Synthesized motors and beeper, quieter far away and behind walls, with Doppler and echoes.",
  },
  {
    icon: Orbit,
    title: "Portals, pushes and cargo",
    body: "Fly through linked portals with your momentum, get launched by pads, and carry things under the drone with their weight.",
  },
  {
    icon: Globe,
    title: "Fly from a link",
    body: "A game with source available can ship its mod as a web page: game and libfpv compiled to WebAssembly, radio included. Nothing to install.",
    wide: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-16 overflow-hidden py-24 lg:py-32">
      <div className="glow-blob left-[-10%] top-20 h-[30rem] w-[30rem] opacity-60" />
      <div className="glow-blob bottom-0 right-[-10%] h-[30rem] w-[30rem] opacity-50" />
      <div className="container">
        <SectionHeading
          eyebrow="What you get"
          title="It flies like the real thing. Because it is."
          description="Every libfpv mod ships with a full FPV simulator inside. Press F8 in any game to open the overlay: radio setup, rates, tuning, OSD, camera, the Betaflight CLI."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 80}
              className={cn(f.wide && "lg:col-span-2")}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:border-white/20">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-background">
                  <f.icon className="size-5 text-bf" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

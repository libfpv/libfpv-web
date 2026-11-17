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
  UserRound,
  Footprints,
  Flame,
  RadioTower,
  FolderSync,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { games } from "@/data/games";
import { cn } from "@/lib/utils";

/**
 * libfpv's features. They belong to libfpv, not to one game: every mod gets
 * them. A few need the mod to wire them up, and some older mods haven't yet:
 * `pending` names those games, so the page never claims more than they do.
 * Drop a game's id from `pending` once its mod catches up.
 */
export type Feature = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  wide?: boolean;
  /** Mods that don't have this yet (game ids), and what is missing, lowercase ("the video feed"). */
  pending?: { games: string[]; what: string };
};

export const features: Feature[] = [
  {
    id: "betaflight",
    icon: Cpu,
    title: "Betaflight in the loop",
    body: "Not a lookalike: the real Betaflight 2025.12 runs inside the game through SimITL. Rates, modes, filters, arming, air mode and turtle mode behave as on your quad, so the habits carry over to the real one. Paste a diff all from your drone, or connect Betaflight Configurator (desktop builds).",
    wide: true,
  },
  {
    id: "radio",
    icon: Gamepad2,
    title: "Your radio, your gamepad",
    body: "Plug in your transmitter in USB joystick mode. A setup wizard maps arm, angle, beeper, turtle, air mode and OSD disable. Mods can put the game's own actions on your switches too. Gamepad and keyboard work as well.",
  },
  {
    id: "stand-in",
    icon: UserRound,
    title: "The world treats the drone as you",
    body: "Your character launches the drone and stays at the piloting spot, radio in hand. Fly away and the game plays against the drone as if it were the player: enemies and police go after it, doors, pickups and triggers react to it, and the map loads around it. On by default, off in F8.",
    wide: true,
    pending: { games: ["gtaiv"], what: "the stand-in" },
  },
  {
    id: "pilot-view",
    icon: Footprints,
    title: "Back to the pilot",
    body: "F gives you the character back while the drone stays in the world, still flown by the radio. F7 returns to it, and Y puts the character right under the drone.",
    pending: { games: ["gtaiv", "revc"], what: "the pilot view (F)" },
  },
  {
    id: "video",
    icon: Tv,
    title: "A real goggle feed",
    body: "Fisheye lens and uptilt everywhere. Mods that draw libfpv's video feed add a 5.8 GHz link budget: snow, sparkles, torn lines and colour loss with range, walls and crashes, at the camera's own resolution and aspect. Digital links break up and freeze.",
    wide: true,
    pending: { games: ["gtaiv", "revc", "portal2"], what: "the video feed" },
  },
  {
    id: "wind",
    icon: Wind,
    title: "Wind that fights back",
    body: "The game's weather becomes real wind: gustier up high, calm behind buildings and indoors, with rotor downwash and blast waves. Betaflight has to hold the quad against it.",
    pending: { games: ["gtaiv", "revc"], what: "wind" },
  },
  {
    id: "damage",
    icon: Flame,
    title: "Props break like real ones",
    body: "Hard crashes break props and burn motors, and whatever would hurt the character (fire, water, bullets, explosions) breaks the props too. Damage can be turned off.",
    pending: { games: ["gtaiv", "revc"], what: "damage from the game's hazards" },
  },
  {
    id: "presets",
    icon: Boxes,
    title: "Physics presets",
    body: "From a BetaFPV Air65 tiny whoop to a 7\" long-range cruiser. Frame, motors, props, battery, VTX and camera are presets, with real cameras like the Caddx Ratel 2 and HDZero Nano 90.",
  },
  {
    id: "osd",
    icon: MapPin,
    title: "Full OSD with GPS",
    body: "Betaflight's own MAX7456 fonts, analog or HD. Speed, altitude, vario, distance and a home arrow pointing back to your character.",
  },
  {
    id: "sound",
    icon: Volume2,
    title: "Motor sound",
    body: "Synthesized motors and beeper. Heard from the pilot, the drone gets quieter far away and behind walls, with Doppler and echoes.",
    pending: { games: ["gtaiv", "revc"], what: "hearing the drone from the pilot" },
  },
  {
    id: "rc-link",
    icon: RadioTower,
    title: "An ExpressLRS link",
    body: "Optional: packets drop with range and walls, Betaflight shows RXLOSS and goes into failsafe, with LQ and RSSI on the OSD.",
  },
  {
    id: "shared",
    icon: FolderSync,
    title: "One setup for every game",
    body: "Radio mappings, your Betaflight tune and settings live in one shared folder, so they follow you from game to game.",
    pending: { games: ["gtaiv"], what: "the shared setup folder" },
  },
  {
    id: "portals",
    icon: Orbit,
    title: "Portals, pushes and cargo",
    body: "For games that have them: fly through linked portals with your momentum, get launched by pads, and carry things under the drone with their weight.",
  },
  {
    id: "web",
    icon: Globe,
    title: "Fly from a link",
    body: "A game with source available can ship its mod as a web page: game and libfpv compiled to WebAssembly, radio included. Nothing to install.",
    wide: true,
  },
];

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** "The video feed: not in GTA IV, Vice City and Portal 2 yet". */
export function pendingText(f: Feature) {
  if (!f.pending) return null;
  const names = f.pending.games.map((id) => games.find((g) => g.id === id)?.short ?? id);
  const what = f.pending.what.charAt(0).toUpperCase() + f.pending.what.slice(1);
  return `${what}: not in ${joinNames(names)} yet`;
}

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-16 overflow-hidden py-24 lg:py-32">
      <div className="glow-blob left-[-10%] top-20 h-[30rem] w-[30rem] opacity-60" />
      <div className="glow-blob bottom-0 right-[-10%] h-[30rem] w-[30rem] opacity-50" />
      <div className="container">
        <SectionHeading
          eyebrow="In every game"
          title="It flies like the real thing. Because it is."
          description="These are libfpv's features, not one game's. Every libfpv mod ships the same FPV simulator inside, so what you see in one game's clip works in the others too. Press F8 in any of them to open the overlay: radio setup, rates, tuning, OSD, camera, the Betaflight CLI."
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
                {f.pending && (
                  <p className="mt-3 text-xs font-medium text-muted-foreground/80">{pendingText(f)}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

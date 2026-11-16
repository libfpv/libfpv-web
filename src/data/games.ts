export type Game = {
  id: string;
  title: string;
  subtitle: string;
  /** The mod's repository. */
  repo: string;
  repoName: string;
  /** Media in /public/games: <media>.mp4, .webm and .jpg (poster). */
  media: string;
  platforms: string[];
  status: "playable" | "in development";
  pitch: string;
  highlights: string[];
  video?: string;
  /** VTX channel label shown on the clip, purely decorative. */
  channel: string;
  /** A playable web build (WASM), embedded in the game's slot on click. */
  webBuild?: string;
  /** Seconds to skip at the start of the clip in the hero carousel. */
  heroStart?: number;
};

export const games: Game[] = [
  {
    id: "sm64",
    title: "Super Mario 64",
    subtitle: "Mario has a drone now",
    repo: "https://github.com/hammerill/sm64ex-fpv",
    repoName: "sm64ex-fpv",
    media: "sm64",
    platforms: ["PC", "sm64ex port", "Browser"],
    status: "playable",
    pitch:
      "Mario deploys a quad and stays behind as the pilot. Fly through the Mushroom Kingdom at real scale, through goggles that get noisier the further you go.",
    highlights: [
      "Press F7 to launch the drone, and F to get back to Mario",
      "Fly through coins, stars, keys and 1-ups to collect them",
      "Knock out Goombas, Koopas and Bob-ombs by ramming them",
      "Every level has its own wind; lava and flames burn your props",
      "Analog goggle feed: snow, torn lines and colour loss with range",
    ],
    channel: "R1",
    heroStart: 3,
    webBuild: "https://sm64ex-fpv.hammerill.com",
  },
  {
    id: "gtaiv",
    title: "GTA IV",
    subtitle: "Liberty City from above",
    repo: "https://github.com/hammerill/gtaiv-fpv",
    repoName: "gtaiv-fpv",
    media: "gtaiv",
    platforms: ["Windows"],
    status: "playable",
    pitch:
      "Press F7 and Niko launches a quad from the street in front of him. Dive between skyscrapers, chase traffic, then put Niko right where you landed.",
    highlights: [
      "Collides with buildings, cars, peds and props via the engine's physics",
      "A fast hit ragdolls a ped, dents a car or shoves a prop",
      "Full GPS OSD with a home arrow pointing back to Niko",
      "Clean view for recording: HUD, OSD and subtitles off on a switch",
    ],
    channel: "R2",
  },
  {
    id: "gtasa",
    title: "GTA San Andreas",
    subtitle: "The city treats the drone as CJ",
    repo: "https://github.com/hammerill/gtasa-fpv",
    repoName: "gtasa-fpv",
    media: "gtasa",
    platforms: ["Windows", "modloader"],
    status: "playable",
    pitch:
      "CJ throws a quad into the air and stands there with a radio in his hands. Gangs, peds and the police react to the drone as if it were him.",
    highlights: [
      "Get a wanted level and the cops come for the drone and shoot at it",
      "Storms blow hard, helicopters push you down, explosions shove you",
      "Leave the drone hovering and walk or drive as CJ, then fly back",
      "Streaming and traffic follow the drone wherever you fly",
    ],
    video: "https://www.youtube.com/watch?v=tsXKFhD8TOw",
    channel: "R3",
  },
  {
    id: "revc",
    title: "GTA Vice City",
    subtitle: "Native on Apple Silicon Macs",
    repo: "https://github.com/hammerill/reVC-mac-fpv",
    repoName: "reVC-mac-fpv",
    media: "revc",
    platforms: ["macOS", "Apple Silicon", "reVC"],
    status: "playable",
    pitch:
      "A plugin for the macOS recompilation of Vice City. Tommy launches a quad from the ground and the neon city opens up below it. Self-contained: nothing else to install.",
    highlights: [
      "The drone picks up pickups and flies through doors into interiors",
      "The police notice it, and Tommy stays at his spot as the pilot",
      "Uses the game's own sounds for launches, crashes and camera switches",
      "\"Move Tommy here\" lands him and his car right under the drone",
    ],
    channel: "R4",
    heroStart: 6,
  },
  {
    id: "portal2",
    title: "Portal 2",
    subtitle: "The drone is the portal gun",
    repo: "https://github.com/hammerill/portal-2-fpv",
    repoName: "portal-2-fpv",
    media: "portal2",
    platforms: ["Windows", "macOS", "Apple Silicon", "source-recomp"],
    status: "playable",
    pitch:
      "Solve Aperture's test chambers by quad. Fire portals from the camera, dive into a floor portal and come out of a wall with all your momentum.",
    highlights: [
      "Hook a cube under the drone on a winch line and lower it onto a button",
      "Turrets shoot at the drone, lasers burn its props, goo drowns it",
      "Faith plates launch it and excursion funnels carry it",
      "Co-op: a friend flies while you walk around as Chell",
    ],
    channel: "R5",
    heroStart: 1,
  },
];

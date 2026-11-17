export type Game = {
  id: string;
  title: string;
  /** Short name, used where space is tight ("not in GTA IV yet"). */
  short: string;
  subtitle: string;
  /** The mod's repository. */
  repo: string;
  repoName: string;
  /** Media in /public/games: <media>.mp4, .webm and .jpg (poster). */
  media: string;
  platforms: string[];
  status: "playable" | "in development";
  pitch: string;
  /**
   * What this game's own world brings: its content, its hazards, its people.
   * Not libfpv features (those are in components/features.tsx and apply to
   * every mod), so nothing here should read as exclusive when it isn't.
   */
  highlights: string[];
  video?: string;
  /** VTX channel label shown on the clip, purely decorative. */
  channel: string;
  /** A playable web build (WASM), embedded in the game's slot on click. */
  webBuild?: string;
  /** How to get from the web build's title screen to a drone, shown right under the embed. */
  webSteps?: { keys: string[]; text: string }[];
  /** Media used in the hero carousel instead of `media` (e.g. a pre-trimmed copy). */
  heroMedia?: string;
  /** Seconds to skip at the start of the clip in the hero carousel. */
  heroStart?: number;
};

export const games: Game[] = [
  {
    id: "sm64",
    title: "Super Mario 64",
    short: "Mario 64",
    subtitle: "Mario has a drone now",
    repo: "https://github.com/hammerill/sm64ex-fpv",
    repoName: "sm64ex-fpv",
    media: "sm64",
    platforms: ["PC", "sm64ex port", "Browser"],
    status: "playable",
    pitch:
      "Mario deploys a quad and stays behind as the pilot. Fly the castle grounds and every painting's world at real scale, where Mario is 1.6 m tall.",
    highlights: [
      "Fly through coins, stars, keys and 1-ups to collect them; a star ends the flight with Mario's dance",
      "Ram Goombas, Koopas, Bullies and Bob-ombs to knock them out",
      "Each level has its own breeze, and Fwooshes blow the drone away as they blow Mario",
      "Lava, flames, Amps and Bob-omb blasts break the props",
    ],
    channel: "R1",
    heroMedia: "sm64-hero",
    webBuild: "https://sm64ex-fpv.hammerill.com",
    webSteps: [
      { keys: ["Space", "Space"], text: "load a save" },
      { keys: [], text: "wait for Mario" },
      { keys: ["F7"], text: "launch the drone" },
    ],
  },
  {
    id: "gtaiv",
    title: "GTA IV",
    short: "GTA IV",
    subtitle: "Liberty City from above",
    repo: "https://github.com/hammerill/gtaiv-fpv",
    repoName: "gtaiv-fpv",
    media: "gtaiv",
    platforms: ["Windows"],
    status: "playable",
    pitch:
      "Niko launches a quad from the street in front of him. Dive between Liberty City's skyscrapers and chase traffic down its avenues.",
    highlights: [
      "Collides with buildings, cars, peds and props through the engine's own physics probe",
      "A fast hit ragdolls a ped, dents a car or shoves a prop",
      "Liberty City streams in around the drone wherever you fly",
    ],
    channel: "R2",
  },
  {
    id: "gtasa",
    title: "GTA San Andreas",
    short: "San Andreas",
    subtitle: "From Grove Street to Las Venturas",
    repo: "https://github.com/hammerill/gtasa-fpv",
    repoName: "gtasa-fpv",
    media: "gtasa",
    platforms: ["Windows", "modloader"],
    status: "playable",
    pitch:
      "CJ launches a quad from the ground in front of him. Fly over Grove Street, out across the desert and between the casinos of Las Venturas.",
    highlights: [
      "Gangs, peds and the police react to the drone; with a wanted level, the cops shoot at it",
      "Rain and sandstorms blow hard, police helicopters push you down, explosions shove you",
      "Bullets, molotov fires, water and helicopter rotors break the props",
      "Fly through a replay (F1, F3) or a world frozen by a photo mod",
    ],
    video: "https://www.youtube.com/watch?v=tsXKFhD8TOw",
    channel: "R3",
  },
  {
    id: "revc",
    title: "GTA Vice City",
    short: "Vice City",
    subtitle: "Native on Apple Silicon Macs",
    repo: "https://github.com/hammerill/reVC-mac-fpv",
    repoName: "reVC-mac-fpv",
    media: "revc",
    platforms: ["macOS", "Apple Silicon", "reVC"],
    status: "playable",
    pitch:
      "A plugin for the macOS recompilation of Vice City. Tommy launches a quad from the ground and the neon city opens up below it. Self-contained: nothing else to install.",
    highlights: [
      "The drone picks up Vice City's pickups and flies through doors into its interiors",
      "Peds and the police react to it as they would to Tommy",
      "A fast hit hurts a ped as if Tommy rammed them, or dents a car",
      "Runs next to Hammerill Trainer: both load from the same launcher",
    ],
    channel: "R4",
    heroStart: 6,
  },
  {
    id: "portal2",
    title: "Portal 2",
    short: "Portal 2",
    subtitle: "The drone is the portal gun",
    repo: "https://github.com/hammerill/portal-2-fpv",
    repoName: "portal-2-fpv",
    media: "portal2",
    platforms: ["Windows", "macOS", "Apple Silicon", "source-recomp"],
    status: "playable",
    pitch:
      "Solve Aperture's test chambers by quad. Fire portals from the camera, dive into a floor portal and come out of a wall with all your momentum.",
    highlights: [
      "Press pedestal buttons from the air, and doors open for the drone",
      "Hook a cube under the drone on a winch line and lower it onto a button",
      "Turrets shoot at the drone, lasers burn its props, goo drowns it",
      "Faith plates launch it, excursion funnels carry it, fizzlers fizzle it",
    ],
    channel: "R5",
    heroStart: 1,
  },
];

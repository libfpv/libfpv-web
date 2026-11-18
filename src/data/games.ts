/**
 * The games' structure. Their text (subtitle, pitch, highlights, web build
 * steps) lives in dicts/<locale>.json under gameData.<id>. Highlights are what
 * this game's own world brings: its content, its hazards, its people. Not
 * libfpv features (those are in components/features.tsx and apply to every
 * mod), so nothing there should read as exclusive when it isn't.
 */
export type Game = {
  id: string;
  title: string;
  /** Short name, used where space is tight ("not in GTA IV yet"). */
  short: string;
  /** The mod's repository. */
  repo: string;
  repoName: string;
  /** Media in /public/games: <media>.mp4, .webm and .jpg (poster). */
  media: string;
  platforms: string[];
  status: "playable" | "in development";
  video?: string;
  /** VTX channel label shown on the clip, purely decorative. */
  channel: string;
  /** A playable web build (WASM), embedded in the game's slot on click. */
  webBuild?: string;
  /**
   * How to get from the web build's title screen to a drone, shown right under the embed:
   * the keys of each step. Each step's text is gameData.<id>.steps[i] in dicts/*.json.
   */
  webSteps?: string[][];
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
    repo: "https://github.com/hammerill/sm64ex-fpv",
    repoName: "sm64ex-fpv",
    media: "sm64",
    platforms: ["PC", "sm64ex port", "Browser"],
    status: "playable",
    channel: "R1",
    heroMedia: "sm64-hero",
    webBuild: "https://sm64ex-fpv.hammerill.com",
    webSteps: [["Space", "Space"], [], ["F7"]],
  },
  {
    id: "gtaiv",
    title: "GTA IV",
    short: "GTA IV",
    repo: "https://github.com/hammerill/gtaiv-fpv",
    repoName: "gtaiv-fpv",
    media: "gtaiv",
    platforms: ["Windows"],
    status: "playable",
    channel: "R2",
  },
  {
    id: "gtasa",
    title: "GTA San Andreas",
    short: "San Andreas",
    repo: "https://github.com/hammerill/gtasa-fpv",
    repoName: "gtasa-fpv",
    media: "gtasa",
    platforms: ["Windows", "modloader"],
    status: "playable",
    video: "https://www.youtube.com/watch?v=tsXKFhD8TOw",
    channel: "R3",
  },
  {
    id: "revc",
    title: "GTA Vice City",
    short: "Vice City",
    repo: "https://github.com/hammerill/reVC-mac-fpv",
    repoName: "reVC-mac-fpv",
    media: "revc",
    platforms: ["macOS", "Apple Silicon", "reVC"],
    status: "playable",
    channel: "R4",
    heroStart: 6,
  },
  {
    id: "portal2",
    title: "Portal 2",
    short: "Portal 2",
    repo: "https://github.com/hammerill/portal-2-fpv",
    repoName: "portal-2-fpv",
    media: "portal2",
    platforms: ["Windows", "macOS", "Apple Silicon", "source-recomp"],
    status: "playable",
    channel: "R5",
    heroStart: 1,
  },
];

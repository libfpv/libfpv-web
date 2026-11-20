/**
 * The games' structure. Their text (subtitle, pitch, highlights, web build
 * steps) lives in dicts/<locale>.json under gameData.<id>. Highlights are what
 * this game's own world brings: its content, its hazards, its people. Not
 * libfpv features (those are in components/features.tsx and apply to every
 * mod), so nothing there should read as exclusive when it isn't.
 */
/**
 * A file players download. Today it is an asset of the mod's latest GitHub
 * release (lib/releases.ts); later it can point at libfpv's own downloads.
 */
export type Download = {
  /** The release asset's file name. */
  file: string;
  /** Which system it is for (a key of games.platforms in the dicts, or shown as is). */
  platform: string;
};

/** A default key and what it does: gamePage.controls.actions.<action> in dicts/*.json. */
export type Control = { keys: string[]; action: string };

export type Game = {
  /**
   * Also the game's page: /games/<id>. It is the mod's code without "-fpv"
   * (gtasa for gtasa-fpv).
   */
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
  /**
   * false: no Kamikaze build for patrons. A prebuilt binary of this mod would
   * contain the game's own code (sm64ex is a decompilation), and selling that
   * isn't legal. The Kamikaze code stays open for anyone building it themselves.
   */
  kamikaze?: boolean;
  /** Who stays behind with the radio ("CJ"), named in the controls. */
  pilot: string;
  /** What players download from the game's page. None: the mod ships as source. */
  downloads?: Download[];
  /** Default keys, shown on the game's page. */
  controls: Control[];
  /**
   * Stills for the game's page gallery, in /public/gallery/<id>/. The clip
   * (and `video`, if any) come first on their own.
   */
  gallery?: string[];
  /** Media used in the hero carousel instead of `media` (e.g. a pre-trimmed copy). */
  heroMedia?: string;
  /** Seconds to skip at the start of the clip in the hero carousel. */
  heroStart?: number;
};

const stills = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];

/** The keys every libfpv mod shares (gamePage.controls.actions.*). */
const launch: Control = { keys: ["F7"], action: "launch" };
const overlay: Control = { keys: ["F8"], action: "overlay" };
const respawn: Control = { keys: ["R"], action: "respawn" };
const back: Control = { keys: ["F"], action: "back" };
const moveHere: Control = { keys: ["Y"], action: "move" };
const cameras = (key: string): Control => ({ keys: [key], action: "camera" });

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
    pilot: "Mario",
    kamikaze: false,
    controls: [launch, back, respawn, cameras("V"), overlay],
    gallery: stills,
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
    pilot: "Niko",
    downloads: [{ file: "gtaiv-fpv.zip", platform: "Windows" }],
    controls: [launch, overlay, cameras("C"), respawn, moveHere],
    gallery: stills,
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
    pilot: "CJ",
    downloads: [{ file: "gtasa-fpv.zip", platform: "Windows" }],
    controls: [launch, back, overlay, cameras("C"), respawn, moveHere],
    gallery: stills,
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
    pilot: "Tommy",
    downloads: [{ file: "reVC-fpv.zip", platform: "macOS" }],
    controls: [launch, overlay, cameras("C"), respawn, moveHere],
    gallery: stills,
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
    pilot: "Chell",
    downloads: [
      { file: "portal-2-fpv.zip", platform: "Windows" },
      { file: "portal-2-fpv-macos.zip", platform: "macOS" },
    ],
    controls: [
      launch,
      back,
      overlay,
      cameras("C"),
      respawn,
      moveHere,
      { keys: ["Mouse 1", "1"], action: "portalBlue" },
      { keys: ["Mouse 2", "2"], action: "portalOrange" },
      { keys: ["E"], action: "use" },
      { keys: ["G"], action: "grab" },
    ],
    gallery: stills,
    heroStart: 1,
  },
];

export function getGame(id: string) {
  return games.find((g) => g.id === id);
}

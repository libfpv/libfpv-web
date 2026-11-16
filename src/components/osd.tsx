import { cn } from "@/lib/utils";

/**
 * Betaflight OSD glyph codes (betaflight/src/main/drivers/osd_symbols.h).
 * Uppercase letters, digits and punctuation sit at their ASCII codes, so
 * write plain text in uppercase (lowercase codes are symbols).
 */
export const SYM = {
  RSSI: "\x01",
  VOLT: "\x06",
  M: "\x0C",
  HOMEFLAG: "\x11",
  ARROW_NORTH_WEST: "\x6A",
  SPEED: "\x70",
  LINK_QUALITY: "\x7B",
  ALTITUDE: "\x7F",
  BATT_FULL: "\x90",
  BATT_5: "\x91",
  AMP: "\x9A",
  FLY_M: "\x9C",
  KPH: "\x9E",
} as const;

/**
 * Draws a string with Betaflight's own MAX7456 font (public/osd-font.png,
 * made by scripts/mcm-to-png.py). One glyph is 12x18 px and 1em tall, so
 * font-size sets the scale: 18px, 27px and 36px are 1x, 1.5x and 2x.
 */
export default function Osd({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("inline-flex whitespace-pre leading-none", className)} aria-hidden>
      {Array.from(text).map((ch, i) => {
        const code = ch.charCodeAt(0) & 0xff;
        return (
          <span
            key={i}
            className="inline-block h-[1em] w-[0.6667em] bg-[url('/osd-font.png')] bg-[length:10.6667em_16em] bg-no-repeat [image-rendering:pixelated]"
            style={{ backgroundPosition: `${-(code % 16) * 0.6667}em ${-Math.floor(code / 16)}em` }}
          />
        );
      })}
    </span>
  );
}

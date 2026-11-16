import { Star } from "lucide-react";

import { formatStars } from "@/lib/github";
import { cn } from "@/lib/utils";

/** The "★ 49" pill appended to GitHub buttons. Renders nothing without a count. */
export default function StarCount({ stars, className }: { stars: number | null; className?: string }) {
  if (stars === null) return null;
  return (
    <span
      className={cn(
        "ml-1 inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold tabular-nums",
        className,
      )}
      aria-label={`${stars} stars on GitHub`}
    >
      <Star className="!size-3 fill-current" />
      {formatStars(stars)}
    </span>
  );
}

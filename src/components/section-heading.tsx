import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  center = true,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <p className="font-osd text-xl uppercase tracking-[0.2em] text-bf">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-balance text-lg leading-8 text-muted-foreground">{description}</p>}
    </Reveal>
  );
}

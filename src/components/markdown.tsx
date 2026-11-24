import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Renders a mod's install guide (INSTALL.md, uploaded by its release pipeline).
 *
 * Kept safe even though the guide comes from our own pipeline:
 * - raw HTML in the Markdown is dropped (skipHtml, no rehype-raw);
 * - links keep only http(s), mailto, site-relative and #anchor URLs
 *   (react-markdown's defaultUrlTransform already drops javascript: and the like);
 * - images are not loaded (nothing fetched from elsewhere): their alt text shows instead.
 */

function safeUrl(url: string) {
  const u = defaultUrlTransform(url);
  if (!u) return "";
  if (u.startsWith("#") || (u.startsWith("/") && !u.startsWith("//"))) return u;
  return /^(https?:|mailto:)/i.test(u) ? u : "";
}

function text(node: ReactNode): string {
  return Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? text((c.props as { children?: ReactNode }).children) : ""))
    .join("");
}

/** "## 2. Install the mod" → "2-install-the-mod", for links to a step. */
function slug(node: ReactNode) {
  return text(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const components: Components = {
  h1: ({ children }) => <h2 className="mt-12 text-3xl font-extrabold tracking-tight first:mt-0">{children}</h2>,
  h2: ({ children }) => (
    <h2 id={slug(children)} className="mt-12 scroll-mt-20 border-b pb-2 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slug(children)} className="mt-8 scroll-mt-20 text-xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className="mt-6 font-semibold">{children}</h4>,
  p: ({ children }) => <p className="mt-4 leading-7">{children}</p>,
  a: ({ href, children }) => {
    const url = href ?? "";
    const external = /^https?:/i.test(url);
    return (
      <a
        href={url || undefined}
        className="font-medium text-bf underline underline-offset-4 hover:opacity-80"
        {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ alt }) => <span className="italic text-muted-foreground">{alt}</span>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-7 [&>p]:mt-2">{children}</li>,
  blockquote: ({ children }) => <blockquote className="mt-4 border-l-4 border-bf/50 pl-4 text-muted-foreground">{children}</blockquote>,
  hr: () => <hr className="my-10" />,
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto rounded-xl border bg-card p-4 font-mono text-sm leading-6 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children }) => (
    <code className={cn("rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em]", className)}>{children}</code>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-card">{children}</thead>,
  th: ({ children }) => <th className="border-b px-4 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b px-4 py-2 align-top last:border-b-0">{children}</td>,
};

export default function Markdown({ children, className, lang }: { children: string; className?: string; lang?: string }) {
  return (
    <div className={className} lang={lang}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml urlTransform={safeUrl} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

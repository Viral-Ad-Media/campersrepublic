import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// react-markdown does not render raw HTML, so article bodies can't inject scripts.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-serif prose-headings:text-forest-900 prose-a:text-forest-700 prose-li:my-1 prose-table:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "nofollow noopener sponsored" } : {})}
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

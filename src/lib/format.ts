export const SITE = {
  name: "Campers Republic",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://campersrepublic.com",
  description:
    "Practical camping guides, gear advice and checklists for tent campers, RVers and glampers.",
};

export function formatDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function readingTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

import type { Project } from "@/lib/sanity/types";

export interface ProjectWithCode {
  project: Project;
  code: string;
}

// Shared by every "selected work" view (tracklist rows, mobile crate cards)
// so the same project always carries the same A/B code regardless of which
// layout is currently rendering it.
export function assignSideCodes(projects: Project[]): ProjectWithCode[] {
  const mid = Math.ceil(projects.length / 2);
  return projects.map((project, i) => ({
    project,
    code: i < mid ? `A${i + 1}` : `B${i - mid + 1}`,
  }));
}

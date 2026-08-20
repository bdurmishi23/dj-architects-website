export interface PlanMarkSpec {
  d: string;
  entry: [number, number];
  eye: [number, number];
}

// Simplified floor-plan silhouettes used as each project's visual signature.
// Every mark carries exactly two points: a filled brass dot at the plan's
// entry, and an open ring at a key interior sightline or window.
export const PROJECT_MARKS: Record<string, PlanMarkSpec> = {
  a1: { d: "M2 30 L2 6 L20 6 L20 18 L34 18 L34 30 Z M20 6 L20 18 M12 30 L12 18", entry: [12, 30], eye: [34, 22] },
  a2: { d: "M3 4 L41 4 L41 30 L3 30 Z M3 17 L27 17 M27 4 L27 30 M33 17 L41 17", entry: [3, 24], eye: [41, 10] },
  a3: { d: "M4 28 C4 12 14 4 26 4 L40 4 L40 28 Z M26 4 L26 28 M14 12 L14 28", entry: [26, 28], eye: [40, 14] },
  b1: { d: "M2 8 L30 2 L42 12 L42 30 L2 30 Z M14 30 L14 14 L30 14 M30 2 L30 14", entry: [14, 30], eye: [42, 20] },
  b2: { d: "M6 2 L6 30 M6 2 L38 8 L38 30 L6 30 M20 30 L20 16 L38 16 M28 8 L28 16", entry: [20, 30], eye: [38, 11] },
  b3: { d: "M4 6 L24 6 L24 20 L40 20 L40 32 L4 32 Z M24 20 L4 20 M14 6 L14 20", entry: [14, 32], eye: [40, 26] },
  c1: { d: "M4 4 L36 4 L36 22 L20 22 L20 32 L4 32 Z M20 22 L4 22", entry: [12, 32], eye: [36, 12] },
  c2: { d: "M3 6 C3 6 30 6 40 6 L40 30 L3 30 Z M3 18 L40 18", entry: [3, 24], eye: [40, 12] },
  c3: { d: "M6 3 L34 3 L34 33 L6 33 Z M6 18 L20 18 L20 33", entry: [6, 27], eye: [34, 12] },
  d1: { d: "M4 30 L4 10 L18 10 L18 4 L38 4 L38 30 Z M18 10 L18 30", entry: [26, 30], eye: [38, 15] },
  d2: { d: "M2 4 L36 4 L36 30 L2 30 Z M2 16 L36 16", entry: [2, 24], eye: [36, 9] },
  d3: { d: "M6 4 L34 10 L34 32 L6 32 Z M6 20 L34 20", entry: [6, 27], eye: [34, 15] },
};

export type ProjectMarkKey = keyof typeof PROJECT_MARKS;

export const PROJECT_MARK_OPTIONS: ProjectMarkKey[] = Object.keys(
  PROJECT_MARKS
) as ProjectMarkKey[];

export type RoomSlug =
  | "living"
  | "kitchen"
  | "bedroom"
  | "bath"
  | "entrance"
  | "terrace";

export const ROOM_MARKS: Record<RoomSlug, PlanMarkSpec> = {
  living: { d: "M3 30 L3 6 L28 6 L28 18 L41 18 L41 30 Z M28 18 L28 30", entry: [15, 30], eye: [41, 24] },
  kitchen: { d: "M3 6 L41 6 L41 30 L3 30 Z M3 20 L30 20 M30 6 L30 30", entry: [3, 26], eye: [41, 13] },
  bedroom: { d: "M4 4 L40 4 L40 30 L4 30 Z M4 22 L22 22 L22 30", entry: [13, 30], eye: [40, 12] },
  bath: { d: "M6 4 L34 4 L34 20 L20 20 L20 32 L6 32 Z M20 20 L6 20", entry: [6, 26], eye: [34, 11] },
  entrance: { d: "M8 2 L8 32 M8 2 L38 8 L38 32 L8 32 M20 32 L20 18 L38 18", entry: [8, 30], eye: [38, 25] },
  terrace: { d: "M3 12 L41 4 L41 30 L3 30 Z M3 20 L41 20", entry: [3, 26], eye: [41, 11] },
};

// Codes follow the site's vinyl-tracklist convention (A1-B3), fixed per room
// since the room set and its iconography are structural, not editorial.
export const ROOM_CODES: Record<RoomSlug, string> = {
  living: "A1",
  kitchen: "A2",
  bedroom: "A3",
  bath: "B1",
  entrance: "B2",
  terrace: "B3",
};

export const ROOM_SLUGS: RoomSlug[] = [
  "living",
  "kitchen",
  "bedroom",
  "bath",
  "entrance",
  "terrace",
];

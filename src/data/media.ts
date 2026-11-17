import mediaJson from "./exercise-media.json";
import { VIDEOS } from "./videos";

/**
 * Optional photo frames, written by `npm run photos` (scripts/fetch-exercise-photos.mjs).
 * Empty by default: the app then uses the animated line-art only.
 */
export interface PhotoMedia {
  frames: string[];
  width: number;
  height: number;
  source: string;
}

const media = mediaJson as Record<string, PhotoMedia>;

export const hasPhotos = Object.keys(media).length > 0;

export function photosFor(exerciseId: string): PhotoMedia | null {
  const m = media[exerciseId];
  return m && Array.isArray(m.frames) && m.frames.length > 0 ? m : null;
}

export function videoFor(exerciseId: string): { id: string; title: string } | null {
  return VIDEOS[exerciseId] ?? null;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

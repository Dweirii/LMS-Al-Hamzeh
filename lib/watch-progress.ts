/**
 * Helpers for video watch tracking, shared by the lesson player (client), the
 * watch-progress route and the admin student view.
 *
 * Watched time is stored as a list of [start, end] spans in seconds. Spans are
 * merged so re-watching the same part never counts twice, and seeking past a
 * section never counts it as watched.
 */

export type WatchRange = [number, number];

// Spans closer than this (seconds) are joined, which absorbs the small gaps
// between timeupdate events.
const MERGE_GAP = 1;

// Upper bound on stored spans per lesson, so a tampered request cannot bloat
// the row. Real viewing merges down to a handful.
export const MAX_WATCH_RANGES = 500;

/** Keeps only well-formed spans, clamped to [0, duration]. */
export function sanitizeRanges(input: unknown, duration: number): WatchRange[] {
  if (!Array.isArray(input)) return [];

  const ranges: WatchRange[] = [];
  for (const item of input.slice(0, MAX_WATCH_RANGES)) {
    if (!Array.isArray(item) || item.length !== 2) continue;
    let [start, end] = item;
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
    start = Math.max(0, start);
    end = duration > 0 ? Math.min(duration, end) : end;
    if (end > start) ranges.push([start, end]);
  }
  return ranges;
}

/** Sorts and joins overlapping or nearly touching spans. */
export function mergeRanges(ranges: WatchRange[]): WatchRange[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: WatchRange[] = [];

  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + MERGE_GAP) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

/** Total unique seconds covered by merged spans. */
export function totalWatched(ranges: WatchRange[]): number {
  return ranges.reduce((sum, [start, end]) => sum + (end - start), 0);
}

/** Share of the video watched, 0-100. */
export function watchedPercent(watchedSeconds: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(100, Math.round((watchedSeconds / duration) * 100));
}

/** 75 -> "1:15", 3725 -> "1:02:05". */
export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = String(s % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

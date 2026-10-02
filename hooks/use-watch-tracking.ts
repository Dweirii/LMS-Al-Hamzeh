"use client";

import { RefObject, useEffect } from "react";
import { mergeRanges, WatchRange } from "@/lib/watch-progress";

const FLUSH_INTERVAL_MS = 15_000;

// A jump larger than this between two timeupdate events is a seek, not
// playback (timeupdate fires every ~0.25s while playing).
const MAX_PLAYBACK_STEP = 3;

/**
 * Records which parts of the video are actually played and reports them to the
 * watch-progress route. Only continuous playback counts: seeking, scrubbing or
 * skipping ahead adds nothing.
 */
export function useWatchTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  lessonId: string
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const url = `/api/lessons/${lessonId}/watch-progress`;
    let pending: WatchRange[] = [];
    let lastTime: number | null = null;

    function record() {
      if (!video || video.seeking || lastTime === null) return;
      const now = video.currentTime;
      const step = now - lastTime;
      if (step > 0 && step <= MAX_PLAYBACK_STEP) {
        pending.push([lastTime, now]);
      }
      lastTime = now;
    }

    function flush(useBeacon = false) {
      if (!video || pending.length === 0 || !Number.isFinite(video.duration)) return;

      const ranges = mergeRanges(pending);
      pending = [];
      const body = JSON.stringify({
        ranges,
        duration: video.duration,
        position: video.currentTime,
      });

      if (useBeacon && navigator.sendBeacon?.(url, body)) return;

      fetch(url, { method: "POST", body, keepalive: true })
        .then((res) => {
          if (!res.ok) throw new Error();
        })
        .catch(() => {
          // Keep the spans for the next attempt.
          pending.push(...ranges);
        });
    }

    const onPlay = () => {
      lastTime = video.currentTime;
    };
    const onSeeking = () => {
      lastTime = null;
    };
    const onSeeked = () => {
      lastTime = video.paused ? null : video.currentTime;
    };
    const onTimeUpdate = () => {
      if (!video.paused) record();
    };
    const onStop = () => {
      record();
      lastTime = null;
      flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush(true);
    };
    const onPageHide = () => {
      record();
      flush(true);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("pause", onStop);
    video.addEventListener("ended", onStop);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    const interval = setInterval(() => flush(), FLUSH_INTERVAL_MS);

    return () => {
      record();
      flush();
      clearInterval(interval);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("pause", onStop);
      video.removeEventListener("ended", onStop);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [videoRef, lessonId]);
}

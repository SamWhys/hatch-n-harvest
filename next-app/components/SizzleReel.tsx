"use client";

import { useEffect, useRef, useState } from "react";

type SoundIntent = "sound-on" | "muted";

export function SizzleReel({ srcPrefix = "" }: { srcPrefix?: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userIntent, setUserIntent] = useState<SoundIntent>("sound-on");

  function applyIntent(intent: SoundIntent): void {
    const video = videoRef.current;
    if (!video) return;
    if (intent === "muted") {
      video.muted = true;
      setMuted(true);
      return;
    }
    // intent === "sound-on" — optimistically unmute.
    video.muted = false;
    setMuted(false);
    Promise.resolve(video.play()).catch(() => {
      // Browser blocked autoplay-with-sound. Revert to muted autoplay.
      video.muted = true;
      setMuted(true);
      Promise.resolve(video.play()).catch(() => {
        // Even muted autoplay failed (jsdom or extreme cases) — give up silently.
      });
    });
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          applyIntent(userIntent);
        } else {
          const video = videoRef.current;
          if (!video) return;
          video.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
    // applyIntent is stable enough; userIntent is the relevant dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIntent]);

  function toggleSound(): void {
    const nextIntent: SoundIntent = muted ? "sound-on" : "muted";
    setUserIntent(nextIntent);
    applyIntent(nextIntent);
  }

  return (
    <section ref={sectionRef} className="sizzle-reel" aria-label="Sizzle reel">
      <video
        ref={videoRef}
        className="sizzle-reel-video"
        src={`${srcPrefix}assets/video/sizzle-reel.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <button
        type="button"
        className="sizzle-reel-sound-toggle"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
      >
        {muted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
      </button>
    </section>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

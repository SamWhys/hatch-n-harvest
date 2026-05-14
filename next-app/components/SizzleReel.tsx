export function SizzleReel({ srcPrefix = "" }: { srcPrefix?: string }) {
  return (
    <section className="sizzle-reel" aria-label="Sizzle reel">
      <video
        className="sizzle-reel-video"
        src={`${srcPrefix}assets/video/sizzle-reel.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </section>
  );
}

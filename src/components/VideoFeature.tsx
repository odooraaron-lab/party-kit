// A video section for a product page. Shows the video once one is set in the config,
// and a clearly marked placeholder until then.
export function VideoFeature({ src, poster, youtubeId, captions, title, text, loop = false }: {
  src: string; poster: string; youtubeId: string; captions: string; title: string; text: string; loop?: boolean;
}) {
  const hasVideo = Boolean(src || youtubeId);
  return (
    <section className="section video-feature" id="video" aria-labelledby="video-title">
      <div className="video-copy">
        <h2 id="video-title">{title}</h2>
        <p className="muted">{text}</p>
      </div>
      <div className="video-frame">
        {src ? (
          <video controls playsInline preload="metadata" poster={poster || undefined} {...(loop ? { autoPlay: true, muted: true, loop: true } : {})}>
            <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
            {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
            Your browser can’t play this video.
          </video>
        ) : youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?rel=0&modestbranding=1`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder">
            <span className="video-play" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </span>
            <b>[YOUR VIDEO GOES HERE]</b>
            <span>Set it in <code>STORY_VIDEO</code> in src/lib/story.ts</span>
          </div>
        )}
      </div>
      {!hasVideo && <span className="sr-only">Video coming soon</span>}
    </section>
  );
}

import React, { useRef, useState } from 'react';

export default function VideoCard({ src, poster, caption }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
    }
  };

  return (
    <figure className="video-card">
      <div
        className="video-card-inner"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="video-card-player"
        />
        <div className={`video-card-overlay${playing ? ' video-card-overlay--hidden' : ''}`}>
          <svg className="video-play-icon" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.35)" />
            <polygon points="10,8 17,12 10,16" fill="white" />
          </svg>
        </div>
      </div>
      {caption && <figcaption className="work-img-caption">{caption}</figcaption>}
    </figure>
  );
}

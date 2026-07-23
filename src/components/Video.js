"use client";

import { useContext, useRef } from "react";
import { UserContext } from "@/components/UserProvider";
import { markAsWatched } from "@/lib/getWatched/watched";

const WATCHED_THRESHOLD = 0.5;

const Video = ({ url, subtitle, movieSlug }) => {
  const { user } = useContext(UserContext);
  const hasMarkedWatched = useRef(false);

  function handleTimeUpdate(e) {
    if (hasMarkedWatched.current || !user || !movieSlug) return;

    const { currentTime, duration } = e.target;
    if (!duration) return;

    if (currentTime / duration >= WATCHED_THRESHOLD) {
      hasMarkedWatched.current = true;
      markAsWatched(movieSlug, user).catch(() => {
        hasMarkedWatched.current = false;
      });
    }
  }

  return (
    <video
      controls
      controlsList="nodownload"
      className="w-full h-full"
      onTimeUpdate={handleTimeUpdate}
    >
      <source src={url} type="video/mp4" />
      <track
        label="Subtítulos"
        kind="subtitles"
        crossOrigin="anonymous"
        src={subtitle}
        srcLang="es"
        default
      />
    </video>
  );
};

export default Video;

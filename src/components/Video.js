const Video = ({ url, subtitle }) => {
  return (
    <video
      controls
      controlsList="nodownload"
      className="w-full h-full"
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

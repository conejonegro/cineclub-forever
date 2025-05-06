

const Video = ({url, subtitle}) => {

    return (
      <>
        <video controls controlsList="nodownload" >
          <source src={url} type="video/mp4" preload="auto" width="300" height="150" data-setup="{}"  />
          <track 
          label="Subtitulos" 
          kind="subtitles"
          crossOrigin="anonymous"
          src={subtitle}  
          srcLang="es"  
          default/>
          Sorry, your browser doesn't support videos.
        </video>
       
      </>
    );
  };
  
export default Video;
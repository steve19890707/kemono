import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Puff } from "react-loader-spinner";
import Hls from "hls.js";

const StyledHLSVideo = styled.video``;

const StyledFatalErrorTip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: #dedede;
    margin-right: 10px;
  }
`;
const FatalErrorTip = () => {
  return (
    <StyledFatalErrorTip>
      <span>影片編碼中... 請稍候</span>
      <Puff color="#4fa94d" width={40} height={40} />
    </StyledFatalErrorTip>
  );
};

export const HLSVideo = ({ id, src, isControls = false, className }) => {
  const videoRef = useRef();
  const [videoFatalError, setVideoFatalError] = useState(false);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (Hls.isSupported() && src && !videoFatalError) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setVideoFatalError(true);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }
      });
    }
  }, [src, videoFatalError]);
  useEffect(() => {
    if (videoFatalError) {
      const timeout = setTimeout(() => {
        setVideoFatalError(false);
        return () => clearTimeout(timeout);
      }, 8000);
    }
  }, [videoFatalError]);
  // for un supported
  const VideoComp = useCallback(() => {
    return src ? (
      Hls.isSupported() ? (
        <StyledHLSVideo
          id={`video-${id}`}
          className={className}
          ref={videoRef}
          controls={isControls}
          crossOrigin="anonymous"
          alt=""
        />
      ) : (
        <StyledHLSVideo
          id={`video-${id}`}
          src={src}
          controls={isControls}
          crossOrigin="anonymous"
          alt=""
        />
      )
    ) : (
      <></>
    );
  }, [id, className, src, isControls]);
  return videoFatalError ? <FatalErrorTip /> : <VideoComp />;
};

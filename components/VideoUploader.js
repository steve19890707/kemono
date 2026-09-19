import { useState } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import { getData } from "../common-lib/lib";
import noop from "lodash.noop";
// icons
import { FiAlertTriangle } from "react-icons/fi";
import { RiVideoUploadFill } from "react-icons/ri";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { IoPlayForwardSharp, IoPlayBackSharp } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GoUnmute } from "react-icons/go";
// component
import { HLSVideo } from "./HLSVideo";
// api
import { apiPostMediaUpload, apiUpdateAction } from "../pages/api";

const StyledVideoUploader = styled.div`
  ol,
  ul,
  li {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
  }
  width: 100%;
  margin-top: 65px;
  .container {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }
  .uploade-loder {
    position: relative;
    width: 450px;
    height: 300px;
    border-radius: 5px;
    border: 1px dashed #afafaf;
    background-color: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .uploade-loder .loader-inset {
    text-align: center;
    .progress {
      margin-top: 10px;
      color: #4caf50;
    }
  }
  .type {
    display: inline-block;
    padding: 12px 16px;
    border-radius: 5px 5px 0 0;
    background-color: #efefef;
  }
  label {
    position: relative;
    width: 450px;
    height: 300px;
    display: block;
    border-radius: 5px;
    border: 1px dashed #afafaf;
    background-color: #fbfbfb;
    z-index: 1;
    overflow: scroll;
    &:hover,
    &.isDrag {
      background-color: #efefef;
      .re-update-title {
        opacity: 1;
      }
    }
  }
  input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: pointer;
  }
  .current-video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    height: 85%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    video {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .re-update-title {
    opacity: 0;
    position: sticky;
    top: 235px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    z-index: 2;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 13px;
    color: #383838;
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    &.isDrag {
      opacity: 1;
    }
  }
  .svg-RiVideoUploadFill {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 90px;
    height: 90px;
    transform: translate(-50%, -50%);
    fill: #383838;
  }
  .update-title {
    position: absolute;
    width: 100%;
    text-align: center;
    color: #383838;
    top: 66%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .operation {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 470px);
    box-sizing: border-box;
    padding-top: 20px;
  }
  .svg-FiAlertTriangle {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
  .operation .tips li {
    display: flex;
    font-size: 14px;
    margin-bottom: 10px;
    color: #ff4040;
  }
  .btns {
    display: inline-flex;
    flex-direction: column;
  }
  .btns button {
    padding: 10px 0;
    border-radius: 5px;
    border: 1px solid #afafaf;
    cursor: pointer;
    &.capture {
      max-width: 140px;
      margin-bottom: 12px;
    }
    &.clear {
      max-width: 70px;
      border: 1px solid #afafaf;
      background-color: #fff;
    }
  }
  .video-controls {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 12px;
    max-width: 210px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
      fill: #383838;
      &.isMute {
        opacity: 0.5;
      }
    }
  }
`;

export default function VideoUploader({
  video = "",
  className = "",
  type = "video",
  title = "",
  id = "",
  setVideoUrl = noop,
}) {
  const authorization = useSelector((state) => state.props.authorization);
  const [isDrag, setIsDrag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [dataOnProgress, setDataOnProgress] = useState(0);
  // capture data config
  const canvas = document.createElement("canvas");
  const downloadCapture = (src) => {
    const download = document.createElement("a");
    download.href = src.replace(
      /^data:image\/[^;]/,
      "data:application/octet-stream"
    );
    download.download = "capture.png";
    download.click();
  };
  const capture = (videoDom) => {
    if (!videoDom) {
      alert("截圖無效! 請確認影片是否上傳!");
      return;
    }
    canvas.width = videoDom.videoWidth;
    canvas.height = videoDom.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoDom, 0, 0, videoDom.videoWidth, videoDom.videoHeight);
    const dataUrl = canvas.toDataURL("image/png");
    downloadCapture(dataUrl);
  };
  const vidAction = (action) => {
    const vid = document.getElementById(`video-upload-${id}`);
    if (vid) {
      switch (action) {
        case "play":
          vid.play();
          break;
        case "pause":
          vid.pause();
          break;
        case "muted":
          setVideoMuted((prev) => !prev);
          vid.muted = !vid.muted;
          break;
        case "fullscreen":
          vid.requestFullscreen();
          break;
        case "capture":
          capture(vid);
          break;
        case "playForward":
          vid.currentTime += 5;
          break;
        case "playBack":
          vid.currentTime -= 5;
          break;
        default:
          break;
      }
    }
  };
  return (
    <StyledVideoUploader className={className}>
      {title && <div className="type">{title}</div>}
      <div className="container">
        {isUploading ? (
          <div className="uploade-loder">
            <div className="loader-inset">
              <Oval
                color="#4fa94d"
                ariaLabel="oval-loading"
                width={80}
                height={80}
              />
              <div className="progress">{dataOnProgress}% </div>
            </div>
          </div>
        ) : (
          <label
            className={cx({ isDrag: isDrag })}
            htmlFor={`file-upload-${id}`}
            onDragOver={() => !isDrag && setIsDrag(true)}
            onDrop={() => setIsDrag(false)}
            onDragLeave={() => setIsDrag(false)}
          >
            {video ? (
              <>
                <div className="current-video">
                  <HLSVideo id={`upload-${id}`} src={video} />
                </div>
                <div className="re-update-title">點擊 或 拖曳更換檔案</div>
              </>
            ) : (
              <>
                <RiVideoUploadFill className="svg-RiVideoUploadFill" />
                <div className="update-title">點擊 或 將檔案拖曳到此處上傳</div>
              </>
            )}
            <input
              id={`file-upload-${id}`}
              type="file"
              onChange={(e) => {
                setIsUploading(true);
                const videoData = new FormData();
                videoData.append("file", e.target.files[0]);
                videoData.append("type", type);
                // video upload
                apiUpdateAction({
                  type: "axios",
                  promise: apiPostMediaUpload(
                    videoData,
                    authorization,
                    "video",
                    setDataOnProgress
                  ),
                  success: (response) => {
                    setVideoUrl(getData(response, ["result"], {}));
                    setIsUploading(false);
                  },
                  unsuccessfully: () => {
                    setIsUploading(false);
                    setDataOnProgress(0);
                  },
                });
              }}
            />
          </label>
        )}
        <div className="operation">
          <ul className="tips">
            <li>
              <FiAlertTriangle className="svg-FiAlertTriangle" />
              <span>檔案大小不可超過300MB</span>
            </li>
            <li>
              <FiAlertTriangle className="svg-FiAlertTriangle" />
              <span>檔案格式限制為 .mp4</span>
            </li>
            <li>
              <FiAlertTriangle className="svg-FiAlertTriangle" />
              <span>上傳過程中請勿切換/關閉頁面</span>
            </li>
          </ul>
          <div className="btns">
            {getData(video, ["url", "link"]) && (
              <>
                <button
                  className="capture"
                  onClick={() => vidAction("capture")}
                >
                  影片預覽 截圖
                </button>
                <div className="video-controls">
                  <BsFillPlayFill onClick={() => vidAction("play")} />
                  <BsFillPauseFill onClick={() => vidAction("pause")} />
                  <IoPlayBackSharp onClick={() => vidAction("playBack")} />
                  <IoPlayForwardSharp
                    onClick={() => vidAction("playForward")}
                  />
                  <GoUnmute
                    className={cx({ isMute: videoMuted })}
                    onClick={() => vidAction("muted")}
                  />
                  <BiFullscreen onClick={() => vidAction("fullscreen")} />
                </div>
              </>
            )}
            <button
              className="clear"
              onClick={() => {
                setVideoUrl("");
                setIsUploading(false);
              }}
            >
              清除
            </button>
          </div>
        </div>
      </div>
    </StyledVideoUploader>
  );
}

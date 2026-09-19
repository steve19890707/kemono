import "react-image-crop/dist/ReactCrop.css";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../common-lib/lib";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import styled from "styled-components";
import noop from "lodash.noop";
import { Oval } from "react-loader-spinner";
// compoments
import UpdateAndCancel from "../UpdateAndCancel";
// api
import { apiPostMediaUpload, apiUpdateAction } from "../../pages/api";

const StyledCropPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 101;
  .uploade-loder {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000066;
    z-index: 999;
  }
  .crop-popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000066;
  }
  .crop-popup-content {
    position: relative;
    width: 90%;
    height: calc(100vh - 100px);
    margin: 50px auto;
    background-color: #fff;
    border-radius: 6px;
    overflow: auto;
  }
  .crop-title {
    margin: 75px 10% 10px 10%;
  }
  .crop-preview-size {
    margin: 0px 10% 10px 10%;
  }
  .crop-content {
    width: 80%;
    margin: 0 10%;
    box-sizing: border-box;
    padding: 25px 30px;
    border: 1px dashed #000;
    background-color: #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .react-crop {
    margin: 0 auto;
  }
  .preview {
    margin: 50px 10%;
  }
  .preview-title {
    margin-bottom: 20px;
  }
  .preview-picture {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export default function CropPopup({
  src = "",
  fileNameType = "",
  authorization = "",
  imgSetIsUploading = noop,
  cancelPopup = noop,
  setPicture = noop,
}) {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState("");
  const [completedCrop, setCompletedCrop] = useState("");
  const [previewCanvasSize, setPreviewCanvasSize] = useState({
    width: "",
    height: "",
  });
  const [scale] = useState(1);
  const [rotate] = useState(0);
  const [aspect, setAspect] = useState(1);
  const centerAspectCrop = (
    mediaWidth = Number(),
    mediaHeight = Number(),
    aspect = Number()
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };
  const matchPreviewSize = (pxCropWidth = 1, pxCropHeight = 1) => {
    const pixelRatio = window?.devicePixelRatio;
    const scaleX = imgRef?.current.naturalWidth / imgRef?.current.width;
    const scaleY = imgRef?.current.naturalHeight / imgRef?.current.height;
    const width = Math.ceil(Math.floor(pxCropWidth * scaleX * pixelRatio) / 2);
    const height = Math.ceil(
      Math.floor(pxCropHeight * scaleY * pixelRatio) / 2
    );
    return {
      w: width,
      h: height,
    };
  };
  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const previewSize = matchPreviewSize(width, height);
      setCrop(centerAspectCrop(width, height, aspect));
      setPreviewCanvasSize({
        width: Math.ceil(previewSize.h),
        height: Math.ceil(previewSize.h),
      });
    }
  };
  const onUpdateImage = function () {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    setIsUploading(true);
    imgSetIsUploading(true);
    const dataurl = previewCanvas.toDataURL("image/png");
    const file = toFormData(dataurl, fileNameType);
    // img upload
    apiUpdateAction({
      type: "axios",
      promise: apiPostMediaUpload(file, authorization),
      success: (response) => {
        setPicture(getData(response, ["result"], {}));
        setIsUploading(false);
        imgSetIsUploading(false);
        cancelPopup(false);
      },
      unsuccessfully: () => {
        setIsUploading(false);
        imgSetIsUploading(false);
      },
    });
  };
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
      setAspect(undefined);
    }
  }, [completedCrop, scale, rotate]);
  return (
    <StyledCropPopup>
      <div className="crop-popup-background">
        <div className="crop-popup-content">
          {isUploading && (
            <div className="uploade-loder">
              <Oval
                color="#4fa94d"
                ariaLabel="oval-loading"
                width={80}
                height={80}
              />
            </div>
          )}
          <div className="crop-title">請於以下範圍裁切圖片</div>
          <div className="crop-preview-size">
            目前裁切尺寸(單位PX)：
            <span style={{ color: "#ff5722" }}>
              {previewCanvasSize.width}x{previewCanvasSize.height}
            </span>
          </div>
          <div className="crop-content">
            <ReactCrop
              className="react-crop"
              crop={crop}
              aspect={aspect}
              minWidth={1}
              minHeight={1}
              onChange={(pxCrop, percentCrop) => {
                const previewSize = matchPreviewSize(
                  pxCrop.width,
                  pxCrop.height
                );
                setPreviewCanvasSize({
                  width: previewSize.w,
                  height: previewSize.h,
                });
                setCrop(percentCrop);
              }}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={src}
                alt=""
                onLoad={onImageLoad}
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>
          {!!completedCrop && (
            <div className="preview">
              <div className="preview-title">裁切預覽：</div>
              <div className="preview-picture">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
            </div>
          )}
          <UpdateAndCancel
            updateText={"裁切"}
            dataUpdate={() => onUpdateImage()}
            cancelPopup={() => cancelPopup()}
          />
        </div>
      </div>
    </StyledCropPopup>
  );
}

const base64ToBlob = (base64Data) => {
  const dataArr = base64Data.split(",");
  const imageType = dataArr[0].match(/:(.*?);/)[1];
  const textData = window.atob(dataArr[1]);
  const arrayBuffer = new ArrayBuffer(textData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i);
  }
  return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)];
};
const toFormData = (base64Data, fileNameType) => {
  const [imageBlob, imageType] = base64ToBlob(base64Data);
  const formData = new FormData();
  formData.append("file", imageBlob, `${Date.now()}.${imageType}`);
  formData.append("type", fileNameType);
  return formData;
};

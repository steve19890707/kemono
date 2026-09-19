import { useState } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import { commonStyles } from "../styles/styles";
import { getData } from "../common-lib/lib";
import noop from "lodash.noop";
// icons
import { BiImageAdd } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
// compoments
import CropPopup from "./ReactCrop/CropPopup";
import OpenImageFilePopup from "./OpenImageFile";
// api
import { apiPostMediaUpload, apiUpdateAction } from "../pages/api";

const StyledImageUploader = styled.div`
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
  margin-top: 50px;
  .container {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }
  .uploade-loder {
    position: relative;
    width: 320px;
    height: 200px;
    border-radius: 5px;
    border: 1px dashed #000;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .type {
    display: inline-block;
    padding: 12px 16px;
    border-radius: 5px 5px 0 0;
    background-color: ${commonStyles.feature3};
    color: #fff;
  }
  label {
    position: relative;
    width: 320px;
    height: 200px;
    display: block;
    border-radius: 5px;
    border: 1px dashed #000;
    background-color: #fff;
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
  .current-img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 85%;
    transform: translate(-50%, -50%);
  }
  .re-update-title {
    opacity: 0;
    position: sticky;
    top: 155px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    z-index: 2;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 13px;
    color: #202020;
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    &.isDrag {
      opacity: 1;
    }
  }
  .svg-BiImageAdd {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 95px;
    height: 95px;
    transform: translate(-50%, -50%);
    fill: #000;
  }
  .update-title {
    position: absolute;
    width: 100%;
    text-align: center;
    color: #000;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .operation {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 340px);
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
    color: red;
  }
  .operation button {
    padding: 10px 0;
    border-radius: 5px;
    width: 70px;
    border: 1px solid #afafaf;
    background-color: #fff;
    cursor: pointer;
  }
  .btns-area {
    display: flex;
    align-items: center;
    button {
      margin-right: 5px;
    }
  }
  .caption-list {
    width: 320px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.image-file-only {
      flex-direction: row-reverse;
      margin-bottom: 5px;
    }
  }
  .open-image-file-btn,
  .crop-btn-type2 {
    display: inline-block;
    padding: 4px 12px;
    cursor: pointer;
  }
  .crop-btn-type2 {
    margin-right: 5px;
  }
`;

export default function ImageUploader({
  className = "",
  picture = "",
  // singleImg = false,
  type = "",
  title = "",
  id = "",
  imgSize = "",
  imageFile = true,
  cropBtnType2 = false,
  setPicture = noop,
}) {
  const authorization = useSelector((state) => state.props.authorization);
  const [isDrag, setIsDrag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isCrop, setIscrop] = useState(false);
  const [isImageFile, setIsImageFile] = useState(false);
  return (
    <>
      <StyledImageUploader className={className}>
        <div
          className={`caption-list ${!title && imageFile && "image-file-only"}`}
        >
          {title && <div className="type">{title}</div>}
          {imageFile && (
            <button
              className="open-image-file-btn"
              onClick={() => setIsImageFile(true)}
            >
              更換已上傳圖片
            </button>
          )}
          {!imgError && picture && cropBtnType2 && (
            <button className="crop-btn-type2" onClick={() => setIscrop(true)}>
              裁切
            </button>
          )}
        </div>
        <div className="container">
          {isUploading ? (
            <div className="uploade-loder">
              <Oval
                color="#4fa94d"
                ariaLabel="oval-loading"
                width={80}
                height={80}
              />
            </div>
          ) : (
            <label
              className={cx({ isDrag: isDrag })}
              htmlFor={`file-upload-${id}`}
              onDragOver={() => !isDrag && setIsDrag(true)}
              onDrop={() => setIsDrag(false)}
              onDragLeave={() => setIsDrag(false)}
            >
              {!imgError && picture ? (
                <>
                  <img
                    onError={() => setImgError(true)}
                    className="current-img"
                    src={picture}
                  />
                  <div className="re-update-title">點擊 或 拖曳更換檔案</div>
                </>
              ) : (
                <>
                  <BiImageAdd className="svg-BiImageAdd" />
                  <div className="update-title">
                    點擊 或 將檔案拖曳到此處上傳
                  </div>
                </>
              )}
              <input
                id={`file-upload-${id}`}
                type="file"
                onChange={(e) => {
                  setIsUploading(true);
                  const imageData = new FormData();
                  imageData.append("file", e.target.files[0]);
                  imageData.append("type", type);
                  // img upload
                  apiUpdateAction({
                    type: "axios",
                    promise: apiPostMediaUpload(imageData, authorization),
                    success: (response) => {
                      setPicture(getData(response, ["result"], {}));
                      setIsUploading(false);
                    },
                    unsuccessfully: () => {
                      setIsUploading(false);
                    },
                  });
                }}
              />
            </label>
          )}
          <div className="operation">
            <ul className="tips">
              <li>
                <span>圖片路徑：{type}</span>
              </li>
              <li>
                <FiAlertTriangle className="svg-FiAlertTriangle" />
                <span>檔案大小不可超過1MB</span>
              </li>
              <li>
                <FiAlertTriangle className="svg-FiAlertTriangle" />
                <span>檔案格式限制為 .jpg .jpeg .png .gif</span>
              </li>
              {imgSize && (
                <li>
                  <FiAlertTriangle className="svg-FiAlertTriangle" />
                  <span>建議圖片尺寸:{imgSize}</span>
                </li>
              )}
            </ul>
            <div className="btns-area">
              <button
                onClick={() => {
                  setPicture({
                    url: "",
                    file_name: "",
                  });
                  setIsUploading(false);
                }}
              >
                清除
              </button>
              {!imgError && picture && (
                <button onClick={() => setIscrop(true)}>裁切</button>
              )}
            </div>
          </div>
        </div>
      </StyledImageUploader>
      {isCrop && (
        <CropPopup
          src={picture}
          fileNameType={type}
          authorization={authorization}
          imgSetIsUploading={setIsUploading}
          cancelPopup={() => setIscrop(false)}
          setPicture={(props) => setPicture(props)}
        />
      )}
      {isImageFile && (
        <OpenImageFilePopup
          src={picture}
          fileNameType={type}
          authorization={authorization}
          imgSetIsUploading={setIsUploading}
          cancelPopup={() => setIsImageFile(false)}
          setPicture={(props) => setPicture(props)}
        />
      )}
    </>
  );
}

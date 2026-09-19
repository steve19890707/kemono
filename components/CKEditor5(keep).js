import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import styled from "styled-components";
import cx from "classnames";
import { Oval } from "react-loader-spinner";
import { getData } from "../common-lib/lib";
// icons
import { FiAlertTriangle } from "react-icons/fi";
// reducer
import { setTemporaryText } from "../reducer/props";
// api
import { apiPostMediaUpload, apiUpdateAction } from "../pages/api";

const StyledCKEditor = styled.div`
  position: relative;
  .uploade-loder {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #0000009e;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .file-tip {
    font-size: 13px;
    color: red;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    svg {
      margin-right: 5px;
    }
  }
  .document-editor &.eventnone {
    pointer-events: none;
  }
  .tip-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    .sub {
      font-size: 18px;
      color: #fff;
      margin-top: 10px;
    }
  }
  .ck-button__label {
    font-size: 16px !important;
  }
  .ck-editor__editable {
    min-height: 300px;
  }
`;

export default function CKEditor5({ content = "", viewportOffsetTop = 146 }) {
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    dispatch(setTemporaryText(content));
  }, []);
  return (
    <StyledCKEditor>
      {isUploading && (
        <div className="uploade-loder">
          <div className="tip-content">
            <Oval
              color="#fff"
              ariaLabel="oval-loading"
              width={100}
              height={100}
            />
            <div className="sub">圖片資料處理中 請稍後...</div>
          </div>
        </div>
      )}
      <div className={cx("document-editor", { eventnone: isUploading })}>
        <div className="file-tip">
          <FiAlertTriangle />
          <span>圖片上傳 檔案大小不可超過500MB</span>
        </div>
        <CKEditor
          editor={Editor}
          config={{
            fontColor: ckeditorColors,
            fontSize: ckeditorFontSize,
            placeholder: "請輸入內容",
            ui: {
              viewportOffset: {
                top: viewportOffsetTop,
              },
            },
          }}
          data={content}
          onChange={(event, editor) => {
            const focusInput = document.getElementById("focus");
            const data = editor.getData();
            if (
              (!!~data.indexOf("data:image/png;base64") ||
                !!~data.indexOf("data:image/jpeg;base64") ||
                !!~data.indexOf("data:image/gif;base64")) &&
              !!~data.indexOf(`<figure class="image">`)
            ) {
              setIsUploading(true);
              focusInput.focus();
              const base64 = splitBase64ImgData(data);
              if (
                !~base64.indexOf("<") &&
                !~base64.indexOf(">") &&
                !~base64.indexOf('"')
              ) {
                const file = toFormData(base64, "ckeditor");
                // img upload
                apiUpdateAction({
                  type: "axios",
                  promise: apiPostMediaUpload(file, authorization),
                  success: (response) => {
                    const result = getData(response, ["result"], {});
                    const src = `${getData(result, ["url"])}${getData(result, [
                      "file_name",
                    ])}`;
                    const newData = data.replace(base64, src);
                    editor.setData(newData);
                    dispatch(setTemporaryText(newData));
                    setIsUploading(false);
                  },
                  unsuccessfully: () => {
                    setIsUploading(false);
                  },
                });
              }
            } else {
              dispatch(setTemporaryText(data));
            }
          }}
        />
      </div>
      <input
        id="focus"
        style={{ opacity: "0", width: 0, height: 0, border: 0 }}
      />
    </StyledCKEditor>
  );
}

const getBase64Log = (content = "", keyfront = "", keyEnd = "") => {
  const a = content.split(keyfront);
  const b = a[1].split(keyEnd);
  const c = b[0].split(`src="`);
  const d = c[1].split(`" width=`);
  return d[0];
};
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
const splitBase64ImgData = (content = "") => {
  const keyfront = '<figure class="image">';
  const keyEnd = "</figure>";
  const base64 = getBase64Log(content, keyfront, keyEnd);
  return base64;
};
const ckeditorColors = {
  colors: [
    { color: "#f44336", label: "f44336" },
    { color: "#ff9800", label: "ff9800" },
    { color: "#ffc107", label: "ffc107" },
    { color: "#8bc34a", label: "8bc34a" },
    { color: "#03a9f4", label: "03a9f4" },
    { color: "#673ab7", label: "673ab7" },
    { color: "#9c27b0", label: "9c27b0" },
    { color: "#fd7dd6", label: "fd7dd6" },
    { color: "#00bcd4", label: "00bcd4" },
    { color: "#ffff1a", label: "ffff1a" },
    { color: "#ffd542", label: "ffd542" },
    { color: "#ffd648", label: "ffd648" },
    { color: "#fff", label: "fff" },
    { color: "#c3c3c3", label: "c3c3c3" },
    { color: "#795548", label: "795548" },
    { color: "#000", label: "000" },
  ],
};

const ckeditorFontSize = {
  options: [8, 10, 12, 14, 16, 18, 20, 28, 36, 48, 72],
};

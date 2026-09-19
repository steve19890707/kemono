import "quill/dist/quill.snow.css";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuill } from "react-quilljs";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import { getData } from "../common-lib/lib";
// icons
import { FiAlertTriangle } from "react-icons/fi";
// reducer
import { setTemporaryText } from "../reducer/props";
// listener
import { Mousedown } from "../common-lib/hooks";
// api
import { apiPostMediaUpload, apiUpdateAction } from "../pages/api";
import { commonStyles } from "../styles/styles";

const StyledQuill = styled.div`
  position: relative;
  width: 100%;
  .ql-toolbar {
  }
  .ql-editor {
  }
  .quill-title {
    margin: 25px 0 20px 0;
    font-size: 18px;
  }
  .ql-editor {
    min-height: 300px;
  }
  .ql-snow .ql-tooltip {
    transform: translate(50%, -10px);
  }
  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }
  .ql-customize-formats {
    font-size: 13px;
    font-weight: bold;
    /* color: ; */
    cursor: pointer;
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
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #00000050;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    span {
      margin-left: 10px;
      color: #fff;
    }
  }
`;

const StyledAddLinkLocalVideoBtn = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  border-radius: 5px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  font-size: 13px;
  border: 1px solid ${commonStyles.borderColor};
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  input {
    padding: 5px;
    margin-right: 10px;
  }
  button {
    color: #06c;
    padding: 4px 6px;
    cursor: pointer;
  }
`;
const AddLinkLocalVideoBtn = ({ quill, setLinkVideoBtnStatus }) => {
  const urlInputRef = useRef(null);
  Mousedown((e) => {
    const videoUrlEdit = document.getElementById("video-url-edit");
    if (videoUrlEdit && !videoUrlEdit.contains(e.target)) {
      setLinkVideoBtnStatus(false);
    }
  });
  return (
    <StyledAddLinkLocalVideoBtn id="video-url-edit">
      <div>影片連結：</div>
      <input ref={urlInputRef} placeholder="請輸入網址" />
      <button
        onClick={() => {
          const createLink = `<p class="m3u8Video"><% ${urlInputRef.current.value} %></p>`;
          if (urlInputRef.current.value) {
            quill.root.innerHTML += createLink;
          }
          setLinkVideoBtnStatus(false);
        }}
      >
        確定
      </button>
    </StyledAddLinkLocalVideoBtn>
  );
};

export default function Quill({
  title = "",
  content = "",
  placeholder = "請輸入內容",
  // setContent = noop,
}) {
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const [LinkVideoBtnStatus, setLinkVideoBtnStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [staticContent, setStaticContent] = useState(content);
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["code-block"],
        ["clean"],
      ],
    },
    placeholder: placeholder,
    theme: "snow",
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "align",
      "list",
      "indent",
      "size",
      "header",
      "link",
      "image",
      "video",
      "color",
      "background",
      "code-block",
      "clean",
    ],
  });
  const createLocalVideoButton = () => {
    const toolbar = document.querySelector(".ql-toolbar");
    const btn = document.createElement("span");
    btn.innerHTML = "站內影片(m3u8)";
    btn.classList.add("ql-customize-formats");
    btn.setAttribute("id", "customize-video");
    btn.addEventListener("click", () => setLinkVideoBtnStatus((prev) => !prev));
    toolbar.append(btn);
  };
  useEffect(() => {
    // Insert Image(selected by user) to quill
    const insertToEditor = (url, type) => {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, type, url);
    };
    // Open Dialog to select Image/video File
    const selectLocalFile = (type = "image") => {
      const sendType = () => {
        switch (type) {
          case "video":
            return "video-quill";
          default:
            return "news-quill";
        }
      };
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", `${type}/*`);
      input.click();
      input.onchange = () => {
        const fileData = new FormData();
        fileData.append("file", input.files[0]);
        fileData.append("type", sendType());
        setIsUploading(true);
        apiUpdateAction({
          type: "axios",
          promise: apiPostMediaUpload(fileData, authorization),
          success: (response) => {
            insertToEditor(
              `${getData(response, ["result", "url"])}${getData(response, [
                "result",
                "file_name",
              ])}`,
              type
            );
            setIsUploading(false);
          },
          unsuccessfully: () => {
            setIsUploading(false);
          },
        });
      };
    };
    if (quill) {
      quill.setContents(quill.clipboard.convert(content));
      quill
        .getModule("toolbar")
        .addHandler("image", () => selectLocalFile("image"));
      quill.on("text-change", (delta, oldDelta, source) => {
        setStaticContent(quill.root.innerHTML);
      });
    }
  }, [content, quill, setStaticContent]);
  useEffect(() => {
    dispatch(setTemporaryText(staticContent));
  }, [staticContent]);
  useEffect(() => {
    if (!quill) {
      return;
    } else {
      createLocalVideoButton();
    }
    // quill.enable();
    // quill.disable();
  }, [quill]);
  useEffect(() => {
    if (quill && isUploading) {
      quill.disable();
    }
    if (quill && !isUploading) {
      quill.enable();
    }
  }, [quill, isUploading]);
  return (
    <StyledQuill>
      {isUploading && (
        <div className="loading">
          <Oval
            color="#4fa94d"
            ariaLabel="oval-loading"
            width={50}
            height={50}
          />
          <span>檔案上傳中請稍候...(傳輸過程中切勿關閉視窗)</span>
        </div>
      )}
      {title && <div className="quill-title">{title}:</div>}
      <div className="file-tip">
        <FiAlertTriangle />
        <span>圖片上傳 檔案大小不可超過500MB</span>
      </div>
      <div ref={quillRef} />
      {LinkVideoBtnStatus && (
        <AddLinkLocalVideoBtn
          quill={quill}
          setLinkVideoBtnStatus={setLinkVideoBtnStatus}
        />
      )}
    </StyledQuill>
  );
}

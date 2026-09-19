import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import styled from "styled-components";
// icons
import { FiAlertTriangle } from "react-icons/fi";
// reducer
import { setTemporaryText } from "../reducer/props";
// api
import { envHost } from "../pages/api";

const StyledCKEditor = styled.div`
  position: relative;
  font-family: "Arial, sans-serif" !important;
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
  .ck-content {
    background-color: #bdbdbd !important;
  }
  .ck.ck-dropdown__panel,
  .ck.ck-balloon-panel {
    z-index: 10000 !important;
  }
  .ck-button__label {
    font-size: 16px !important;
  }
  .ck-editor__editable {
    min-height: 300px;
  }
`;

export default function CKEditor5({
  content = "",
  viewportOffsetTop = 146,
  useMediaEmbed = false,
}) {
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const localAuthorization = localStorage.getItem("authorization") || "";
  useEffect(() => {
    dispatch(setTemporaryText(content));
  }, [content, dispatch]);

  const toolbarItems = useMemo(() => [
    "Heading",
    "|",
    "FindAndReplace",
    "FontColor",
    "FontSize",
    "Bold",
    "Underline",
    "Italic",
    "Alignment",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "ImageUpload",
    useMediaEmbed && "MediaEmbed",
    "Link",
    "BlockQuote",
    "Code",
    "insertTable",
    "SelectAll",
    "RemoveFormat",
    "Undo",
    "Redo",
  ].filter(Boolean), [useMediaEmbed]);
  return (
    <StyledCKEditor>
      <div className={"document-editor"}>
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
            simpleUpload: {
              uploadUrl: `${envHost()}/api/backend/upload/ckedit`, // 特例api ckedit專用
              // withCredentials: true,
              headers: {
                "X-CSRF-TOKEN": "CSRF-Token",
                Authorization: `Bearer ${
                  authorization ? authorization : localAuthorization
                }`,
              },
            },
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Paragraph",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "Heading 1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "Heading 2",
                  class: "ck-heading_heading2",
                },
                {
                  model: "heading3",
                  view: "h3",
                  title: "Heading 3",
                  class: "ck-heading_heading3",
                },
              ],
            },
            toolbar: toolbarItems,
            link: {
              addTargetToExternalLinks: true,
            },
          }}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            dispatch(setTemporaryText(data));
          }}
        />
      </div>
    </StyledCKEditor>
  );
}

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
  supportAllValues: true,
};

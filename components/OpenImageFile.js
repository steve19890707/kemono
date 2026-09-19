import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import noop from "lodash.noop";
import cx from "classnames";
import { Oval } from "react-loader-spinner";
import { getData } from "../common-lib/lib";
// compoments
import UpdateAndCancel from "./UpdateAndCancel";
import ConfirmPopup from "./Popup/Confirm";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiGetImageList,
  FetchGetHook,
  apiUpdateAction,
  apiDeleteImage,
} from "../pages/api";

const StyledOpenImageFilePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 101;
  .open-image-file-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000066;
  }
  .open-image-file-content {
    position: relative;
    width: 90%;
    height: calc(100vh - 100px);
    margin: 50px auto;
    background-color: #fff;
    border-radius: 6px;
    overflow: auto;
  }
  .uploade-loder {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px 0;
  }
  .images-list-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 12px 20px;
    border-bottom: 1px solid #dfdfdf;
  }
  .images-list {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .image-data-content {
    width: 25%;
    box-sizing: border-box;
    padding: 20px;
  }
  .image-preview {
    width: 100%;
    height: 200px;
    overflow: auto;
    border-radius: 6px;
    border: 5px solid transparent;
    background: #dfdfdf;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 100%;
    }
    &.selected {
      border: 5px solid #3f51b5;
    }
  }
  .tip {
    color: #3f51b5;
  }
  .subtitle {
    color: #989898;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }
  .no-image-tip {
    font-size: 18px;
    color: #9a9a9a;
    text-align: center;
    margin: 50px 0;
  }
`;
const updateArrayStatus = (list = [], key = 0) => {
  const array = [...list];
  const update = [];
  for (let i = 0; i < array.length; i++) {
    update.push({
      ...getData(array, [i], {}),
      status: key === i ? !getData(array, [i, "status"]) : false,
    });
  }
  return update;
};
export default function OpenImageFilePopup({
  src = "",
  fileNameType = "",
  authorization = "",
  imgSetIsUploading = noop,
  cancelPopup = noop,
  setPicture = noop,
}) {
  const dispatch = useDispatch();
  const [ListData, setListData] = useState([]);
  const [updateSrc, setUpdateSrc] = useState(src);
  const [deleteId, setDeleteId] = useState("");
  const [isDeletePopup, setIsDeletePopup] = useState(false);
  const {
    data: ImageListData,
    isLoading: ImageListIsLoading,
    mutate: ImageListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    query: `?path=citrus/${fileNameType}`,
    promise: apiGetImageList,
    success: (data) => {
      const dataArray = data || [];
      let array = [];
      for (let i = 0; i < dataArray.length; i++) {
        array.push({
          ...getData(dataArray, [i], {}),
          status: getData(dataArray, [i, "url"], "") === src ? true : false,
        });
        if (getData(dataArray, [i, "url"], "") === src) {
          setDeleteId(getData(dataArray, [i, "id"], ""));
        }
      }
      setListData(array);
      imgSetIsUploading(true);
    },
  });
  const parseImageSrc = (src = "", projectName = "citrus") => {
    const srcSplit = src.split(projectName);
    const data = {
      url: `${srcSplit[0]}`,
      file_name: `${projectName}${srcSplit[1]}`,
    };
    return data;
  };
  const onUpdateImage = () => {
    setPicture(parseImageSrc(updateSrc));
    cancelPopup();
    imgSetIsUploading(false);
  };
  return (
    <StyledOpenImageFilePopup>
      <div className="open-image-file-background">
        <div className="open-image-file-content">
          <div className="images-list-title">已上傳圖片列表(請選取後更換)</div>
          {ImageListIsLoading ? (
            <div className="uploade-loder">
              <Oval
                color="#4fa94d"
                ariaLabel="oval-loading"
                width={80}
                height={80}
              />
            </div>
          ) : (
            <div className="images-list">
              {ListData.map((val, key) => (
                <div key={key} className="image-data-content">
                  {getData(val, ["url"]) === src && (
                    <div className="tip">目前使用中</div>
                  )}
                  <div
                    className={cx("image-preview", {
                      selected: getData(val, ["status"]),
                    })}
                    onClick={() => {
                      setUpdateSrc(getData(val, ["url"]));
                      setDeleteId(getData(val, ["id"]));
                      !getData(val, ["status"]) &&
                        setListData(updateArrayStatus(ListData, key));
                    }}
                  >
                    <img alt="" src={getData(val, ["url"])} />
                  </div>
                  <div className="subtitle">
                    圖片上傳時間：{getData(val, ["updated_at"])}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!ImageListIsLoading && ImageListData.length === 0 && (
            <div className="no-image-tip">暫無圖片上傳記錄!</div>
          )}
          <UpdateAndCancel
            updateText={"更換"}
            useDelet={true}
            dataUpdate={() => onUpdateImage()}
            cancelPopup={() => {
              cancelPopup();
              imgSetIsUploading(false);
            }}
            deletPopup={() => setIsDeletePopup(true)}
          />
        </div>
      </div>
      {isDeletePopup && updateSrc && (
        <ConfirmPopup
          content={`確定要刪除圖片『${updateSrc}』嗎?<br/><span style="color:red">請留意是否為路徑『${fileNameType}』使用中的圖片，若誤刪請於7天內聯繫相關人員</span>
          `}
          dataUpdate={() => {
            if (src === updateSrc) {
              alert(`無法刪除『目前使用中』的圖片，請更換後再重新嘗試`);
            } else {
              dispatch(setLoader(true));
              apiUpdateAction({
                promise: apiDeleteImage(
                  { id: String(deleteId) },
                  authorization
                ),
                success: (response) => {
                  ImageListMutate();
                  dispatch(setLoader(false));
                  setIsDeletePopup(false);
                },
                unsuccessfully: () => {
                  dispatch(setLoader(false));
                },
              });
            }
          }}
          cancelPopup={() => setIsDeletePopup(false)}
        />
      )}
    </StyledOpenImageFilePopup>
  );
}

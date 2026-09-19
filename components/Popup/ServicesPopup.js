import { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { filterPopupType } from "../../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../../lib/static";
import { getData } from "../../common-lib/lib";
import Switch from "react-switch";
import noop from "lodash.noop";
// compoments
import Popup from "./Index";
import Input from "../Input";
import TextArea from "../TextArea";
import ImageUploader from "../ImageUploader";
import CheckBox from "../CheckBox";
import ConfirmPopup from "./Confirm";
import CommonLoader from "../CommonLoader";
// reducer
import { setLoader } from "../../reducer/props";
// api
import {
  apiPostServiceCreate,
  apiPutServiceUpdate,
  apiGetServiceDetail,
  apiUpdateAction,
  FetchGetHook,
} from "../../pages/api";

const StyledPopupContent = styled.div`
  .info-block {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .caption {
      min-width: 85px;
    }
    &.blank {
      padding-left: 85px;
    }
  }
  .switch-caption {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    .subtitle {
      font-size: 14px;
      color: #888888;
      margin-left: 10px;
    }
  }
  .check-list {
    padding-top: 25px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .check-box {
    width: 25%;
  }
  .props-tip {
    color: red;
    &.top {
      padding-bottom: 25px;
    }
  }
  .packge-imgUploader {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .packge {
      width: 50%;
      min-width: 550px;
    }
  }
`;

export default function ServicesPopup({
  lang = "",
  id = "",
  apiCreateSucces = noop,
  cancelPopup = noop,
}) {
  const dispatch = useDispatch();
  const popupType = useSelector((state) => state.props.popupType);
  const authorization = useSelector((state) => state.props.authorization);
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [blank, setBlank] = useState(false);
  const [iconImg, setIconImg] = useState("");
  const [img, setImg] = useState("");
  const [link, setLink] = useState("");
  const {
    // data: servicePopupData,
    isLoading: servicePopupIsLoading,
    mutate: servicePopupMutate,
  } = FetchGetHook({
    defaultDataType: {},
    resquestStoppen: popupType === "create" ? true : false,
    query: id,
    promise: apiGetServiceDetail,
    success: (data) => {
      setTitle(getData(data, ["title"]));
      setSubTitle(getData(data, ["sub_title"]));
      setDescription(getData(data, ["description"]));
      setStatus(getData(data, ["status"]));
      setBlank(getData(data, ["blank"]));
      setImg(getData(data, ["pic"]));
      setIconImg(getData(data, ["icon"]));
      setLink(getData(data, ["link"]));
    },
  });
  return (
    <>
      <Popup
        title={`服務項目(${filterPopupType(popupType)})-${langauge[lang]}`}
        updateText={popupType === "create" ? "新增" : "更新"}
        // secondPopupStatus={updatePopup}

        dataUpdate={() => setUpdatePopup(true)}
        cancelPopup={() => cancelPopup()}
      >
        <StyledPopupContent>
          {servicePopupIsLoading && popupType !== "create" ? (
            <CommonLoader />
          ) : (
            <>
              <div className="info-block">
                <div className="caption">狀態：</div>
                <Switch checked={status} onChange={(e) => setStatus(e)} />
              </div>
              <div className="props-tip top">
                ＊--- ⬇ 此區間資料為必填 ⬇ ---＊
              </div>
              <div className="info-block">
                <div className="caption">標題：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={title}
                  setKeyValue={setTitle}
                />
              </div>
              <div className="info-block">
                <div className="caption">英文標題：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={subTitle}
                  setKeyValue={setSubTitle}
                />
              </div>
              <div className="info-block">
                <div className="caption">連結：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={link}
                  setKeyValue={setLink}
                />
              </div>
              <div className="info-block blank">
                <CheckBox
                  checked={blank}
                  name={"另開視窗"}
                  onChange={(val) => setBlank(val)}
                />
              </div>
              <div className="info-block">
                <div className="caption">介紹文字：</div>
                <TextArea keyValue={description} setKeyValue={setDescription} />
              </div>
              <div className="props-tip">＊--- ⬆ 此區間資料為必填 ⬆ ---＊</div>
              <div className="packge-imgUploader">
                <ImageUploader
                  className="packge"
                  title="ICON"
                  type={`serviceicon-${langaugeTranslation(lang)}`}
                  imgSize={"275x275"}
                  picture={iconImg}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setIconImg(srcUpdate);
                  }}
                />
                <ImageUploader
                  className="packge"
                  title="圖片"
                  type={`service-${langaugeTranslation(lang)}`}
                  imgSize={"356x547"}
                  picture={img}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setImg(srcUpdate);
                  }}
                />
              </div>
            </>
          )}
        </StyledPopupContent>
      </Popup>
      {updatePopup && (
        <ConfirmPopup
          content={`確定${filterPopupType(popupType)}內容嗎？`}
          dataUpdate={() => {
            const update = {
              blank: blank,
              title: title,
              sub_title: subTitle,
              description: description,
              lang: langaugeTranslation(lang),
              link: link,
              pic: img,
              icon: iconImg,
              status: status,
            };
            dispatch(setLoader(true));
            apiUpdateAction({
              promise:
                popupType === "create"
                  ? apiPostServiceCreate(update, authorization)
                  : apiPutServiceUpdate(
                      {
                        ...update,
                        id: id,
                      },
                      authorization
                    ),
              success: (response) => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
                apiCreateSucces();
                servicePopupMutate();
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
            });
          }}
          cancelPopup={() => {
            setUpdatePopup(false);
          }}
        />
      )}
    </>
  );
}

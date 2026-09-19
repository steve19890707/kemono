import { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  filterPopupType,
  dateFormParsing,
  getDateFormString,
} from "../../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../../lib/static";
import { getData } from "../../common-lib/lib";
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
  apiGetTopNewsDetail,
  apiPostTopnewsCreate,
  apiPutTopnewsUpdate,
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
    &.space-top {
      margin-top: 20px;
    }
  }
  .column {
    margin: 0 10px 0 0;
  }
  .date-input input[type="date"]::-webkit-calendar-picker-indicator {
    width: 20px;
    height: 20px;
    background-image: url('data:image/svg+xml;utf8,<svg stroke="" fill="dodgerblue" stroke-width="0" viewBox="0 0 448 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>');
    cursor: pointer;
  }
  .props-tip {
    color: red;
    &.top {
      padding-bottom: 25px;
    }
    &.bottom {
      padding-top: 25px;
    }
  }
`;

export default function TopNewsPopup({
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
  const [date, setDate] = useState("");
  const [relaseDate, setRelaseDate] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(0);
  const [blank, setBlank] = useState(false);
  const [link, setLink] = useState("");
  const [img, setImg] = useState({
    src: "",
    alt: "",
  });
  const [icon, setIcon] = useState({
    src: "",
    alt: "",
  });
  const {
    // data: topnewsPopupData,
    isLoading: topnewsPopupIsLoading,
    mutate: topnewsPopupMutate,
  } = FetchGetHook({
    defaultDataType: {},
    resquestStoppen: popupType === "create" ? true : false,
    query: id,
    promise: apiGetTopNewsDetail,
    success: (data) => {
      const response = getData(data, [0], {});
      setTitle(getData(response, ["title"]));
      setRelaseDate(getDateFormString(getData(response, ["release_date"])));
      setDate(getDateFormString(getData(response, ["date"])));
      setDateRange({
        start: getDateFormString(getData(response, ["startTime"])),
        end: getDateFormString(getData(response, ["endTime"])),
      });
      setBlank(getData(response, ["blank"]));
      setStatus(getData(response, ["status"]));
      setDescription(getData(response, ["content"]));
      setLink(getData(response, ["link"]));
      setImg({
        src: getData(response, ["pic"]),
        alt: getData(response, ["pic_alt"]),
      });
      setIcon({
        src: getData(response, ["icon"]),
        alt: getData(response, ["icon_alt"]),
      });
    },
  });
  return (
    <>
      <Popup
        title={`彈跳廣告(${filterPopupType(popupType)})-${langauge[lang]}`}
        updateText={popupType === "create" ? "新增" : "更新"}
        // secondPopupStatus={updatePopup}

        dataUpdate={() => setUpdatePopup(true)}
        cancelPopup={() => cancelPopup()}
      >
        <StyledPopupContent>
          {topnewsPopupIsLoading && popupType !== "create" ? (
            <CommonLoader />
          ) : (
            <>
              <div className="info-block">
                <div className="caption">狀態：</div>
                <CheckBox
                  className="column"
                  checked={status === 2}
                  name={"永久啟用"}
                  onChange={(val) => setStatus(2)}
                />
                <CheckBox
                  className="column"
                  checked={status === 1}
                  name={"啟用區間"}
                  onChange={(val) => setStatus(1)}
                />
                <CheckBox
                  className="column"
                  checked={status === 0}
                  name={"關閉"}
                  onChange={(val) => setStatus(0)}
                />
              </div>
              <div className="info-block">
                <div className="caption">使用期間：</div>
                <Input
                  styles={{
                    minWidth: "unset",
                    width: "150px",
                    cursor: "pointer",
                  }}
                  className="date-input"
                  type="date"
                  keyValue={dateRange.start}
                  setKeyValue={(val) => {
                    setDateRange((prev) => {
                      return { ...prev, start: val };
                    });
                  }}
                />
                <span style={{ width: "30px", textAlign: "center" }}>至</span>
                <Input
                  styles={{
                    minWidth: "unset",
                    width: "150px",
                    cursor: "pointer",
                  }}
                  className="date-input"
                  type="date"
                  keyValue={dateRange.end}
                  setKeyValue={(val) => {
                    setDateRange((prev) => {
                      return { ...prev, end: val };
                    });
                  }}
                />
              </div>
              <div className="info-block">
                <div className="caption">發布日期：</div>
                <Input
                  styles={{
                    minWidth: "unset",
                    width: "150px",
                    cursor: "pointer",
                  }}
                  className="date-input"
                  type="date"
                  keyValue={relaseDate}
                  setKeyValue={(val) => setRelaseDate(val)}
                />
              </div>
              <div className="info-block">
                <div className="caption">廣告日期：</div>
                <Input
                  styles={{
                    minWidth: "unset",
                    width: "150px",
                    cursor: "pointer",
                  }}
                  className="date-input"
                  type="date"
                  keyValue={date}
                  setKeyValue={(val) => setDate(val)}
                />
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
                <div className="caption">廣告內文：</div>
                <TextArea keyValue={description} setKeyValue={setDescription} />
              </div>
              <div className="props-tip">＊--- ⬆ 此區間資料為必填 ⬆ ---＊</div>
              <ImageUploader
                title="廣告形象圖"
                type={`topnewsimg-${langaugeTranslation(lang)}`}
                imgSize={"617x543"}
                picture={img.src}
                setPicture={(res) => {
                  const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                    "file_name",
                  ])}`;
                  setImg((prev) => {
                    return { ...prev, src: srcUpdate };
                  });
                }}
              />
              <div className="info-block space-top">
                <div className="caption">圖片alt：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={img.alt}
                  setKeyValue={(val) =>
                    setImg((prev) => {
                      return {
                        ...prev,
                        alt: val,
                      };
                    })
                  }
                />
              </div>
              <ImageUploader
                title="廣告ICON"
                type={`topnewsicon-${langaugeTranslation(lang)}`}
                imgSize={"617x543"}
                picture={icon.src}
                setPicture={(res) => {
                  const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                    "file_name",
                  ])}`;
                  setIcon((prev) => {
                    return { ...prev, src: srcUpdate };
                  });
                }}
              />
              <div className="info-block space-top">
                <div className="caption">廣告ICON alt：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={icon.alt}
                  setKeyValue={(val) =>
                    setIcon((prev) => {
                      return {
                        ...prev,
                        alt: val,
                      };
                    })
                  }
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
              content: description,
              lang: langaugeTranslation(lang),
              link: link,
              pic: img.src,
              icon: icon.src,
              status: status,
              date: dateFormParsing(date, "start"),
              release_date: dateFormParsing(relaseDate, "start"),
              start_time: dateFormParsing(dateRange.start, "start"),
              end_time: dateFormParsing(dateRange.end, "end"),
              pic_alt: img.alt,
              icon_alt: icon.alt,
            };
            dispatch(setLoader(true));
            apiUpdateAction({
              promise:
                popupType === "create"
                  ? apiPostTopnewsCreate(update, authorization)
                  : apiPutTopnewsUpdate(
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
                topnewsPopupMutate();
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

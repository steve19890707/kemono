import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  filterPopupType,
  updateZoneProps,
  repeatedPropList,
  checkboxTextTransfer,
  dateFormParsing,
  getDateFormString,
} from "../../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../../lib/static";
import { commonStyles } from "../../styles/styles";
import { getData } from "../../common-lib/lib";
import Switch from "react-switch";
import noop from "lodash.noop";
// compoments
import Popup from "./Index";
import Input from "../Input";
import TextArea from "../TextArea";
import VideoUploader from "../VideoUploader";
import ImageUploader from "../ImageUploader";
import CheckBox from "../CheckBox";
import ConfirmPopup from "./Confirm";
import CommonLoader from "../CommonLoader";
// reducer
import { setLoader } from "../../reducer/props";
// api
import {
  apiPostEventCreate,
  apiPutEventUpdate,
  apiGetEventDetail,
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
  .caption-sperate-dashed {
    padding: 50px 0 20px 0;
    margin-bottom: 20px;
    border-bottom: 1px dashed ${commonStyles.borderColor2};
    font-size: 18px;
    font-style: italic;
    color: #989898;
  }
  .sperate-dashed {
    padding-top: 50px;
    border-bottom: 1px dashed ${commonStyles.borderColor2};
  }
  .padding-top {
    padding-top: 25px;
  }
  .img-type1 .type {
    background-color: #49827f;
  }
  .img-type2 .type {
    background-color: #824949;
  }
  .img-type3 .type {
    background-color: #624982;
  }
  .props-tip {
    color: red;
    padding: 0 0 25px 85px;
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

export default function ActiviesPopup({
  lang = "",
  id = "",
  apiCreateSucces = noop,
  cancelPopup = noop,
}) {
  const dispatch = useDispatch();
  const popupType = useSelector((state) => state.props.popupType);
  const authorization = useSelector((state) => state.props.authorization);
  const [updatePopup, setUpdatePopup] = useState(false);
  // 必帶
  // 必要欄位
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [img, setImg] = useState({
    src: "",
    alt: "",
  });
  // 自定義欄位(data)
  const [mainZone, setMainZone] = useState(mainzone());
  const [exhibitionZone, setExhibitionZone] = useState(exhibitionzone());
  const [exhibitionLiveZone, setExhibitionLiveZone] = useState(
    exhibitionlivezone()
  );
  const {
    // data: activitiesPopupData,
    isLoading: activitiesPopupIsLoading,
    mutate: activitiesPopupMutate,
  } = FetchGetHook({
    defaultDataType: {},
    resquestStoppen: popupType === "create" ? true : false,
    query: id,
    promise: apiGetEventDetail,
    success: (data) => {
      setTitle(getData(data, ["title"]));
      setStatus(getData(data, ["status"], false));
      setLink(getData(data, ["link"]));
      setDate(getDateFormString(getData(data, ["date"])));
      setDescription(getData(data, ["description"]));
      setLocation(getData(data, ["location"]));
      setImg({
        src: getData(data, ["pic"]),
        alt: getData(data, ["pic_alt"]),
      });
      setMainZone(getData(data, ["data", "main_zone"], mainzone()));
      setExhibitionZone(
        getData(data, ["data", "exhibition_zone"], exhibitionzone())
      );
      setExhibitionLiveZone(
        getData(data, ["data", "exhibition_live_zone"], exhibitionlivezone())
      );
    },
  });
  return (
    <>
      <Popup
        title={`品牌活動(${filterPopupType(popupType)})-${langauge[lang]}`}
        updateText={popupType === "create" ? "新增" : "更新"}
        // secondPopupStatus={updatePopup}
        dataUpdate={() => setUpdatePopup(true)}
        cancelPopup={() => cancelPopup()}
      >
        <StyledPopupContent>
          {activitiesPopupIsLoading && popupType !== "create" ? (
            <CommonLoader />
          ) : (
            <>
              <div className="info-block">
                <div className="caption">狀態：</div>
                <Switch checked={status} onChange={(e) => setStatus(e)} />
              </div>
              <div className="info-block">
                <div className="caption">日期：</div>
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
              <div className="info-block">
                <div className="caption">標題：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={title}
                  setKeyValue={setTitle}
                />
              </div>
              <div className="props-tip">＊--- 標題為必填 ---＊</div>
              <div className="info-block">
                <div className="caption">自訂網址：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={link}
                  setKeyValue={setLink}
                />
              </div>
              <div className="info-block">
                <div className="caption">展覽地點：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={location}
                  setKeyValue={setLocation}
                />
              </div>
              <div className="info-block">
                <div className="caption">簡述：</div>
                <TextArea
                  keyValue={description}
                  setKeyValue={(val) => setDescription(val)}
                />
              </div>
              <div className="info-block">
                <div className="caption">圖片(ICON) alt：</div>
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
                title="展覽ICON"
                type={`activitiesicon-${langaugeTranslation(lang)}`}
                imgSize={"649x515"}
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
              <div className="caption-sperate-dashed">主形象圖片/影片區</div>
              <div className="info-block">
                <div className="caption">呈現方式：</div>
                {["img", "video"].map((val, key) => (
                  <CheckBox
                    key={key}
                    className="column"
                    checked={mainZone.type === val ? true : false}
                    name={`顯示為 ${checkboxTextTransfer(val)}`}
                    onChange={() => updateZoneProps(val, ["type"], setMainZone)}
                  />
                ))}
              </div>
              <VideoUploader
                id="apv1"
                video={mainZone.video.src}
                setVideoUrl={(res) => {
                  const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                    "file_name",
                  ])}`;
                  updateZoneProps(srcUpdate, ["video", "src"], setMainZone);
                }}
              />
              {mainZone.banners.map((value, key) => (
                <React.Fragment key={key}>
                  {key !== 0 && <div className="sperate-dashed" />}
                  <div className="packge-imgUploader">
                    <ImageUploader
                      className="img-type1 packge"
                      title={`形象圖(${key + 1})-桌機版`}
                      type={`activitiesimg-${langaugeTranslation(lang)}-pc`}
                      imgSize={"1920x1050"}
                      picture={mainZone.banners[key].src.pc}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            pc: srcUpdate,
                            mobile: mainZone.banners[key].src.mobile,
                          },
                          ["banners", key, "src"],
                          setMainZone
                        );
                      }}
                    />
                    <ImageUploader
                      className="img-type1 packge"
                      title={`形象圖(${key + 1})-手機版`}
                      type={`activitiesimg-${langaugeTranslation(lang)}-mobile`}
                      imgSize={"1000x900"}
                      picture={mainZone.banners[key].src.mobile}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            mobile: srcUpdate,
                            pc: mainZone.banners[key].src.pc,
                          },
                          ["banners", key, "src"],
                          setMainZone
                        );
                      }}
                    />
                  </div>
                  <div className="info-block padding-top">
                    <div className="caption">圖片啟用：</div>
                    <Switch
                      checked={mainZone.banners[key].status}
                      onChange={(e) =>
                        updateZoneProps(
                          e,
                          ["banners", key, "status"],
                          setMainZone
                        )
                      }
                    />
                  </div>
                  <div className="info-block">
                    <div className="caption">alt：</div>
                    <Input
                      styles={{ width: "250px" }}
                      keyValue={mainZone.banners[key].alt}
                      setKeyValue={(val) =>
                        updateZoneProps(
                          val,
                          ["banners", key, "alt"],
                          setMainZone
                        )
                      }
                    />
                  </div>
                </React.Fragment>
              ))}
              <div className="caption-sperate-dashed">展覽圖文</div>
              {exhibitionZone.banners.map((value, key) => (
                <React.Fragment key={key}>
                  {key !== 0 && <div className="sperate-dashed" />}
                  <div className="packge-imgUploader">
                    <ImageUploader
                      className="img-type2 packge"
                      title={`展覽圖文(${key + 1})-桌機版`}
                      type={`activitiesexhibition-${langaugeTranslation(
                        lang
                      )}-pc`}
                      imgSize={"794x541"}
                      picture={exhibitionZone.banners[key].src.pc}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            pc: srcUpdate,
                            mobile: exhibitionZone.banners[key].src.mobile,
                          },
                          ["banners", key, "src"],
                          setExhibitionZone
                        );
                      }}
                    />
                    <ImageUploader
                      className="img-type2 packge"
                      title={`展覽圖文(${key + 1})-手機版`}
                      type={`activitiesexhibition-${langaugeTranslation(
                        lang
                      )}-mobile`}
                      imgSize={"548x514"}
                      picture={exhibitionZone.banners[key].src.mobile}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            mobile: srcUpdate,
                            pc: exhibitionZone.banners[key].src.pc,
                          },
                          ["banners", key, "src"],
                          setExhibitionZone
                        );
                      }}
                    />
                  </div>
                  <div className="info-block padding-top">
                    <div className="caption">圖片啟用：</div>
                    <Switch
                      checked={exhibitionZone.banners[key].status}
                      onChange={(e) =>
                        updateZoneProps(
                          e,
                          ["banners", key, "status"],
                          setExhibitionZone
                        )
                      }
                    />
                  </div>
                  <div className="info-block">
                    <div className="caption">alt：</div>
                    <Input
                      styles={{ width: "250px" }}
                      keyValue={exhibitionZone.banners[key].alt}
                      setKeyValue={(val) =>
                        updateZoneProps(
                          val,
                          ["banners", key, "alt"],
                          setExhibitionZone
                        )
                      }
                    />
                  </div>
                  <div className="info-block">
                    <div className="caption">標題：</div>
                    <Input
                      styles={{ width: "250px" }}
                      keyValue={exhibitionZone.banners[key].caption}
                      setKeyValue={(val) =>
                        updateZoneProps(
                          val,
                          ["banners", key, "caption"],
                          setExhibitionZone
                        )
                      }
                    />
                  </div>
                  <div className="info-block">
                    <div className="caption">簡述：</div>
                    <TextArea
                      keyValue={exhibitionZone.banners[key].description}
                      setKeyValue={(val) =>
                        updateZoneProps(
                          val,
                          ["banners", key, "description"],
                          setExhibitionZone
                        )
                      }
                    />
                  </div>
                </React.Fragment>
              ))}
              <div className="caption-sperate-dashed">展覽現況區</div>
              <div className="info-block padding-top">
                <div className="caption">英文標題：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={exhibitionLiveZone.subtitle}
                  setKeyValue={(val) =>
                    updateZoneProps(val, ["subtitle"], setExhibitionLiveZone)
                  }
                />
              </div>
              <div className="info-block">
                <div className="caption">標題：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={exhibitionLiveZone.title}
                  setKeyValue={(val) =>
                    updateZoneProps(val, ["title"], setExhibitionLiveZone)
                  }
                />
              </div>
              <div className="info-block">
                <div className="caption">簡述：</div>
                <TextArea
                  keyValue={exhibitionLiveZone.description}
                  setKeyValue={(val) =>
                    updateZoneProps(val, ["description"], setExhibitionLiveZone)
                  }
                />
              </div>
              <div className="info-block">
                <div className="caption">影片啟用：</div>
                <Switch
                  checked={exhibitionLiveZone.video.status}
                  onChange={(e) =>
                    updateZoneProps(
                      e,
                      ["video", "status"],
                      setExhibitionLiveZone
                    )
                  }
                />
              </div>
              <VideoUploader
                id="apv2"
                video={exhibitionLiveZone.video.src}
                setVideoUrl={(res) => {
                  const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                    "file_name",
                  ])}`;
                  updateZoneProps(
                    srcUpdate,
                    ["video", "src"],
                    setExhibitionLiveZone
                  );
                }}
              />
              {exhibitionLiveZone.banners.map((value, key) => (
                <React.Fragment key={key}>
                  <div className="sperate-dashed" />
                  <div className="packge-imgUploader">
                    <ImageUploader
                      className="img-type3 packge"
                      title={`展覽現況(${key + 1})-桌機版`}
                      type={`activitiesexhibitionlive-${langaugeTranslation(
                        lang
                      )}-pc`}
                      imgSize={"1234x639"}
                      picture={exhibitionLiveZone.banners[key].src.pc}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            pc: srcUpdate,
                            mobile: exhibitionLiveZone.banners[key].src.mobile,
                          },
                          ["banners", key, "src"],
                          setExhibitionLiveZone
                        );
                      }}
                    />
                    <ImageUploader
                      className="img-type3 packge"
                      title={`展覽現況(${key + 1})-手機版`}
                      type={`activitiesexhibitionlive-${langaugeTranslation(
                        lang
                      )}-mobile`}
                      imgSize={"548x514"}
                      picture={exhibitionLiveZone.banners[key].src.mobile}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          {
                            mobile: srcUpdate,
                            pc: exhibitionLiveZone.banners[key].src.pc,
                          },
                          ["banners", key, "src"],
                          setExhibitionLiveZone
                        );
                      }}
                    />
                  </div>

                  <div className="info-block padding-top">
                    <div className="caption">圖片啟用：</div>
                    <Switch
                      checked={exhibitionLiveZone.banners[key].status}
                      onChange={(e) =>
                        updateZoneProps(
                          e,
                          ["banners", key, "status"],
                          setExhibitionLiveZone
                        )
                      }
                    />
                  </div>
                  <div className="info-block">
                    <div className="caption">alt：</div>
                    <Input
                      styles={{ width: "250px" }}
                      keyValue={exhibitionLiveZone.banners[key].alt}
                      setKeyValue={(val) =>
                        updateZoneProps(
                          val,
                          ["banners", key, "alt"],
                          setExhibitionLiveZone
                        )
                      }
                    />
                  </div>
                </React.Fragment>
              ))}
            </>
          )}
        </StyledPopupContent>
      </Popup>
      {updatePopup && (
        <ConfirmPopup
          content={`確定${filterPopupType(popupType)}內容嗎？`}
          dataUpdate={() => {
            const update = {
              lang: langaugeTranslation(lang),
              date: dateFormParsing(date, "start"),
              description: description,
              location: location,
              pic: img.src,
              pic_alt: img.alt,
              status: status,
              title: title,
              link: link,
              data: {
                main_zone: mainZone,
                exhibition_zone: exhibitionZone,
                exhibition_live_zone: exhibitionLiveZone,
              },
            };
            dispatch(setLoader(true));
            apiUpdateAction({
              promise:
                popupType === "create"
                  ? apiPostEventCreate(update, authorization)
                  : apiPutEventUpdate(
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
                activitiesPopupMutate();
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

// default props
const mainzone = () => {
  return {
    type: "img",
    video: {
      src: "",
    },
    banners: repeatedPropList(
      {
        src: {
          pc: "",
          mobile: "",
        },
        alt: "",
        status: false,
      },
      4
    ),
  };
};

const exhibitionzone = () => {
  return {
    banners: repeatedPropList(
      {
        src: {
          pc: "",
          mobile: "",
        },
        alt: "",
        caption: "",
        description: "",
        status: false,
      },
      6
    ),
  };
};

const exhibitionlivezone = () => {
  return {
    title: "",
    subtitle: "",
    description: "",
    video: {
      src: "",
      status: false,
    },
    banners: repeatedPropList(
      {
        src: {
          pc: "",
          mobile: "",
        },
        alt: "",
        status: false,
      },
      10
    ),
  };
};

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  filterPopupType,
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
import ImageUploader from "../ImageUploader";
import CheckBox from "../CheckBox";
import ConfirmPopup from "./Confirm";
import CommonLoader from "../CommonLoader";
import DropdownSelector from "../DropdownSelector";
// import Quill from "../Quill";
// reducer
import { setLoader } from "../../reducer/props";
// api
import {
  apiGetNewsDetail,
  apiPostNewsCreate,
  apiPutNewsUpdate,
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
    &.space-top {
      margin-top: 20px;
    }
  }
  .column {
    margin: 0 10px 0 0;
  }
  .quill-content {
    min-height: 370px;
  }
  .date-input input[type="date"]::-webkit-calendar-picker-indicator {
    width: 20px;
    height: 20px;
    background-image: url('data:image/svg+xml;utf8,<svg stroke="" fill="dodgerblue" stroke-width="0" viewBox="0 0 448 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>');
    cursor: pointer;
  }
  .cover-ImageUploader .type {
    background-color: ${commonStyles.feature2};
  }
  .img-sperate-dashed {
    padding-top: 50px;
    border-bottom: 1px dashed ${commonStyles.borderColor2};
  }
  .quill-title {
    padding: 20px 0;
    .caption {
      font-weight: bold;
      font-size: 18px;
    }
    .tip {
      margin-top: 8px;
      color: red;
      font-size: 13px;
    }
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
const findCategoryId = (list = [], id = "") => {
  const find = list.find((v) => v.id === id) || {};
  return getData(find, ["name"]);
};

export default function NewsPopup({
  categoryName = "",
  lang = "",
  id = "",
  categoryId = "",
  categoryListData = [],
  apiCreateSucces = noop,
  cancelPopup = noop,
  CKEditor = noop,
}) {
  const dispatch = useDispatch();
  const popupType = useSelector((state) => state.props.popupType);
  const temporaryText = useSelector((state) => state.props.temporaryText);
  const authorization = useSelector((state) => state.props.authorization);
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  // 必要欄位
  const [relaseDate, setRelaseDate] = useState(""); //date
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(0);
  const [homeStatus, setHomeStatus] = useState(false);
  const [topStatus, setTopStatus] = useState(false);
  const [coverImg, setCoverImg] = useState("");
  const [categoryIdSelected, setCategoryIdSelected] = useState(categoryId);
  const [categoryOrder, setCategoryOrder] = useState("none");
  // 自定義欄位(data)
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [mainImg, setMainImg] = useState(defaultImgProps);
  const [timelineImg, setTimelineImg] = useState(defaultImgProps);
  const [homeBanner, setHomeBanner] = useState(defaultImgProps);
  const [editorContent, setEditorContent] = useState("");
  const {
    // data: newsPopupData,
    isLoading: newsPopupIsLoading,
    mutate: newsPopupMutate,
  } = FetchGetHook({
    defaultDataType: {},
    resquestStoppen: popupType === "create" ? true : false,
    query: `?news_id=${id}`,
    promise: apiGetNewsDetail,
    success: (data) => {
      setTitle(getData(data, ["title"]));
      setStatus(getData(data, ["status"], false));
      setHomeStatus(getData(data, ["home"]));
      setTopStatus(getData(data, ["top"]));
      setCoverImg(getData(data, ["cover_img"]));
      setRelaseDate(getDateFormString(getData(data, ["date"])));
      setDateRange({
        start: getDateFormString(getData(data, ["start_time"])),
        end: getDateFormString(getData(data, ["end_time"])),
      });
      setSubtitle(getData(data, ["data", "subtitle"]));
      setDescription(getData(data, ["data", "description"]));
      setWebsite(getData(data, ["data", "website"]));
      setMainImg(getData(data, ["data", "main_img"], defaultImgProps));
      setTimelineImg(getData(data, ["data", "timeline_img"], defaultImgProps));
      setHomeBanner(getData(data, ["data", "home_banner"], defaultImgProps));
      setEditorContent(getData(data, ["data", "editor_content"]));
    },
  });
  return (
    <>
      <Popup
        title={
          <>
            <span style={{ color: `${commonStyles.feature2}` }}>
              {categoryName}
            </span>
            <span>
              ({filterPopupType(popupType)})-{langauge[lang]}
            </span>
          </>
        }
        updateText={popupType === "create" ? "新增" : "更新"}
        dataUpdate={() => setUpdatePopup(true)}
        cancelPopup={() => cancelPopup()}
      >
        <StyledPopupContent>
          {newsPopupIsLoading && popupType !== "create" ? (
            <CommonLoader />
          ) : (
            <>
              <div className="info-block">
                <div className="caption">標籤類別:</div>
                <DropdownSelector
                  dropId="newspopup"
                  title={findCategoryId(categoryListData, categoryIdSelected)}
                  droplist={categoryListData}
                  dropdownAction={(val, key) => {
                    setCategoryIdSelected(getData(val, ["id"]));
                    setCategoryOrder(key);
                  }}
                />
              </div>
              <div className="info-block">
                <div className="caption">排序優先：</div>
                <div className="checkbox-list">
                  <CheckBox
                    checked={homeStatus}
                    name={"首頁文章 (以排序高為優先順序)"}
                    onChange={(val) => setHomeStatus(val)}
                  />
                  <CheckBox
                    className="column"
                    checked={topStatus}
                    name={"列表置頂 (以排序高為優先順序)"}
                    onChange={(val) => setTopStatus(val)}
                  />
                </div>
              </div>
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
              <div className="props-tip top">
                ＊--- ⬇ 此區間資料為必填 ⬇ ---＊
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
                <div className="caption">文章主標：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={title}
                  setKeyValue={setTitle}
                />
              </div>
              <div className="props-tip top">
                ＊--- ⬆ 此區間資料為必填 ⬆ ---＊
              </div>
              <div className="info-block">
                <div className="caption">文章副標：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={subtitle}
                  setKeyValue={setSubtitle}
                />
              </div>
              <div className="info-block">
                <div className="caption">摘要：</div>
                <TextArea keyValue={description} setKeyValue={setDescription} />
              </div>
              <div className="info-block">
                <div className="caption">自訂網址：</div>
                <Input
                  styles={{ width: "400px" }}
                  placeholder={"(ex:https://....)"}
                  keyValue={website}
                  setKeyValue={setWebsite}
                />
              </div>
              <div className="props-tip bottom">
                ＊--- ⬇ 資料封面圖(後臺用)為必填 ⬇ ---＊
              </div>
              <ImageUploader
                className="cover-ImageUploader"
                title="資料封面圖(後臺用)"
                type={`newscover-${langaugeTranslation(lang)}`}
                imgSize={"200x200"}
                picture={coverImg}
                setPicture={(res) => {
                  const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                    "file_name",
                  ])}`;
                  setCoverImg(srcUpdate);
                }}
              />
              <div className="img-sperate-dashed" />
              <div className="packge-imgUploader">
                <ImageUploader
                  className="packge"
                  title="形象圖(桌機)"
                  type={`newsmain-${langaugeTranslation(lang)}-pc`}
                  imgSize={"1920x500"}
                  picture={mainImg.src.pc}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setMainImg((prev) => {
                      return {
                        ...prev,
                        src: {
                          pc: srcUpdate,
                          mobile: prev.src.mobile,
                        },
                      };
                    });
                  }}
                />
                <ImageUploader
                  className="packge"
                  title="形象圖(手機)"
                  type={`newsmain-${langaugeTranslation(lang)}-mobile`}
                  imgSize={"1000x900"}
                  picture={mainImg.src.mobile}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setMainImg((prev) => {
                      return {
                        ...prev,
                        src: {
                          mobile: srcUpdate,
                          pc: prev.src.pc,
                        },
                      };
                    });
                  }}
                />
              </div>
              <div className="info-block space-top">
                <div className="caption">圖片啟用：</div>
                <Switch
                  checked={mainImg.status}
                  onChange={(e) =>
                    setMainImg((prev) => {
                      return {
                        ...prev,
                        status: e,
                      };
                    })
                  }
                />
              </div>
              <div className="info-block">
                <div className="caption">圖片alt：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={mainImg.alt}
                  setKeyValue={(val) =>
                    setMainImg((prev) => {
                      return {
                        ...prev,
                        alt: val,
                      };
                    })
                  }
                />
              </div>
              <div className="img-sperate-dashed" />
              <div className="packge-imgUploader">
                <ImageUploader
                  className="packge"
                  title="列表圖(桌機)"
                  type={`newstimeline-${langaugeTranslation(lang)}-pc`}
                  imgSize={"553x527"}
                  picture={timelineImg.src.pc}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setTimelineImg((prev) => {
                      return {
                        ...prev,
                        src: {
                          pc: srcUpdate,
                          mobile: prev.src.mobile,
                        },
                      };
                    });
                  }}
                />
                <ImageUploader
                  className="packge"
                  title="列表圖(手機)"
                  type={`newstimeline-${langaugeTranslation(lang)}-mobile`}
                  imgSize={"548x514"}
                  picture={timelineImg.src.mobile}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setTimelineImg((prev) => {
                      return {
                        ...prev,
                        src: {
                          mobile: srcUpdate,
                          pc: prev.src.pc,
                        },
                      };
                    });
                  }}
                />
              </div>
              <div className="info-block space-top">
                <div className="caption">圖片啟用：</div>
                <Switch
                  checked={timelineImg.status}
                  onChange={(e) =>
                    setTimelineImg((prev) => {
                      return {
                        ...prev,
                        status: e,
                      };
                    })
                  }
                />
              </div>
              <div className="info-block">
                <div className="caption">圖片alt：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={timelineImg.alt}
                  setKeyValue={(val) =>
                    setTimelineImg((prev) => {
                      return {
                        ...prev,
                        alt: val,
                      };
                    })
                  }
                />
              </div>
              <div className="img-sperate-dashed" />
              <div className="packge-imgUploader">
                <ImageUploader
                  className="packge"
                  title="首頁圖(桌機)"
                  type={`newshomebanner-${langaugeTranslation(lang)}-pc`}
                  imgSize={"575x300"}
                  picture={homeBanner.src.pc}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setHomeBanner((prev) => {
                      return {
                        ...prev,
                        src: {
                          pc: srcUpdate,
                          mobile: prev.src.mobile,
                        },
                      };
                    });
                  }}
                />
                <ImageUploader
                  className="packge"
                  title="首頁圖(手機)"
                  type={`newshomebanner-${langaugeTranslation(lang)}-mobile`}
                  imgSize={"548x514"}
                  picture={homeBanner.src.mobile}
                  setPicture={(res) => {
                    const srcUpdate = `${getData(res, ["url"])}${getData(res, [
                      "file_name",
                    ])}`;
                    setHomeBanner((prev) => {
                      return {
                        ...prev,
                        src: {
                          mobile: srcUpdate,
                          pc: prev.src.pc,
                        },
                      };
                    });
                  }}
                />
              </div>
              <div className="info-block space-top">
                <div className="caption">圖片啟用：</div>
                <Switch
                  checked={homeBanner.status}
                  onChange={(e) =>
                    setHomeBanner((prev) => {
                      return {
                        ...prev,
                        status: e,
                      };
                    })
                  }
                />
              </div>
              <div className="info-block ">
                <div className="caption">圖片alt：</div>
                <Input
                  styles={{ width: "250px" }}
                  keyValue={homeBanner.alt}
                  setKeyValue={(val) =>
                    setHomeBanner((prev) => {
                      return {
                        ...prev,
                        alt: val,
                      };
                    })
                  }
                />
              </div>
              <div className="quill-title">
                <div className="caption">- 內容 -</div>
                <div className="tip">
                  提醒您，如果是從其他地方複製過來的文案，建議先貼至記事本後在貼上來，因為，通常別處複製過來的文章會帶有許多用不到的格式，容易造成網站排版的問題。
                </div>
              </div>
              <div className="quill-content">
                {/* <Quill content={editorContent} /> */}
                <CKEditor content={editorContent} />
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
              category_id: categoryIdSelected,
              cover_img: coverImg,
              lang: langaugeTranslation(lang),
              date: dateFormParsing(relaseDate, "start"),
              start_time: dateFormParsing(dateRange.start, "start"),
              end_time: dateFormParsing(dateRange.end, "end"),
              home: homeStatus,
              top: topStatus,
              status: status,
              title: title,
              data: {
                subtitle: subtitle,
                description: description,
                editor_content: temporaryText, //editorContent 資料傳遞
                website: website,
                main_img: mainImg,
                timeline_img: timelineImg,
                home_banner: homeBanner,
              },
            };
            dispatch(setLoader(true));
            apiUpdateAction({
              promise:
                popupType === "create"
                  ? apiPostNewsCreate(update, authorization)
                  : apiPutNewsUpdate(
                      {
                        ...update,
                        id: id,
                      },
                      authorization
                    ),
              success: (response) => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
                apiCreateSucces(categoryOrder);
                newsPopupMutate();
                setCategoryOrder("none");
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

const defaultImgProps = {
  src: {
    pc: "",
    mobile: "",
  },
  status: false,
  alt: "",
};

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import {
  getStorageItem,
  updateZoneProps,
  repeatedPropList,
  checkboxTextTransfer,
} from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs } from "../components/Tabs";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import UpdateAndCancel from "../components/UpdateAndCancel";
import ConfirmPopup from "../components/Popup/Confirm";
import VideoUploader from "../components/VideoUploader";
import ImageUploader from "../components/ImageUploader";
import CommonLoader from "../components/CommonLoader";
import CheckBox from "../components/CheckBox";
import BlcokArea, {
  ZoneBlock,
  EditBlock,
  CaptionBlock,
} from "../components/BlockArea/Index";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiGetHomePageList,
  apiPutHomePageUpdate,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledHomepage = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
  }
  .date-input input[type="date"]::-webkit-calendar-picker-indicator {
    width: 20px;
    height: 20px;
    background-image: url('data:image/svg+xml;utf8,<svg stroke="" fill="dodgerblue" stroke-width="0" viewBox="0 0 448 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>');
    cursor: pointer;
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

const HomepagePage = () => {
  const $defaultOrder = 0;
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder))
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  const [mainZoneProps, setMainZoneProps] = useState(mainzone);
  const [coverZoneProps, setCoverZoneProps] = useState(coverzone);
  const [servicesZoneProps, setServicesZoneProps] = useState(serviceszone);
  const [exhibitionZoneProps, setExhibitionZoneProps] =
    useState(exhibitionzone);
  const {
    // data: homePageData,
    isLoading: homePageDataIsLoading,
    mutate: homePageDataMutate,
  } = FetchGetHook({
    defaultDataType: {},
    lang: langaugeTranslation(editLang),
    promise: apiGetHomePageList,
    success: (data) => {
      const content = getData(data, [0, "content"]);
      const response = content ? JSON.parse(content) : {};
      setMainZoneProps(getData(response, ["main"], mainzone));
      setCoverZoneProps(getData(response, ["cover"], coverzone));
      setServicesZoneProps(getData(response, ["services"], serviceszone));
      setExhibitionZoneProps(getData(response, ["exhibition"], exhibitionzone));
    },
  });
  return (
    <>
      <AuthVerify>
        <StyledHomepage>
          <Tabs
            list={langauge}
            order={$defaultOrder}
            value={editLang}
            type="lang"
            styles={{ paddingBottom: "20px" }}
            onClick={(props) =>
              setConfirmLangPopup({
                props: props,
                status: true,
              })
            }
          />
          <div className="edit-content">
            <ZoneBlock>
              <CaptionBlock text="主形象區" />
              <BlcokArea title={"呈現方式"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    {["img", "video"].map((val, key) => (
                      <CheckBox
                        key={key}
                        checked={mainZoneProps.type === val ? true : false}
                        name={`顯示為 ${checkboxTextTransfer(val)}`}
                        onChange={() =>
                          updateZoneProps(val, ["type"], setMainZoneProps)
                        }
                      />
                    ))}
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"影片"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.video.title}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["video", "title"],
                            setMainZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="連結：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.video.link}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["video", "link"],
                            setMainZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={mainZoneProps.video.blank}
                        name={"另開視窗"}
                        onChange={(val) =>
                          updateZoneProps(
                            val,
                            ["video", "blank"],
                            setMainZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <VideoUploader
                      id="hpv1"
                      video={mainZoneProps.video.src}
                      setVideoUrl={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["video", "src"],
                          setMainZoneProps
                        );
                      }}
                    />
                  </>
                )}
              </BlcokArea>
              {mainZoneProps.banners.map((value, key) => (
                <BlcokArea key={key} title={`Banner(${key + 1})`}>
                  {homePageDataIsLoading ? (
                    <CommonLoader />
                  ) : (
                    <>
                      <EditBlock caption="英文標題：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={mainZoneProps.banners[key].title}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "title"],
                              setMainZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="連結文字：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={mainZoneProps.banners[key].caption}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "caption"],
                              setMainZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="連結：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={mainZoneProps.banners[key].link}
                          placeholder={"(ex:https://....)"}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "link"],
                              setMainZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock className="checkbox">
                        <CheckBox
                          checked={mainZoneProps.banners[key].blank}
                          name={"另開視窗"}
                          onChange={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "blank"],
                              setMainZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="alt：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={mainZoneProps.banners[key].alt}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "alt"],
                              setMainZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <div className="packge-imgUploader">
                        <ImageUploader
                          className="packge"
                          title="桌機版"
                          type={`hpmain-${langaugeTranslation(editLang)}-pc`}
                          imgSize={"1743x941"}
                          picture={mainZoneProps.banners[key].src.pc}
                          setPicture={(res) => {
                            const srcUpdate = `${getData(res, [
                              "url",
                            ])}${getData(res, ["file_name"])}`;
                            updateZoneProps(
                              {
                                pc: srcUpdate,
                                mobile: mainZoneProps.banners[key].src.mobile,
                              },
                              ["banners", key, "src"],
                              setMainZoneProps
                            );
                          }}
                        />
                        <ImageUploader
                          className="packge"
                          title="手機版"
                          type={`hpmain-${langaugeTranslation(
                            editLang
                          )}-mobile`}
                          imgSize={"640x1012"}
                          picture={mainZoneProps.banners[key].src.mobile}
                          setPicture={(res) => {
                            const srcUpdate = `${getData(res, [
                              "url",
                            ])}${getData(res, ["file_name"])}`;
                            updateZoneProps(
                              {
                                mobile: srcUpdate,
                                pc: mainZoneProps.banners[key].src.pc,
                              },
                              ["banners", key, "src"],
                              setMainZoneProps
                            );
                          }}
                        />
                      </div>
                    </>
                  )}
                </BlcokArea>
              ))}
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="遮罩區" />
              <BlcokArea title={"圖片"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="alt：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={coverZoneProps.alt}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["alt"], setCoverZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="簡述：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        limitedTip={48}
                        keyValue={coverZoneProps.description}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description"],
                            setCoverZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <div className="packge-imgUploader">
                      <ImageUploader
                        className="packge"
                        title="桌機版"
                        type={`hpcover-${langaugeTranslation(editLang)}-pc`}
                        imgSize={"1920x1080"}
                        picture={coverZoneProps.src.pc}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "pc"],
                            setCoverZoneProps
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title="手機版"
                        type={`hpcover-${langaugeTranslation(editLang)}-mobile`}
                        imgSize={"640x1012"}
                        picture={coverZoneProps.src.mobile}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "mobile"],
                            setCoverZoneProps
                          );
                        }}
                      />
                    </div>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="服務項目背景圖" />
              <BlcokArea title={"圖片"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <ImageUploader
                      title="桌機版"
                      type={`hpservices-${langaugeTranslation(editLang)}`}
                      imgSize={"1920x1635"}
                      picture={servicesZoneProps.src.pc}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["src", "pc"],
                          setServicesZoneProps
                        );
                      }}
                    />
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="展覽資訊" />
              <BlcokArea title={"影片"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <VideoUploader
                      id="hpv2"
                      video={exhibitionZoneProps.video.src}
                      setVideoUrl={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["video", "src"],
                          setExhibitionZoneProps
                        );
                      }}
                    />
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"圖片"}>
                {homePageDataIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="日期：">
                      <Input
                        styles={{
                          background: "#fff",
                          minWidth: "unset",
                          width: "150px",
                          cursor: "pointer",
                        }}
                        keyValue={exhibitionZoneProps.date}
                        className="date-input"
                        type="date"
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["date"], setExhibitionZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={exhibitionZoneProps.title}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["title"],
                            setExhibitionZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="連結：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={exhibitionZoneProps.link}
                        placeholder={"(ex:https://....)"}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["link"], setExhibitionZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={exhibitionZoneProps.blank}
                        name={"另開視窗"}
                        onChange={(val) =>
                          updateZoneProps(
                            val,
                            ["blank"],
                            setExhibitionZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="alt：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={exhibitionZoneProps.alt}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["alt"], setExhibitionZoneProps)
                        }
                      />
                    </EditBlock>
                    <div className="packge-imgUploader">
                      <ImageUploader
                        className="packge"
                        title="桌機版"
                        type={`hpexhibition-${langaugeTranslation(
                          editLang
                        )}-pc`}
                        imgSize={"1507x711"}
                        picture={exhibitionZoneProps.src.pc}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "pc"],
                            setExhibitionZoneProps
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title="手機版"
                        type={`hpexhibition-${langaugeTranslation(
                          editLang
                        )}-mobile`}
                        imgSize={"644x526"}
                        picture={exhibitionZoneProps.src.mobile}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "mobile"],
                            setExhibitionZoneProps
                          );
                        }}
                      />
                    </div>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <UpdateAndCancel
              styles={{ zIndex: 100 }}
              useCancel={false}
              // disableStatus={confirmLangPopup.status}
              dataUpdate={() => setUpdatePopup(true)}
            />
          </div>
        </StyledHomepage>
      </AuthVerify>
      {confirmLangPopup.status && (
        <ConfirmPopup
          content={`確定切換成『 <span style='color:#f44336;'>${
            langauge[confirmLangPopup.props]
          }</span> 』? 尚未儲存的資料將會遺失。`}
          dataUpdate={() => {
            // to do api update
            setEditLang(confirmLangPopup.props);
            setConfirmLangPopup({
              props: "",
              status: false,
            });
          }}
          cancelPopup={() =>
            setConfirmLangPopup({
              props: "",
              status: false,
            })
          }
        />
      )}
      {updatePopup && (
        <ConfirmPopup
          content={`確定更新內容嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiPutHomePageUpdate(
                {
                  lang: langaugeTranslation(editLang),
                  data: {
                    main: {
                      ...mainZoneProps,
                    },
                    cover: {
                      ...coverZoneProps,
                    },
                    services: {
                      ...servicesZoneProps,
                    },
                    exhibition: {
                      ...exhibitionZoneProps,
                    },
                  },
                },
                authorization
              ),
              success: (response) => {
                homePageDataMutate();
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
            });
          }}
          cancelPopup={() => setUpdatePopup(false)}
        />
      )}
    </>
  );
};

const DynamicManagement = dynamic(() => Promise.resolve(HomepagePage), {
  ssr: false,
});

export default function Homepage() {
  return <DynamicManagement />;
}

// default props
const mainzone = {
  type: "img",
  video: {
    src: "",
    title: "",
    link: "",
    blank: false,
  },
  banners: repeatedPropList(
    {
      src: {
        pc: "",
        mobile: "",
      },
      alt: "",
      title: "",
      caption: "",
      link: "",
      blank: false,
    },
    4
  ),
};

const coverzone = {
  src: {
    pc: "",
    mobile: "",
  },
  alt: "",
  description: "",
};

const serviceszone = {
  src: {
    pc: "",
    mobile: "",
  },
};

const exhibitionzone = {
  video: {
    src: "",
  },
  src: {
    pc: "",
    mobile: "",
  },
  alt: "",
  title: "",
  date: "",
  link: "",
  blank: false,
};

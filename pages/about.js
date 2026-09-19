import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { getStorageItem, updateZoneProps } from "../lib/toolFuntions";
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
import ImageUploader from "../components/ImageUploader";
import CommonLoader from "../components/CommonLoader";
import BlcokArea, {
  ZoneBlock,
  EditBlock,
  CaptionBlock,
} from "../components/BlockArea/Index";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiPutAboutUpdate,
  apiGetAboutList,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledAbout = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
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

const AboutPage = () => {
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
  const [enterpriseZoneProps, setEnterpriseZoneProps] =
    useState(enterprisezone);
  const [brandZoneProps, setBrandZoneProps] = useState(brandzone);
  const [advantageZoneProps, setAdvantageZoneProps] = useState(advantagezone);
  const [futureZoneProps, setfutureZoneProps] = useState(futurezone);
  const [awardZoneProps, setAwardZoneProps] = useState(awardzone);
  const {
    // data: aboutListData,
    isLoading: aboutListIsLoading,
    mutate: aboutListMutate,
  } = FetchGetHook({
    defaultDataType: {},
    lang: langaugeTranslation(editLang),
    promise: apiGetAboutList,
    success: (data) => {
      const content = getData(data, [0, "content"]);
      const response = content ? JSON.parse(content) : {};
      setEnterpriseZoneProps(getData(response, ["enterprise"], enterprisezone));
      setBrandZoneProps(getData(response, ["brand"], brandzone));
      setAdvantageZoneProps(getData(response, ["advantage"], advantagezone));
      setfutureZoneProps(getData(response, ["future"], futurezone));
      setAwardZoneProps(getData(response, ["award"], awardzone));
    },
  });
  return (
    <>
      <AuthVerify>
        <StyledAbout>
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
              <CaptionBlock text="企業形象圖" />
              <BlcokArea title={"圖片"}>
                {aboutListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="alt：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={enterpriseZoneProps.alt}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["alt"], setEnterpriseZoneProps)
                        }
                      />
                    </EditBlock>
                    <div className="packge-imgUploader">
                      <ImageUploader
                        className="packge"
                        title="桌機版"
                        type={`aboutenterprise-${langaugeTranslation(
                          editLang
                        )}-pc`}
                        imgSize={"1920x500"}
                        picture={enterpriseZoneProps.src.pc}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "pc"],
                            setEnterpriseZoneProps
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title="手機版"
                        type={`aboutenterprise-${langaugeTranslation(
                          editLang
                        )}-mobile`}
                        imgSize={"1000x900"}
                        picture={enterpriseZoneProps.src.mobile}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "mobile"],
                            setEnterpriseZoneProps
                          );
                        }}
                      />
                    </div>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="品牌宣言" />
              <BlcokArea title={"內文"}>
                {aboutListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="英文標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={brandZoneProps.title1}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title1"], setBrandZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={brandZoneProps.title2}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title2"], setBrandZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(一)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        limitedTip={130}
                        keyValue={brandZoneProps.description1}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description1"],
                            setBrandZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(二)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        limitedTip={130}
                        keyValue={brandZoneProps.description2}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description2"],
                            setBrandZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="背景文字：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={brandZoneProps.bgtext}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["bgtext"], setBrandZoneProps)
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="優勢區塊" />
              {advantageZoneProps.banners.map((value, key) => (
                <BlcokArea key={key} title={`圖片(${key + 1})`}>
                  {aboutListIsLoading ? (
                    <CommonLoader />
                  ) : (
                    <>
                      <EditBlock caption="英文標題：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={value.title1}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "title1"],
                              setAdvantageZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="標題：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={value.title2}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "title2"],
                              setAdvantageZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="alt：">
                        <Input
                          styles={{ width: "450px", background: "#fff" }}
                          keyValue={value.alt}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "alt"],
                              setAdvantageZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <EditBlock caption="敘述：">
                        <TextArea
                          styles={{ width: "450px", background: "#fff" }}
                          limitedTip={90}
                          keyValue={value.description}
                          setKeyValue={(val) =>
                            updateZoneProps(
                              val,
                              ["banners", key, "description"],
                              setAdvantageZoneProps
                            )
                          }
                        />
                      </EditBlock>
                      <ImageUploader
                        type={`aboutadvantage-${langaugeTranslation(editLang)}`}
                        imgSize={"792x1116"}
                        picture={value.src}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          console.log(value.src);
                          updateZoneProps(
                            srcUpdate,
                            ["banners", key, "src"],
                            setAdvantageZoneProps
                          );
                        }}
                      />
                    </>
                  )}
                </BlcokArea>
              ))}
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="品牌願景" />
              <BlcokArea title={"內文"}>
                {aboutListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="英文標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={futureZoneProps.title1}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title1"], setfutureZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={futureZoneProps.title2}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title2"], setfutureZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(一)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        limitedTip={130}
                        keyValue={futureZoneProps.description1}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description1"],
                            setfutureZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(二)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        limitedTip={130}
                        keyValue={futureZoneProps.description2}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description2"],
                            setfutureZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="背景文字：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={futureZoneProps.bgtext}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["bgtext"], setfutureZoneProps)
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="獲獎事蹟" />
              <BlcokArea title={"內文"}>
                {aboutListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="英文標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={awardZoneProps.title1}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title1"], setAwardZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={awardZoneProps.title2}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title2"], setAwardZoneProps)
                        }
                      />
                    </EditBlock>
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
        </StyledAbout>
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
              promise: apiPutAboutUpdate(
                {
                  lang: langaugeTranslation(editLang),
                  data: {
                    enterprise: {
                      ...enterpriseZoneProps,
                    },
                    brand: {
                      ...brandZoneProps,
                    },
                    advantage: {
                      ...advantageZoneProps,
                    },
                    future: {
                      ...futureZoneProps,
                    },
                    award: {
                      ...awardZoneProps,
                    },
                  },
                },
                authorization
              ),
              success: (response) => {
                aboutListMutate();
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
            });
          }}
          cancelPopup={() => {
            dispatch(setLoader(false));
            setUpdatePopup(false);
          }}
        />
      )}
    </>
  );
};

const DynamicManagement = dynamic(() => Promise.resolve(AboutPage), {
  ssr: false,
});

export default function About() {
  return <DynamicManagement />;
}

const enterprisezone = {
  src: {
    pc: "",
    mobile: "",
  },
  alt: "",
};

const brandzone = {
  title1: "",
  title2: "",
  description1: "",
  description2: "",
  bgtext: "",
};

// 暫時固定4組
const advantagezone = {
  banners: [
    {
      src: "",
      alt: "",
      title1: "",
      title2: "",
      description: "",
    },
    {
      src: "",
      alt: "",
      title1: "",
      title2: "",
      description: "",
    },
    {
      src: "",
      alt: "",
      title1: "",
      title2: "",
      description: "",
    },
    {
      src: "",
      alt: "",
      title1: "",
      title2: "",
      description: "",
    },
  ],
};

const futurezone = {
  title1: "",
  title2: "",
  description1: "",
  description2: "",
  bgtext: "",
};

const awardzone = {
  title1: "",
  title2: "",
};

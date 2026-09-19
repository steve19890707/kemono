import { useState } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Switch from "react-switch";
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
  apiGetContactusList,
  apiPutContactusUpdate,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledContactUs = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
  }
  .eb-space-top {
    margin-top: 40px;
    border-top: 1px solid ${commonStyles.borderColor};
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

const ContactUsPage = () => {
  const $defaultOrder = 0;
  const dispatch = useDispatch();
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder))
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  const [mainImgZoneProps, setMainImgZoneProps] = useState(mainimgzone);
  const [contactInfoZoneProps, setContactInfoZoneProps] =
    useState(contactinfozone);
  const [formSubmitZoneProps, setFormSubmitZoneProps] =
    useState(formsubmitzone);
  const {
    // data: contactusListData,
    isLoading: contactusListIsLoading,
    mutate: contactusListMutate,
  } = FetchGetHook({
    defaultDataType: {},
    lang: langaugeTranslation(editLang),
    promise: apiGetContactusList,
    success: (data) => {
      const content = getData(data, [0, "content"]);
      const response = content ? JSON.parse(content) : {};
      setMainImgZoneProps(getData(response, ["mainImg"], mainimgzone));
      setContactInfoZoneProps({
        ...contactinfozone,
        ...getData(response, ["contactInfo"], contactinfozone),
      });
      setFormSubmitZoneProps(getData(response, ["formSubmit"], formsubmitzone));
    },
  });
  return (
    <>
      <AuthVerify>
        <StyledContactUs>
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
              <CaptionBlock text="上方形象圖區" />
              <BlcokArea title={"圖片"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="啟用：">
                      <Switch
                        checked={mainImgZoneProps.status}
                        onChange={(e) =>
                          updateZoneProps(e, ["status"], setMainImgZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="alt：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainImgZoneProps.alt}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["alt"], setMainImgZoneProps)
                        }
                      />
                    </EditBlock>
                    <div className="packge-imgUploader">
                      <ImageUploader
                        className="packge"
                        title="桌機版"
                        type={`contactusmain-${langaugeTranslation(
                          editLang
                        )}-pc`}
                        imgSize={"1920x500"}
                        picture={mainImgZoneProps.src.pc}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "pc"],
                            setMainImgZoneProps
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title="手機版"
                        type={`contactusmain-${langaugeTranslation(
                          editLang
                        )}-mobile`}
                        imgSize={"1000x900"}
                        picture={mainImgZoneProps.src.mobile}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"]
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "mobile"],
                            setMainImgZoneProps
                          );
                        }}
                      />
                    </div>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="聯絡資訊區" />
              <BlcokArea title={"電子郵件"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="mail：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.mail.link}
                        placeholder={"(ex:abc@email.com)"}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["mail", "link"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={contactInfoZoneProps.mail.blank}
                        name={"另開視窗"}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["mail", "blank"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"接收通知電子郵件"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="accept mail：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.acceptMail.link}
                        placeholder={"(ex:abc@email.com)"}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["acceptMail", "link"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"社群連結"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="Youtube：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.socialMedia.youtube}
                        placeholder={"(ex:https://youtube.com....)"}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["socialMedia", "youtube"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={contactInfoZoneProps.socialMedia.blank}
                        name={"另開視窗"}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["socialMedia", "blank"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"通訊連結"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="騰訊QQ id：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.qq.id}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["qq", "id"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="QRcode圖片啟用：">
                      <Switch
                        checked={contactInfoZoneProps.qq.qrcodeStatus}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["qq", "qrcodeStatus"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <ImageUploader
                      title="騰訊QQ id QRcode"
                      type={`qrcode`}
                      imgSize={"300x300"}
                      picture={contactInfoZoneProps.qq.qrcode}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["qq", "qrcode"],
                          setContactInfoZoneProps
                        );
                      }}
                    />
                    <EditBlock
                      className="eb-space-top"
                      caption="微信WeChat id："
                    >
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.wechat.id}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["wechat", "id"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="QRcode圖片啟用：">
                      <Switch
                        checked={contactInfoZoneProps.wechat.qrcodeStatus}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["wechat", "qrcodeStatus"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <ImageUploader
                      title="微信WeChat id QRcode"
                      type={`qrcode`}
                      imgSize={"300x300"}
                      picture={contactInfoZoneProps.wechat.qrcode}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["wechat", "qrcode"],
                          setContactInfoZoneProps
                        );
                      }}
                    />
                    <EditBlock className="eb-space-top" caption="Skype id：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.skype.id}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["skype", "id"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={contactInfoZoneProps.skype.blank}
                        name={"另開視窗"}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["skype", "blank"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="eb-space-top" caption="Telegram id：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={contactInfoZoneProps.telegram.id}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["telegram", "id"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock className="checkbox">
                      <CheckBox
                        checked={contactInfoZoneProps.telegram.blank}
                        name={"另開視窗"}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["telegram", "blank"],
                            setContactInfoZoneProps
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="送出表單彈跳視窗區" />
              <BlcokArea title={"感謝信形象圖"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="啟用：">
                      <Switch
                        checked={formSubmitZoneProps.status}
                        onChange={(e) =>
                          updateZoneProps(e, ["status"], setFormSubmitZoneProps)
                        }
                      />
                    </EditBlock>
                    <ImageUploader
                      // title="桌機版"
                      type={`formsubmit-${langaugeTranslation(editLang)}`}
                      imgSize={"300x300"}
                      picture={formSubmitZoneProps.src.pc}
                      setPicture={(res) => {
                        const srcUpdate = `${getData(res, ["url"])}${getData(
                          res,
                          ["file_name"]
                        )}`;
                        updateZoneProps(
                          srcUpdate,
                          ["src", "pc"],
                          setFormSubmitZoneProps
                        );
                      }}
                    />
                  </>
                )}
              </BlcokArea>
              <BlcokArea title={"感謝來信文字"}>
                {contactusListIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="描述內容：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={formSubmitZoneProps.description}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["description"],
                            setFormSubmitZoneProps
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <UpdateAndCancel
              styles={{ zIndex: 100 }}
              useCancel={contactusListIsLoading}
              // disableStatus={confirmLangPopup.status}
              dataUpdate={() => setUpdatePopup(true)}
            />
          </div>
        </StyledContactUs>
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
              promise: apiPutContactusUpdate({
                lang: langaugeTranslation(editLang),
                data: {
                  mainImg: {
                    ...mainImgZoneProps,
                  },
                  contactInfo: {
                    ...contactInfoZoneProps,
                  },
                  formSubmit: {
                    ...formSubmitZoneProps,
                  },
                },
              }),
              success: (response) => {
                contactusListMutate();
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

const DynamicManagement = dynamic(() => Promise.resolve(ContactUsPage), {
  ssr: false,
});

export default function ContactUs() {
  return <DynamicManagement />;
}

const mainimgzone = {
  src: {
    pc: "",
    mobile: "",
  },
  alt: "",
  status: false,
};

const contactinfozone = {
  mail: {
    link: "",
    blank: false,
  },
  acceptMail: {
    link: "",
  },
  socialMedia: {
    youtube: "",
    blank: false,
  },
  qq: {
    id: "",
    qrcodeStatus: false,
    qrcode: "",
  },
  wechat: {
    id: "",
    qrcode: "",
    qrcodeStatus: false,
  },
  skype: {
    id: "",
    link: "",
    blank: false,
  },
  telegram: {
    id: "",
    link: "",
    blank: false,
  },
};

const formsubmitzone = {
  status: false,
  src: { pc: "" },
  description: "",
};

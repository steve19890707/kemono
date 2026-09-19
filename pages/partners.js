import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import BlcokArea, {
  ZoneBlock,
  EditBlock,
  CaptionBlock,
} from "../components/BlockArea/Index";
import GridSortable from "../components/GridSortable";
import ButtonInput from "../components/ButtonInput";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiGetPartnersList,
  apiPutPartnersList,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledPartners = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
  }
  .customer-img-uploader {
    margin-top: 55px;
    .update-title {
      font-size: 13px;
    }
    .container {
      display: block;
    }
    .container label,
    .uploade-loder,
    .operation .tips {
      width: 92%;
      margin: 0 auto;
    }
    .operation {
      width: 100%;
      padding: 10px 0;
    }
    .operation li {
      font-size: 12px;
      margin-bottom: 4px;
    }
    .operation button {
      display: none;
    }
    .re-update-title {
      position: absolute;
      white-space: nowrap;
    }
    .caption-list {
      width: 92%;
      margin: 0 auto 5px auto;
      flex-direction: row-reverse;
      justify-content: flex-start;
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

const PartnersPage = () => {
  const $defaultOrder = 0;
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder)),
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  const [mainZoneProps, setMainZoneProps] = useState(mainzone);
  const [customerZoneProps, setCustomerZoneProps] = useState([]);
  const {
    // data: partnersData,
    isLoading: partnersIsLoading,
    mutate: partnersMutate,
  } = FetchGetHook({
    defaultDataType: {},
    lang: langaugeTranslation(editLang),
    promise: apiGetPartnersList,
    success: (data) => {
      const content = getData(data, [0, "content"]);
      const response = content ? JSON.parse(content) : {};
      setMainZoneProps(getData(response, ["main"], mainzone));
      setCustomerZoneProps(getData(response, ["customer"], []));
    },
  });
  return (
    <>
      <AuthVerify>
        <StyledPartners>
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
              <BlcokArea title={"形象圖"}>
                {partnersIsLoading ? (
                  <CommonLoader />
                ) : (
                  <>
                    <EditBlock caption="標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.title}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["title"], setMainZoneProps)
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="英文標題：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.caption}
                        setKeyValue={(val) =>
                          updateZoneProps(val, ["caption"], setMainZoneProps)
                        }
                      />
                    </EditBlock>
                    <div className="packge-imgUploader">
                      <ImageUploader
                        className="packge"
                        title={"桌機版"}
                        type={`partnersmain-${langaugeTranslation(
                          editLang,
                        )}-pc`}
                        picture={mainZoneProps.src.pc}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"],
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "pc"],
                            setMainZoneProps,
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title={"手機版"}
                        type={`partnersmain-${langaugeTranslation(
                          editLang,
                        )}-mobile`}
                        picture={mainZoneProps.src.mobile}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"],
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["src", "mobile"],
                            setMainZoneProps,
                          );
                        }}
                      />
                      <ImageUploader
                        className="packge"
                        title={"標章圖示"}
                        type={`partnersicon-${langaugeTranslation(editLang)}`}
                        picture={mainZoneProps.icon.src}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"],
                          )}`;
                          updateZoneProps(
                            srcUpdate,
                            ["icon", "src"],
                            setMainZoneProps,
                          );
                        }}
                      />
                    </div>
                    <EditBlock caption="顯示標章：">
                      <Switch
                        checked={mainZoneProps.icon.status}
                        onChange={(e) =>
                          updateZoneProps(
                            e,
                            ["icon", "status"],
                            setMainZoneProps,
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="alt：">
                      <Input
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.icon.alt}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["icon", "alt"],
                            setMainZoneProps,
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(一)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.descriptions.text1}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["descriptions", "text1"],
                            setMainZoneProps,
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(二)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.descriptions.text2}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["descriptions", "text2"],
                            setMainZoneProps,
                          )
                        }
                      />
                    </EditBlock>
                    <EditBlock caption="敘述(三)：">
                      <TextArea
                        styles={{ width: "450px", background: "#fff" }}
                        keyValue={mainZoneProps.descriptions.text3}
                        setKeyValue={(val) =>
                          updateZoneProps(
                            val,
                            ["descriptions", "text3"],
                            setMainZoneProps,
                          )
                        }
                      />
                    </EditBlock>
                  </>
                )}
              </BlcokArea>
            </ZoneBlock>
            <ZoneBlock>
              <CaptionBlock text="客戶與伙伴區" />
              {partnersIsLoading ? (
                <CommonLoader />
              ) : (
                <GridSortable
                  data={customerZoneProps}
                  Component={({ value, index }) => (
                    <>
                      <ImageUploader
                        className="customer-img-uploader"
                        cropBtnType2={true}
                        imgSize={`188x73`}
                        type={`partners-customer-${langaugeTranslation(
                          langauge,
                        )}`}
                        picture={getData(customerZoneProps, [index, "src"])}
                        setPicture={(res) => {
                          const srcUpdate = `${getData(res, ["url"])}${getData(
                            res,
                            ["file_name"],
                          )}`;
                          setCustomerZoneProps((prev) => {
                            const update = [];
                            for (let i = 0; i < prev.length; i++) {
                              if (index === i) {
                                update.push({ src: srcUpdate, index: index });
                              } else {
                                update.push(prev[i]);
                              }
                            }
                            return update;
                          });
                          // console.log(customerZoneProps);
                        }}
                      />
                      <ButtonInput
                        iconType={3}
                        styles={{ marginBottom: "12px" }}
                        keyValue={getData(customerZoneProps, [index, "link"])}
                        contentIsLink={true}
                        placeholder={"連結網址"}
                        dataUpdate={(val) => {
                          setCustomerZoneProps((prev) => {
                            const update = [];
                            for (let i = 0; i < prev.length; i++) {
                              if (index === i) {
                                update.push({
                                  link: val,
                                  src: prev[index].src,
                                  index: index,
                                });
                              } else {
                                update.push(prev[i]);
                              }
                            }
                            return update;
                          });
                          // console.log(customerZoneProps);
                        }}
                      />
                    </>
                  )}
                  setData={(newList) => setCustomerZoneProps(newList)}
                />
              )}
            </ZoneBlock>
            <UpdateAndCancel
              styles={{ zIndex: 100 }}
              useCancel={false}
              // disableStatus={confirmLangPopup.status}
              dataUpdate={() => setUpdatePopup(true)}
            />
          </div>
        </StyledPartners>
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
              promise: apiPutPartnersList(
                {
                  lang: langaugeTranslation(editLang),
                  data: {
                    main: { ...mainZoneProps },
                    customer: [...customerZoneProps],
                  },
                },
                authorization,
              ),
              success: (response) => {
                partnersMutate();
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

const DynamicManagement = dynamic(() => Promise.resolve(PartnersPage), {
  ssr: false,
});

export default function Partners() {
  return <DynamicManagement />;
}

// default props
const mainzone = {
  src: {
    pc: "",
    mobile: "",
  },
  title: "",
  caption: "",
  icon: {
    status: false,
    src: "",
    alt: "",
  },
  descriptions: {
    text1: "",
    text2: "",
    text3: "",
  },
};

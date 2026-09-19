import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { commonStyles } from "../../styles/styles";
import { getDateFormString } from "../../lib/toolFuntions";
import { langauge } from "../../lib/static";
import { getData } from "../../common-lib/lib";
import noop from "lodash.noop";
import cx from "classnames";
import * as dayjs from "dayjs";
// compoments
import { SecondTabs } from "../Tabs";
import Popup from "./Index";
import ConfirmPopup from "./Confirm";
import Input from "../Input";
// import Quill from "../Quill";
import CommonLoader from "../CommonLoader";
import NoData from "../NoData";
// reducer
import { setLoader } from "../../reducer/props";
// api
import {
  apiPostContactUsReply,
  apiUpdateAction,
  apiGetContactusMailDetail,
  FetchGetHook,
} from "../../pages/api";

const StyledContactUsMailPopup = styled.div`
  .sticky-tabs {
    position: sticky;
    top: 120px;
    flex-direction: row-reverse;
  }
  .info-content {
    padding-top: 15px;
    .hidden {
      display: none;
    }
  }
  .quill-content {
    padding-top: 20px;
    min-height: 365px;
  }
  .reply-block {
    border-radius: 6px;
    border: 1px solid ${commonStyles.borderColor2};
    box-sizing: border-box;
    padding: 20px 20px 10px 20px;
    margin-bottom: 10px;
  }
  .info-block {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .caption {
      min-width: 85px;
    }
    &.inset {
      width: 33.3333%;
    }
    &.inset-type1 {
      width: 50%;
    }
    &.inset-type2 {
      width: 100%;
      justify-content: space-between;
      .caption {
        min-width: unset;
      }
      .content {
        margin-right: 15px;
      }
      .info-block {
        margin-bottom: 0;
      }
    }
    &.no-margin {
      margin: 0;
    }
    &.padding-top {
      margin: 0;
      padding-top: 20px;
    }
    &.caption {
      border-bottom: 1px dashed ${commonStyles.borderColor2};
    }
  }
  .content {
    color: ${commonStyles.feature2};
    &.close {
      color: ${commonStyles.borderColor2};
    }
    &.dangerously img {
      max-width: 100%;
      height: auto;
    }
  }
  .subtitle {
    color: ${commonStyles.borderColor2};
    border-bottom: 2px solid ${commonStyles.borderColor};
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
`;

export default function ContactUsMailPopup({
  lang = "",
  id = "",
  apiCreateSucces = noop,
  cancelPopup = noop,
  CKEditor = noop,
}) {
  const dispatch = useDispatch();
  const $defaultOrder = 2;
  const temporaryText = useSelector((state) => state.props.temporaryText);
  const authorization = useSelector((state) => state.props.authorization);
  const [tabOrder, setTabOrder] = useState($defaultOrder);
  const [updatePopup, setUpdatePopup] = useState(false);
  // props
  const [replyList, setReplyList] = useState([]);
  const [contactUsInfo, setContactUsInfo] = useState(contactusinfo);
  const [replyTitle, setReplyTitle] = useState("");
  const {
    data: contactusMailDetailData,
    isLoading: contactusMailDetailIsLoading,
    mutate: contactusMailDetailMutate,
  } = FetchGetHook({
    defaultDataType: {},
    query: id,
    promise: apiGetContactusMailDetail,
    success: (data) => {
      setContactUsInfo(getData(data, ["data"], contactusinfo));
      setReplyList(getData(data, ["reply"], []));
    },
  });
  useEffect(() => {
    if (!contactusMailDetailIsLoading) {
      apiCreateSucces();
    }
  }, [contactusMailDetailIsLoading]);
  return (
    <>
      <Popup
        title={`訪客-${langauge[lang]}`}
        updateText="發送"
        canceltext="關閉"
        // secondPopupStatus={!tabOrder}
        cancelOnly={tabOrder}
        dataUpdate={() => setUpdatePopup(true)}
        cancelPopup={cancelPopup}
      >
        <StyledContactUsMailPopup>
          <SecondTabs
            className="sticky-tabs"
            list={["回覆郵件", "回覆紀錄", "聯絡內容"]}
            order={$defaultOrder}
            value={tabOrder}
            onClick={(props) => setTabOrder(props)}
          />
          {contactusMailDetailIsLoading ? (
            <CommonLoader />
          ) : (
            <div className="info-content">
              <div className={cx({ hidden: tabOrder !== 0 })}>
                <div className="info-block">
                  <div className="caption">訪客姓名：</div>
                  <div className="content">
                    {getData(contactusMailDetailData, ["name"])}
                  </div>
                </div>
                <div className="info-block">
                  <div className="caption">訪客詢問內容：</div>
                  <div className="content">
                    {getData(contactUsInfo, ["content"], "尚未填寫")}
                  </div>
                </div>
                <div className="info-block padding-top">
                  <div className="caption">回覆信件主旨：</div>
                  <Input
                    styles={{
                      width: "300px",
                    }}
                    keyValue={replyTitle}
                    setKeyValue={setReplyTitle}
                  />
                </div>
                <div className="quill-content">
                  {/* <Quill /> */}
                  <CKEditor />
                </div>
              </div>
              {/* 回覆紀錄 */}
              {tabOrder === 1 && (
                <>
                  {replyList.length > 0 ? (
                    replyList.map((val, key) => (
                      <div className="reply-block" key={key}>
                        <div className="info-block caption">
                          <div className="info-block inset-type2">
                            <div className="info-block">
                              <div className="caption">回覆主旨：</div>
                              <div className="content">
                                {getData(val, ["title"])}
                              </div>
                            </div>
                            <div className="info-block">
                              <div className="caption">回覆人員：</div>
                              <div className="content">
                                {getData(val, ["edited_by"])}
                              </div>
                              <div className="caption">回覆時間：</div>
                              <div className="content">
                                {dayjs(getData(val, ["created_at"])).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="info-block">
                          <div className="caption">回覆內容：</div>
                          <div
                            className="content dangerously"
                            dangerouslySetInnerHTML={{
                              __html: getData(val, ["content"]),
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoData />
                  )}
                </>
              )}
              {/* 聯絡內容 */}
              {tabOrder === 2 && (
                <>
                  <div className="info-block">
                    <div className="caption">發送日期：</div>
                    <div className="content">
                      {getDateFormString(
                        getData(contactusMailDetailData, ["created_at"])
                      )}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="caption">訪客姓名：</div>
                    <div className="content">
                      {getData(contactusMailDetailData, ["name"])}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="caption">電子信箱：</div>
                    <div className="content">
                      {getData(contactusMailDetailData, ["email"])}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="caption">手機號碼：</div>
                    <div className="content">
                      {getData(contactusMailDetailData, ["tel"])}
                    </div>
                  </div>
                  <div className="subtitle">社群媒體</div>
                  <div className="info-block no-margin">
                    <div className="info-block inset">
                      <div className="caption">QQ：</div>
                      <div className="content">
                        {getData(contactUsInfo, ["qq"], "尚未填寫")}
                      </div>
                    </div>
                    <div className="info-block inset">
                      <div className="caption">Skype：</div>
                      <div className="content">
                        {getData(contactUsInfo, ["skype"], "尚未填寫")}
                      </div>
                    </div>
                    <div className="info-block">
                      <div className="caption">whatsapp：</div>
                      <div className="content">
                        {getData(contactUsInfo, ["whatsapp"], "尚未填寫")}
                      </div>
                    </div>
                  </div>
                  <div className="info-block no-margin">
                    <div className="info-block inset">
                      <div className="caption">微信：</div>
                      <div className="content">
                        {getData(contactUsInfo, ["wixsin"], "尚未填寫")}
                      </div>
                    </div>
                    <div className="info-block">
                      <div className="caption">Telegram：</div>
                      <div className="content">
                        {getData(contactUsInfo, ["telegram"], "尚未填寫")}
                      </div>
                    </div>
                  </div>
                  <div className="subtitle">公司資訊</div>
                  <div className="info-block">
                    <div className="caption">詢問內容：</div>
                    <div className="content">
                      {getData(contactUsInfo, ["content"], "尚未填寫")}
                    </div>
                  </div>
                  <div className="info-block no-margin">
                    <div className="info-block inset-type1">
                      <div className="caption">公司名稱：</div>
                      <div className="content close">暫未開放填寫</div>
                    </div>
                    <div className="info-block inset-type1">
                      <div className="caption">公司網站：</div>
                      <div className="content close">暫未開放填寫</div>
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="caption">目標市場 / 國家：</div>
                    <div className="content close">暫未開放填寫</div>
                  </div>
                  <div className="info-block">
                    <div className="caption">
                      目前的業務 / 服務 / 計畫簡述：
                    </div>
                    <div className="content close">暫未開放填寫</div>
                  </div>
                  <div className="info-block">
                    <div className="caption">
                      其它說明幫助我們了解您的需求：
                    </div>
                    <div className="content close">暫未開放填寫</div>
                  </div>
                </>
              )}
            </div>
          )}
        </StyledContactUsMailPopup>
      </Popup>
      {updatePopup && (
        <ConfirmPopup
          content={`確定發送嗎?`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiPostContactUsReply(
                {
                  content: temporaryText,
                  email: getData(contactusMailDetailData, ["email"]),
                  id: id,
                  title: replyTitle,
                },
                authorization
              ),
              success: (response) => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
                contactusMailDetailMutate();
                apiCreateSucces();
                setTabOrder(1);
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

const contactusinfo = {
  content: "",
  qq: "",
  skype: "",
  telegram: "",
  whatsapp: "",
  wixsin: "",
};

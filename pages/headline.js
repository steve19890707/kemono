import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { getStorageItem } from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs, SecondTabs } from "../components/Tabs";
import Input from "../components/Input";
import UpdateAndCancel from "../components/UpdateAndCancel";
import TextArea from "../components/TextArea";
import CommonLoader from "../components/CommonLoader";
import ConfirmPopup from "../components/Popup/Confirm";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiGetHeaderList,
  apiPutHeaderUpdate,
  apiUpdateAction,
  FetchGetHook,
} from "./api";

const StyledHeadlinePage = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
    position: relative;
    box-sizing: border-box;
  }
  .caption {
    text-align: center;
    width: 100px;
    border-bottom: 1px solid ${commonStyles.borderColor};
    padding: 10px 0;
    margin-right: 10px;
  }
  .edit-block {
    display: flex;
    align-items: center;
    padding: 15px 0;
  }
`;

const settingList = [
  "共同設定",
  "首頁",
  "关于CQ9 設定",
  "SPORTSBOOK",
  "LIVE CASINO",
  "游戏介绍",
  "最新消息",
  "品牌活动",
  "合作伙伴",
  "联络我们",
];

const HeadlinePage = () => {
  const $defaultOrder = 0;
  const dispatch = useDispatch();
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder))
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const [confirmSecondPopup, setConfirmSecondPopup] = useState({
    props: "",
    status: false,
  });
  const [updatePopup, setUpdatePopup] = useState(false);
  const [secondTabs, setSecondTabs] = useState(0);
  const [apiData, setApiData] = useState({});
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const {
    // data: headerListData,
    isLoading: headerListIsLoading,
    mutate: headerListMutate,
  } = FetchGetHook({
    defaultDataType: {},
    lang: langaugeTranslation(editLang),
    promise: apiGetHeaderList,
    success: (data) => {
      setApiData(data);
      setTitle(
        getData(data, [translateSecondTabs(secondTabs), "header", "title"])
      );
      setKeywords(
        getData(data, [translateSecondTabs(secondTabs), "header", "keywords"])
      );
      setDescription(
        getData(data, [
          translateSecondTabs(secondTabs),
          "header",
          "description",
        ])
      );
    },
  });
  useEffect(() => {
    setTitle(
      getData(apiData, [translateSecondTabs(secondTabs), "header", "title"])
    );
    setKeywords(
      getData(apiData, [translateSecondTabs(secondTabs), "header", "keywords"])
    );
    setDescription(
      getData(apiData, [
        translateSecondTabs(secondTabs),
        "header",
        "description",
      ])
    );
  }, [secondTabs]);
  return (
    <>
      <AuthVerify>
        <StyledHeadlinePage>
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
            <SecondTabs
              list={settingList}
              order={$defaultOrder}
              value={secondTabs}
              styles={{ paddingBottom: "10px" }}
              onClick={(props) => {
                setConfirmSecondPopup({
                  props: props,
                  status: true,
                });
              }}
            />
            {headerListIsLoading ? (
              <CommonLoader />
            ) : (
              <>
                <div className="edit-block">
                  <div className="caption">Title</div>
                  <Input
                    styles={{ width: "400px" }}
                    keyValue={title}
                    setKeyValue={setTitle}
                  />
                </div>
                <div className="edit-block">
                  <div className="caption">Keywords</div>
                  <TextArea keyValue={keywords} setKeyValue={setKeywords} />
                </div>
                <div className="edit-block">
                  <div className="caption">Description</div>
                  <TextArea
                    keyValue={description}
                    setKeyValue={setDescription}
                  />
                </div>
              </>
            )}
            <UpdateAndCancel
              useCancel={false}
              // disableStatus={
              //   confirmLangPopup.status || confirmSecondPopup.status
              // }
              dataUpdate={() => setUpdatePopup(true)}
            />
          </div>
        </StyledHeadlinePage>
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
      {confirmSecondPopup.status && (
        <ConfirmPopup
          content={`確定切換成『 <span style='color:#f44336;'>${
            settingList[confirmSecondPopup.props]
          }</span> 』? 尚未儲存的資料將會遺失。`}
          dataUpdate={() => {
            // to do api update
            setSecondTabs(confirmSecondPopup.props);
            setConfirmSecondPopup({
              props: "",
              status: false,
            });
          }}
          cancelPopup={() => {
            setConfirmSecondPopup({
              props: "",
              status: false,
            });
          }}
        />
      )}
      {updatePopup && (
        <ConfirmPopup
          content={`確定更新內容嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiPutHeaderUpdate({
                lang: langaugeTranslation(editLang),
                header: {
                  title: title,
                  keywords: keywords,
                  description: description,
                },
                page: translateSecondTabs(secondTabs),
              }),
              success: (response) => {
                headerListMutate();
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

const DynamicHeadline = dynamic(() => Promise.resolve(HeadlinePage), {
  ssr: false,
});
export default function Headline() {
  return <DynamicHeadline />;
}

const translateSecondTabs = (number = Number()) => {
  switch (number) {
    case 1:
      return "home";
    case 2:
      return "about";
    case 3:
      return "sportsbook";
    case 4:
      return "livecasino";
    case 5:
      return "introduced";
    case 6:
      return "news";
    case 7:
      return "brand";
    case 8:
      return "partners";
    case 9:
      return "contactus";
    case 0:
    default:
      return "common";
  }
};

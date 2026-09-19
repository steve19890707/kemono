import { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import styled from "styled-components";
import { getStorageItem } from "../lib/toolFuntions";
// getEnvironment
// import { userDetect } from "../common-lib/lib/serverSideProps";
import { getData } from "../common-lib/lib";
import { langauge, langaugeTranslation } from "../lib/static";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs } from "../components/Tabs";
import ConfirmPopup from "../components/Popup/Confirm";
import { commonStyles } from "../styles/styles";
// api
import { apiGetCounterVisit, FetchGetHook } from "../pages/api";

const StyledHomePage = styled.div`
  .list-caption {
    margin-top: 20px;
    border-radius: 6px 6px 0 0;
    padding: 16px 20px;
    color: #fff;
    background-color: ${commonStyles.feature3};
  }
  .list-content {
    padding: 16px 20px;
    border-radius: 0 0 6px 6px;
    border: 1px dashed ${commonStyles.borderColor2};
    border-top: 0;
    span {
      color: #b0b0b0;
      &.active {
        color: ${commonStyles.feature2};
      }
    }
  }
`;

const HomePage = () => {
  const $defaultOrder = 0;
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder))
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const {
    data: counterVisitData,
    isLoading: counterVisitIsLoading,
    mutate: counterVisitMutate,
  } = FetchGetHook({
    defaultDataType: [],
    lang: langaugeTranslation(editLang),
    promise: apiGetCounterVisit,
    // success: (data) => {},
  });
  return (
    <>
      <Head>
        <meta
          key="description"
          name="description"
          content="404 - Page Not Found"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <AuthVerify>
        <StyledHomePage>
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
          <div className="list-caption">網站流量統計</div>
          <div className="list-content">
            <div className="list">
              本日訪客：
              <span className={`${!counterVisitIsLoading && "active"}`}>
                {counterVisitIsLoading
                  ? "(計算中...)"
                  : getData(counterVisitData, ["count_day"])}
              </span>{" "}
              人次(資料約30分鐘更新一次)
            </div>
            <div className="list">
              本月訪客：
              <span className={`${!counterVisitIsLoading && "active"}`}>
                {counterVisitIsLoading
                  ? "(計算中...)"
                  : getData(counterVisitData, ["count_month"])}
              </span>{" "}
              人次(資料約30分鐘更新一次)
            </div>
          </div>
        </StyledHomePage>
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
    </>
  );
};

const DynamicHome = dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
export default function Home() {
  return <DynamicHome />;
}
// export async function getServerSideProps({ req }) {
//   const { device } = userDetect(req.headers);
//   const proto =
//     req.headers["x-forwarded-proto"] || req.connection.encrypted
//       ? "https:"
//       : "http:";
//   return {
//     props: {
//       host: req.headers.host,
//       proto: proto,
//       device: device,
//       environment: getEnvironment(req.headers.host),
//     },
//   };
// }

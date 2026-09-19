import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { getStorageItem } from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { commonStyles } from "../styles/styles";
import { getData } from "../common-lib/lib";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs } from "../components/Tabs";
import Button from "../components/Button";
import AboveContentBtns from "../components/AboveContentBtns";
import UpdateAndCancel from "../components/UpdateAndCancel";
import ConfirmPopup from "../components/Popup/Confirm";
import SortDataList from "../components/SortDataList";
import DataCaption from "../components/DataCaption";
import NoData from "../components/NoData";
import CommonLoader from "../components/CommonLoader";
import ServicesPopup from "../components/Popup/ServicesPopup";
// icons
import { FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
// reducer
import { setLoader, setPopupType } from "../reducer/props";
// api
import {
  apiUpdateAction,
  apiPutServiceSort,
  apiGetServiceList,
  apiDeleteServiceData,
  FetchGetHook,
} from "../pages/api";

const StyledServices = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
    /* 額外增加100px高度 */
    height: calc(100vh - 300px);
    padding: 0 12px;
  }
  .data-list {
    padding: 20px 0;
    display: flex;
    align-items: center;
    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20%;
      &.padding {
        box-sizing: border-box;
        padding: 0 16px;
      }
      .text {
        margin-left: 5px;
        color: ${commonStyles.feature2};
      }
      svg {
        color: ${commonStyles.feature2};
        width: 24px;
        height: 24px;
      }
      &.close svg,
      &.close .text {
        color: #bbbbbb;
      }
      &.center {
        justify-content: center;
      }
    }
    .icon-img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
      border: 1px solid ${commonStyles.borderColor2};
    }
    .edit-btn {
      margin-right: 5px;
    }
    .delete-btn {
      background: ${commonStyles.cancel};
    }
    button {
      &.disable {
        background: ${commonStyles.borderColor};
        pointer-events: none;
      }
    }
  }
`;

const ServicesPage = () => {
  const $defaultOrder = 0;
  const dispatch = useDispatch();
  const popupType = useSelector((state) => state.props.popupType);
  const authorization = useSelector((state) => state.props.authorization);
  const [editLang, setEditLang] = useState(
    Number(getStorageItem("lang", $defaultOrder))
  );
  const [confirmLangPopup, setConfirmLangPopup] = useState({
    props: "",
    status: false,
  });
  const [confirmDeletePopup, setConfirmDeletePopup] = useState({
    props: "",
    caption: "",
    status: false,
  });
  const [updatePopup, setUpdatePopup] = useState(false);
  const [popupState, setPopupState] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [editId, setEditId] = useState("");
  // props
  const [listData, setListData] = useState([]);
  const [listSort, setListSort] = useState([]);
  const recoverData = (data = []) => {
    const newSort = [];
    data.map((v) => newSort.push(getData(v, ["id"])));
    setListData(data);
    setListSort(newSort);
  };
  const {
    data: serviceListData,
    isLoading: serviceListIsLoading,
    mutate: serviceListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    lang: langaugeTranslation(editLang),
    promise: apiGetServiceList,
    success: (data) => {
      recoverData(data || []);
    },
  });
  const FetchStatus = ({ status = true }) => {
    return <>{status ? <FaRegCheckCircle /> : <ImBlocked />}</>;
  };
  return (
    <>
      <AuthVerify>
        <StyledServices>
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
          <AboveContentBtns
            btnArray={[
              {
                text: `${isSorting ? "關閉" : "編輯"}排序`,
                className: `${isSorting ? "" : "edit"} ${
                  (serviceListIsLoading || serviceListData.length === 0) &&
                  "disable"
                }`,
                handler: () => {
                  recoverData(serviceListData || []);
                  setIsSorting((prev) => !prev);
                },
              },
              {
                text: "新增(服務項目)",
                className: `${
                  serviceListIsLoading || isSorting ? "disable" : "add"
                }`,
                handler: () => {
                  dispatch(setPopupType("create"));
                  setPopupState(true);
                },
              },
            ]}
          />
          <DataCaption
            captions={[
              "排序",
              "縮圖",
              `標題(英/${langauge[editLang]})`,
              "狀態",
              "操作",
            ]}
          />
          <div className="edit-content">
            {!serviceListIsLoading && serviceListData.length === 0 && (
              <NoData />
            )}
            {serviceListIsLoading ? (
              <CommonLoader />
            ) : (
              <SortDataList
                data={listData}
                isSorting={isSorting}
                Component={({ value, index }) => (
                  <>
                    <div className="data-list">
                      <div className="list">{index + 1}</div>
                      <div className="list">
                        {getData(value, ["icon"]) ? (
                          <img
                            className="icon-img"
                            alt=""
                            src={getData(value, ["icon"])}
                          />
                        ) : (
                          <span style={{ opacity: "0.5" }}>暫無縮圖:(</span>
                        )}
                      </div>
                      <div className="list">
                        ({getData(value, ["sub_title"])}){" "}
                        {getData(value, ["title"])}
                      </div>
                      <div
                        className={`list center ${
                          !getData(value, ["status"]) && "close"
                        }`}
                      >
                        <FetchStatus status={getData(value, ["status"])} />
                        <div className="text">
                          {getData(value, ["status"]) ? `啟用` : `關閉`}
                        </div>
                      </div>
                      <div className="list padding">
                        <Button
                          className={`edit-btn ${isSorting && "disable"}`}
                          disable={isSorting}
                          content="編輯"
                          onClick={() => {
                            dispatch(setPopupType("edit"));
                            setEditId(getData(value, ["id"]));
                            setPopupState(true);
                          }}
                        />
                        <Button
                          className={`delete-btn ${isSorting && "disable"}`}
                          disable={isSorting}
                          content="刪除"
                          onClick={() =>
                            setConfirmDeletePopup({
                              props: getData(value, ["id"]),
                              caption: getData(value, ["title"]),
                              status: true,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
                setData={(newlist) => setListData(newlist)}
                setListSort={(newArray) => setListSort(newArray)}
              />
            )}
            {isSorting && (
              <UpdateAndCancel
                styles={{ zIndex: 100 }}
                useCancel={false}
                // disableStatus={confirmLangPopup.status}
                dataUpdate={() => setUpdatePopup(true)}
              />
            )}
          </div>
        </StyledServices>
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
          content={`確定更新排序嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiPutServiceSort({ id: listSort }, authorization),
              success: (response) => {
                serviceListMutate();
                setIsSorting(false);
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
      {confirmDeletePopup.status && (
        <ConfirmPopup
          content={`確定刪除『 ${confirmDeletePopup.caption} 』嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiDeleteServiceData(
                { id: [confirmDeletePopup.props] },
                authorization
              ),
              success: (response) => {
                serviceListMutate();
                dispatch(setLoader(false));
                setConfirmDeletePopup({
                  props: "",
                  caption: "",
                  status: false,
                });
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setConfirmDeletePopup({
                  props: "",
                  caption: "",
                  status: false,
                });
              },
            });
          }}
          cancelPopup={() => {
            dispatch(setLoader(false));
            setConfirmDeletePopup({
              props: "",
              caption: "",
              status: false,
            });
          }}
        />
      )}
      {popupState && (
        <ServicesPopup
          lang={editLang}
          id={editId}
          apiCreateSucces={() => {
            serviceListMutate();
            popupType === "create" && setPopupState(false);
          }}
          cancelPopup={() => {
            setPopupState(false);
          }}
        />
      )}
    </>
  );
};

const DynamicManagement = dynamic(() => Promise.resolve(ServicesPage), {
  ssr: false,
});

export default function Services() {
  return <DynamicManagement />;
}

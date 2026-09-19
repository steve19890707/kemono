import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { getStorageItem } from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
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
import ActiviesPopup from "../components/Popup/ActivitiesPopup";
// icons
import { FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
// reducer
import { setLoader, setPopupType } from "../reducer/props";
// api
import {
  apiPutEventSort,
  apiDeleteEventData,
  apiGetEventList,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledActivities = styled.div`
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
      width: 25%;
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

const ActivitiesPage = () => {
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
    data: eventListData,
    isLoading: eventListIsLoading,
    mutate: eventListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    lang: langaugeTranslation(editLang),
    promise: apiGetEventList,
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
        <StyledActivities>
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
                  (eventListIsLoading || eventListData.length === 0) &&
                  "disable"
                }`,
                handler: () => {
                  recoverData(eventListData || []);
                  setIsSorting((prev) => !prev);
                },
              },
              {
                text: "新增(品牌活動)",
                className: `${
                  eventListIsLoading || isSorting ? "disable" : "add"
                }`,
                handler: () => {
                  dispatch(setPopupType("create"));
                  setPopupState(true);
                },
              },
            ]}
          />
          <DataCaption captions={["排序", "標題", "狀態", "操作"]} size={4} />
          <div className="edit-content">
            {!eventListIsLoading && eventListData.length === 0 && <NoData />}
            {eventListIsLoading ? (
              <CommonLoader />
            ) : (
              <SortDataList
                data={listData}
                isSorting={isSorting}
                Component={({ value, index }) => (
                  <>
                    <div className="data-list">
                      <div className="list">{index + 1}</div>
                      <div className="list">{getData(value, ["title"])}</div>
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
        </StyledActivities>
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
              promise: apiPutEventSort({ id: listSort }, authorization),
              success: (response) => {
                eventListMutate();
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
              promise: apiDeleteEventData(
                { id: [confirmDeletePopup.props] },
                authorization
              ),
              success: (response) => {
                eventListMutate();
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
        <ActiviesPopup
          lang={editLang}
          id={editId}
          apiCreateSucces={() => {
            eventListMutate();
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

const DynamicManagement = dynamic(() => Promise.resolve(ActivitiesPage), {
  ssr: false,
});

export default function Activities() {
  return <DynamicManagement />;
}

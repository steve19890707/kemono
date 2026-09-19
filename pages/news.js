import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled, { StyleSheetManager } from "styled-components";
import isValidProp from "@emotion/is-prop-valid";
import { getStorageItem, storageItemRemove } from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs } from "../components/Tabs";
import Button from "../components/Button";
import AboveContentBtns from "../components/AboveContentBtns";
import UpdateAndCancel from "../components/UpdateAndCancel";
import Category from "../components/Category";
import ConfirmPopup from "../components/Popup/Confirm";
import SortDataList from "../components/SortDataList";
import DataCaption from "../components/DataCaption";
import CommonLoader from "../components/CommonLoader";
import NoData from "../components/NoData";
import NewsPopup from "../components/Popup/NewsPopup";
// icons
import { FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
// reducer
import { setLoader, setPopupType } from "../reducer/props";
// api
import {
  apiGetNewsList,
  apiPutNewsSort,
  apiDeleteNewsData,
  apiGetCategory,
  apiUpdateAction,
  FetchGetHook,
  FetchGetCustomHook,
} from "../pages/api";

const StyledNews = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
    /* 額外增加100px & 變動高度 */
    height: ${({ dynamicHeightProps }) =>
      `calc(100vh - ${329 + dynamicHeightProps}px)`};
    margin-top: 0;
  }
  .list-edit-btns {
    border-top: 1px solid ${commonStyles.borderColor2};
    margin-top: 15px;
    padding-top: 15px;
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

const NewsPage = () => {
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
  const [spNoData, setSpNoData] = useState(false);
  const [editId, setEditId] = useState("");
  const [dynamicHeight, setDynamicHeight] = useState("");
  const [categoryCurrentId, setCategoryCurrentId] = useState("");
  const [categoryCurrentName, setCategoryCurrentName] = useState("");
  const [idIsLoading, setIdIsLoading] = useState(true);
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
    data: categoryListData,
    isLoading: categoryListIsLoading,
    mutate: categoryListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    lang: langaugeTranslation(editLang),
    promise: apiGetCategory,
    success: (data) => {
      setIdIsLoading(false);
      data.length === 0 && setSpNoData(true);
    },
  });
  const {
    data: newsListData,
    isLoading: newsListIsLoading,
    mutate: newsListMutate,
  } = FetchGetCustomHook({
    defaultDataType: [],
    resquestStoppen: idIsLoading || !categoryCurrentId,
    lang: langaugeTranslation(editLang),
    // params
    categoryId: categoryCurrentId,
    promise: apiGetNewsList,
    success: (data) => {
      recoverData(data || []);
    },
  });
  // for initail
  useEffect(() => {
    const getId = getData(categoryListData, [
      Number(getStorageItem("newscategory", 0)),
      "id",
    ]);
    const getName = getData(categoryListData, [
      Number(getStorageItem("newscategory", 0)),
      "name",
    ]);
    if (getId) {
      setCategoryCurrentId(getId);
      setCategoryCurrentName(getName);
    }
    //  else if (categoryListData.length === 0) {
    //   setIdIsLoading(false);
    // }
  }, [categoryListData]);

  useEffect(() => {
    const newsCategoryDiv = document.getElementById("news-category");
    if (newsListData && newsCategoryDiv) {
      setDynamicHeight(newsCategoryDiv.offsetHeight);
    }
  }, [newsListData]);

  const FetchStatus = ({ status = true }) => {
    return <>{status ? <FaRegCheckCircle /> : <ImBlocked />}</>;
  };
  return (
    <>
      <AuthVerify>
        <StyleSheetManager
          shouldForwardProp={(propName) => isValidProp(propName)}
        >
          <StyledNews dynamicHeightProps={dynamicHeight}>
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
            {categoryListIsLoading ? (
              <CommonLoader />
            ) : (
              <Category
                id="news-category"
                lang={editLang}
                categoryList={categoryListData || []}
                dataMutate={() => {
                  categoryListMutate();
                  newsListMutate();
                }}
                setId={setCategoryCurrentId}
                setName={setCategoryCurrentName}
              />
            )}
            <AboveContentBtns
              className="list-edit-btns"
              btnArray={[
                {
                  text: `${isSorting ? "關閉" : "編輯"}排序`,
                  className: `${isSorting ? "" : "edit"} ${
                    (categoryListIsLoading ||
                      newsListIsLoading ||
                      categoryListData.length === 0 ||
                      newsListData.length === 0) &&
                    "disable"
                  }`,
                  handler: () => {
                    recoverData(newsListData || []);
                    setIsSorting((prev) => !prev);
                  },
                },
                {
                  text: "新增(最新消息)",
                  className: `${
                    categoryListIsLoading ||
                    newsListIsLoading ||
                    isSorting ||
                    categoryListData.length === 0
                      ? "disable"
                      : "add"
                  }`,
                  handler: () => {
                    dispatch(setPopupType("create"));
                    setPopupState(true);
                  },
                },
              ]}
            />
            <DataCaption captions={["排序", "縮圖", "標題", "狀態", "操作"]} />
            <div className="edit-content">
              {((!newsListIsLoading &&
                newsListData.length === 0 &&
                !idIsLoading) ||
                spNoData) && <NoData />}
              {newsListIsLoading && categoryCurrentId ? (
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
                          {getData(value, ["cover_img"]) ? (
                            <img
                              className="icon-img"
                              alt=""
                              src={getData(value, ["cover_img"])}
                            />
                          ) : (
                            <span style={{ opacity: "0.5" }}>暫無縮圖:(</span>
                          )}
                        </div>
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
          </StyledNews>
        </StyleSheetManager>
      </AuthVerify>
      {confirmLangPopup.status && (
        <ConfirmPopup
          content={`確定切換成『 <span style='color:#f44336;'>${
            langauge[confirmLangPopup.props]
          }</span> 』? 尚未儲存的資料將會遺失。`}
          dataUpdate={() => {
            // to do api update
            setListData([]);
            storageItemRemove(["newscategory"]);
            setCategoryCurrentId("");
            setCategoryCurrentName("");
            setIdIsLoading(true);
            setSpNoData(false);
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
              promise: apiPutNewsSort({ id: listSort }, authorization),
              success: (response) => {
                newsListMutate();
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
              promise: apiDeleteNewsData(
                { id: [confirmDeletePopup.props] },
                authorization
              ),
              success: (response) => {
                newsListMutate();
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
        <NewsPopup
          categoryName={categoryCurrentName}
          lang={editLang}
          id={editId}
          categoryId={categoryCurrentId}
          categoryListData={categoryListData}
          apiCreateSucces={(categoryOrder = "none") => {
            categoryListMutate();
            if (categoryOrder !== "none") {
              localStorage.setItem("newscategory", categoryOrder);
            } else {
              newsListMutate();
            }
            popupType === "create" && setPopupState(false);
          }}
          cancelPopup={() => {
            setPopupState(false);
          }}
          CKEditor={DynamicCKEditor}
        />
      )}
    </>
  );
};

const DynamicCKEditor = dynamic(() => import("../components/CKEditor5"), {
  ssr: false,
});
const DynamicManagement = dynamic(() => Promise.resolve(NewsPage), {
  ssr: false,
});

export default function News() {
  return <DynamicManagement />;
}

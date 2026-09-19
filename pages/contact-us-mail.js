import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { getStorageItem, getDateFormString } from "../lib/toolFuntions";
import { langauge, langaugeTranslation } from "../lib/static";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// compoments
import AuthVerify from "../components/AuthVerify";
import { Tabs } from "../components/Tabs";
import DataCaption from "../components/DataCaption";
import DataList from "../components/DataList";
import ConfirmPopup from "../components/Popup/Confirm";
import ContactUsMailPopup from "../components/Popup/ContactUsMailPopup";
import CheckBox from "../components/CheckBox";
import CommonLoader from "../components/CommonLoader";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
// icon
import {
  RiCheckboxMultipleLine,
  RiCheckboxMultipleBlankLine,
  RiDeleteBin2Fill,
} from "react-icons/ri";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiDeleteContactUsData,
  apiGetContactusMailList,
  apiUpdateAction,
  FetchGetHook,
} from "../pages/api";

const StyledContactUsMail = styled.div`
  .edit-content {
    ${{ ...commonStyles["edit-tab-content"] }}
    /* 額外增加40px高度 */
    height: calc(100vh - 300px);
  }
  .data-list {
    border: 2px solid ${commonStyles.borderColor};
    border-radius: 6px;
    margin-bottom: 2px;
    padding: 25px 0;
    background-color: #f8f8f8;
    cursor: pointer;
    .list-content {
      width: calc(100% / 6);
      display: flex;
      align-items: center;
      justify-content: center;
      &.read {
        color: ${commonStyles.feature2};
      }
      &.checkbox {
        box-sizing: border-box;
        padding-left: 15px;
        input {
          margin: 0;
        }
        .check-name {
          margin: 0;
        }
      }
    }
    &:hover {
      color: ${commonStyles.feature2};
      background-color: #fff;
    }
  }
`;

const StyledSvgs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin: 0 5px;
    width: 24px;
    height: 24px;
    color: ${commonStyles.feature3};
    cursor: pointer;
    &:hover {
      color: ${commonStyles.feature2};
    }
  }
  .svg-icon {
    position: relative;
    &:hover {
      &::before,
      &::after {
        opacity: 1;
      }
    }
    &::before {
      content: "";
      opacity: 0;
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 0%;
      transform: translate(-50%, -100%);
      background-color: ${commonStyles.feature1};
      color: #fff;
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      white-space: nowrap;
      z-index: 2;
    }
    &::after {
      content: "";
      opacity: 0;
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 0%;
      transform: translate(-50%, 0%);
      border-top: 4px solid ${commonStyles.feature1};
      border-bottom: 4px solid transparent;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      z-index: 1;
    }
    &:nth-child(1)::before {
      content: "全部選取(當前頁面)";
    }
    &:nth-child(2)::before {
      content: "取消選取(全)";
    }
    &:nth-child(3)::before {
      content: "批次刪除";
    }
  }
`;

const ContactUsMailPage = () => {
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
  const [confirmDeletePopup, setConfirmDeletePopup] = useState({
    props: "",
    caption: "",
    status: false,
  });
  const [detailPopup, setDetailPopup] = useState({
    id: "",
    status: false,
  });
  const [page, setPage] = useState(1);
  const [limited, setLimited] = useState(12);
  const [datalist, setDataList] = useState([]);
  // delete
  const [deleteArray, setDeleteArray] = useState([]);
  const [currentAllIdList, setCurrentAllIdList] = useState([]);
  const {
    data: contactusMailListData,
    isLoading: contactusMailListIsLoading,
    mutate: contactusMailListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    lang: langaugeTranslation(editLang),
    promise: apiGetContactusMailList,
    success: (data) => {
      const update = [...data].reverse();
      setDataList(update);
    },
  });
  return (
    <>
      <AuthVerify>
        <StyledContactUsMail>
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
          <DataCaption
            captions={[
              <StyledSvgs>
                <div
                  className="svg-icon"
                  onClick={() => setDeleteArray(currentAllIdList)}
                >
                  <RiCheckboxMultipleLine />
                </div>
                <div className="svg-icon" onClick={() => setDeleteArray([])}>
                  <RiCheckboxMultipleBlankLine />
                </div>
                <div
                  className="svg-icon"
                  onClick={() => {
                    if (deleteArray.length > 0) {
                      setConfirmDeletePopup({
                        props: "",
                        caption: "",
                        status: true,
                      });
                    }
                  }}
                >
                  <RiDeleteBin2Fill />
                </div>
              </StyledSvgs>,
              "日期",
              "訪客姓名",
              "聯絡電話",
              "電子郵件",
              "讀取狀態",
            ]}
          />
          {!contactusMailListIsLoading &&
            contactusMailListData.length === 0 && <NoData />}
          {contactusMailListIsLoading ? (
            <CommonLoader />
          ) : (
            <Pagination
              contentClass="edit-content"
              page={page}
              limited={limited}
              list={datalist}
              setPage={setPage}
              setLimited={setLimited}
              setDeleteArray={setDeleteArray}
              setCurrentIdList={setCurrentAllIdList}
              ListComponents={({ value }) => (
                <>
                  <DataList
                    className="data-list"
                    onClick={(e) => {
                      const checkbox = document.getElementById(
                        `checkbox-${getData(value, ["id"])}`
                      );
                      if (checkbox && !checkbox.contains(e.target)) {
                        setDetailPopup({
                          id: getData(value, ["id"]),
                          status: true,
                        });
                      }
                    }}
                  >
                    <div className="list-content checkbox">
                      <CheckBox
                        id={`checkbox-${getData(value, ["id"])}`}
                        checked={deleteArray.find(
                          (v) => v === getData(value, ["id"])
                        )}
                        onChange={() => {
                          setDeleteArray((prev) => {
                            if (
                              prev.find((v) => v === getData(value, ["id"]))
                            ) {
                              return prev.filter(
                                (v) => v !== getData(value, ["id"])
                              );
                            } else {
                              return [...prev, getData(value, ["id"])];
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="list-content">
                      {getDateFormString(getData(value, ["created_at"]))}
                    </div>
                    <div className="list-content">
                      {getData(value, ["name"])}
                    </div>
                    <div className="list-content">
                      {getData(value, ["tel"])}
                    </div>
                    <div className="list-content">
                      {getData(value, ["email"])}
                    </div>
                    <div
                      className={`list-content ${
                        getData(value, ["status"]) === 2 ? "read" : "unread"
                      }`}
                    >
                      {getData(value, ["status"]) === 2 ? "已讀" : "未讀"}
                    </div>
                  </DataList>
                </>
              )}
            />
          )}
        </StyledContactUsMail>
      </AuthVerify>
      {detailPopup.status && (
        <ContactUsMailPopup
          lang={editLang}
          id={detailPopup.id}
          apiCreateSucces={() => {
            contactusMailListMutate();
          }}
          cancelPopup={() => {
            setDetailPopup({ id: "", status: false });
          }}
          CKEditor={DynamicCKEditor}
        />
      )}
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
      {confirmDeletePopup.status && (
        <ConfirmPopup
          content={`確定刪除『 以上勾選信件 』嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiDeleteContactUsData(
                { id: deleteArray },
                authorization
              ),
              success: (response) => {
                contactusMailListMutate();
                dispatch(setLoader(false));
                setDeleteArray([]);
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
    </>
  );
};

const DynamicCKEditor = dynamic(() => import("../components/CKEditor5"), {
  ssr: false,
});
const DynamicManagement = dynamic(() => Promise.resolve(ContactUsMailPage), {
  ssr: false,
});

export default function ContactUsMail() {
  return <DynamicManagement />;
}

// const buildtestdata = () => {
//   const array = [];
//   for (let i = 0; i < 120; i++) {
//     array.push({
//       id: i + 1,
//       date: `2024-01-01`,
//       name: "adam",
//       tel: "+66 8 3985 0171",
//       mail: `${i + 1}@gmail.com`,
//       status: false,
//     });
//   }
//   return array;
// };

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Switch from "react-switch";
import { langaugeTranslation } from "../lib/static";
import { storageItemInitial, getStorageItem } from "../lib/toolFuntions";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
import { EditTabs } from "./Tabs";
import noop from "lodash.noop";
// icon
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaArrowTurnUp } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
// compoments
import Input from "./Input";
import Button from "./Button";
import ConfirmPopup from "../components/Popup/Confirm";
// reducer
import { setLoader, setTemporaryList } from "../reducer/props";
// api
import {
  apiUpdateAction,
  apiPostCategoryCreate,
  apiDeleteCategoryData,
  apiPutCategorySort,
  apiPutCategoryUpdate,
} from "../pages/api";

const StyledCategory = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  .empty-tip {
    opacity: 0.5;
  }
  .add-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .svg-IoMdAddCircleOutline {
    width: 26px;
    height: 26px;
    margin-left: 5px;
    cursor: pointer;
    &.active {
      color: ${commonStyles.feature1};
    }
  }
  .btns-area {
    display: flex;
    align-items: center;
    border: 1px dashed ${commonStyles.borderColor2};
    border-radius: 6px;
    background-color: #efefef;
    padding: 10px 12px;
    margin-right: 12px;
  }
  .reorder-btn {
    border-radius: 4px;
    border: 0;
    padding: 6px 8px;
    margin-right: 5px;
    color: #fff;
    white-space: nowrap;
    background: linear-gradient(to bottom, #ffc107, #ff9800);
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.cancel {
      background: linear-gradient(to bottom, #929292, #353535);
    }
  }
`;

const FloatEditPopup = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: -13px;
  z-index: 2;
  background-color: #fff;
  box-shadow: 0 2px 3px 1px ${commonStyles.borderColor2};
  border-radius: 6px;
  padding: 20px;
  .title-block {
    position: relative;
    text-align: center;
    color: ${commonStyles.borderColor2};
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${commonStyles.borderColor2};
    .svg-FaArrowTurnUp {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .delete-btn {
    position: absolute;
    top: -8px;
    left: 0;
    border-radius: 6px;
    border: 1px solid ${commonStyles.cancel};
    display: inline-flex;
    align-items: center;
    padding: 4px;
    color: ${commonStyles.cancel};
    cursor: pointer;
    span {
      padding-right: 2px;
    }
  }
  .info-block {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .caption {
      min-width: 50px;
    }
  }
  .btns-block {
    display: flex;
    align-items: center;
    padding-top: 10px;
    button {
      margin: 0 2px;
    }
    .update {
      background-color: ${commonStyles.feature1};
    }
  }
`;

const updateTemporaryList = (list, id, update) => {
  const newList = [];
  for (let i = 0; i < list.length; i++) {
    if (getData(list, [i, "id"]) === id) {
      newList.push(update);
    } else {
      newList.push(list[i]);
    }
  }

  return newList;
};

const EditPopup = ({
  className = "",
  categoryList = [],
  id = 0,
  status = false,
  isAdd = false,
  input = "",
  setPopupStatus = noop,
  setUpdatePopup = noop,
}) => {
  const dispatch = useDispatch();
  const temporaryList = useSelector((state) => state.props.temporaryList);
  // update props
  const [tabStatus, setTabStatus] = useState(status);
  const [inputVal, setInputVal] = useState(input);
  return (
    <FloatEditPopup className={className}>
      <div className="title-block">
        {!isAdd && (
          <div
            className="delete-btn"
            onClick={() => {
              dispatch(
                setTemporaryList(
                  updateTemporaryList(temporaryList, id, {
                    id: id,
                    name: inputVal,
                    status: tabStatus,
                  })
                )
              );
              setUpdatePopup({
                case: `delete`,
                content: `刪除標籤`,
                props: [id],
                status: true,
              });
            }}
          >
            <span>刪除</span>
            <RiDeleteBinLine />
          </div>
        )}
        {isAdd ? `創建` : `更新`}
        <FaArrowTurnUp className="svg-FaArrowTurnUp" />
      </div>
      <div className="info-block">
        <div className="caption">啟用：</div>
        <Switch checked={tabStatus} onChange={(e) => setTabStatus(e)} />
      </div>
      <div className="info-block">
        <div className="caption">名稱：</div>
        <Input
          placeholder="標籤名稱"
          keyValue={inputVal}
          setKeyValue={(val) => setInputVal(val)}
        />
      </div>
      <div className="btns-block">
        <Button
          content={isAdd ? `創建` : `更新`}
          className="update"
          onClick={() => {
            !isAdd &&
              dispatch(
                setTemporaryList(
                  updateTemporaryList(temporaryList, id, {
                    id: id,
                    name: inputVal,
                    status: tabStatus,
                  })
                )
              );
            setUpdatePopup({
              case: isAdd ? `create` : `update`,
              content: isAdd ? `創建標籤` : `更新標籤`,
              props: {
                id: id,
                input: inputVal,
                status: tabStatus,
              },
              status: true,
            });
          }}
        />
        <Button
          content="取消"
          onClick={() => {
            dispatch(setTemporaryList(categoryList));
            setPopupStatus(false);
          }}
        />
      </div>
    </FloatEditPopup>
  );
};

const filterOrderId = (list = [], id = 0) => {
  let order = 0;
  list.find((v, k) => {
    if (v === id) {
      order = k;
      return;
    }
  });
  return order;
};
export default function Category({
  id = "",
  lang = "",
  categoryList = [],
  defaultOrder = 0,
  dataMutate = noop,
  setId = noop,
  setName = noop,
}) {
  storageItemInitial("newscategory", defaultOrder);
  const dispatch = useDispatch();
  const authorization = useSelector((state) => state.props.authorization);
  const temporaryList = useSelector((state) => state.props.temporaryList);
  const $defaultUpdateProps = {
    case: "",
    content: "",
    props: {},
    status: false,
  };
  const [updatePopup, setUpdatePopup] = useState($defaultUpdateProps);
  const [tabOrder, setTabOrder] = useState(
    Number(getStorageItem("newscategory", defaultOrder))
  );
  const [isAdd, setIsAdd] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [sortingsOrderId, setSortingsOrderId] = useState(0);
  useEffect(() => {
    dispatch(setTemporaryList(categoryList));
  }, [categoryList]);
  return (
    <>
      <StyledCategory id={id}>
        {categoryList.length > 0 && (
          <div className="btns-area">
            {isOrder ? (
              <>
                <button
                  className="reorder-btn"
                  onClick={() =>
                    setUpdatePopup((prev) => {
                      return {
                        ...prev,
                        case: "sort",
                        content: "更新排序",
                        status: true,
                      };
                    })
                  }
                >
                  更新
                </button>
                <button
                  className="reorder-btn cancel"
                  onClick={() => {
                    setIsOrder(false);
                    dataMutate();
                  }}
                >
                  還原
                </button>
              </>
            ) : (
              <button
                className="reorder-btn"
                onClick={() => {
                  setIsOrder(true);
                  setIsAdd(false);
                  setSortingsOrderId(getData(categoryList, [tabOrder, "id"]));
                }}
              >
                重新排序
              </button>
            )}
          </div>
        )}
        <EditTabs
          order={Number(getStorageItem("newscategory", defaultOrder))}
          isAdd={isAdd}
          value={tabOrder}
          list={categoryList}
          reorderStatus={isOrder}
          cancelStatus={setIsAdd}
          onClick={(props) => {
            setId(getData(categoryList, [props, "id"]));
            setName(getData(categoryList, [props, "name"]));
            setTabOrder(props);
          }}
          onUpdateSort={(list) =>
            setUpdatePopup((prev) => {
              return {
                ...prev,
                props: list,
              };
            })
          }
          FloatComponent={({ index = 0, setPopupStatus = noop }) => (
            <EditPopup
              categoryList={categoryList}
              isAdd={isAdd}
              id={getData(temporaryList, [index, "id"])}
              input={getData(temporaryList, [index, "name"])}
              status={getData(temporaryList, [index, "status"])}
              setPopupStatus={setPopupStatus}
              setUpdatePopup={setUpdatePopup}
            />
          )}
        />
        {categoryList.length === 0 && (
          <div className="empty-tip">暫無分類，請點選(+)號新增分類：</div>
        )}
        {!isOrder && (
          <div className="add-icon">
            <IoMdAddCircleOutline
              className={`svg-IoMdAddCircleOutline ${isAdd && "active"}`}
              onClick={() => setIsAdd(true)}
            />
            {isAdd && (
              <EditPopup
                isAdd={isAdd}
                setPopupStatus={setIsAdd}
                setUpdatePopup={setUpdatePopup}
              />
            )}
          </div>
        )}
      </StyledCategory>
      {updatePopup.status && (
        <ConfirmPopup
          content={`確定要${updatePopup.content}嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            switch (updatePopup.case) {
              case "create":
                apiUpdateAction({
                  promise: apiPostCategoryCreate(
                    {
                      class: "news", //固定參數
                      lang: langaugeTranslation(lang),
                      name: getData(updatePopup, ["props", "input"]),
                      status: getData(updatePopup, ["props", "status"]),
                    },
                    authorization
                  ),
                  success: (response) => {
                    localStorage.setItem("newscategory", 0);
                    dispatch(setLoader(false));
                    dataMutate();
                  },
                  unsuccessfully: () => {
                    dispatch(setLoader(false));
                    setUpdatePopup($defaultUpdateProps);
                  },
                });
                break;
              case "update":
                apiUpdateAction({
                  promise: apiPutCategoryUpdate(
                    {
                      class: "news", //固定參數
                      id: getData(updatePopup, ["props", "id"]),
                      lang: langaugeTranslation(lang),
                      name: getData(updatePopup, ["props", "input"]),
                      status: getData(updatePopup, ["props", "status"]),
                    },
                    authorization
                  ),
                  success: (response) => {
                    dispatch(setLoader(false));
                    dataMutate();
                  },
                  unsuccessfully: () => {
                    dispatch(setLoader(false));
                    setUpdatePopup($defaultUpdateProps);
                  },
                });
                break;
              case "sort":
                localStorage.setItem(
                  "newscategory",
                  filterOrderId(
                    getData(updatePopup, ["props"]),
                    sortingsOrderId
                  )
                );
                apiUpdateAction({
                  promise: apiPutCategorySort(
                    {
                      id: getData(updatePopup, ["props"]),
                    },
                    authorization
                  ),
                  success: (response) => {
                    dispatch(setLoader(false));
                    dataMutate();
                  },
                  unsuccessfully: () => {
                    dispatch(setLoader(false));
                    setUpdatePopup($defaultUpdateProps);
                  },
                });
                break;
              case "delete":
                localStorage.setItem("newscategory", 0);
                apiUpdateAction({
                  promise: apiDeleteCategoryData(
                    {
                      id: getData(updatePopup, ["props"]),
                    },
                    authorization
                  ),
                  success: (response) => {
                    dispatch(setLoader(false));
                    dataMutate();
                  },
                  unsuccessfully: () => {
                    dispatch(setLoader(false));
                    setUpdatePopup($defaultUpdateProps);
                  },
                });
                break;
              default:
                break;
            }
          }}
          cancelPopup={() => {
            dispatch(setLoader(false));
            setUpdatePopup($defaultUpdateProps);
          }}
        />
      )}
    </>
  );
}

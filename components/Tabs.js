import { useEffect, useState } from "react";
import styled from "styled-components";
import cx from "classnames";
import noop from "lodash.noop";
import { ReactSortable } from "react-sortablejs";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
import { storageItemInitial, getStorageItem } from "../lib/toolFuntions";
// icons
import { BsGlobeAmericas } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { PiHandTapLight } from "react-icons/pi";

const StyledTabs = styled.div`
  display: flex;
  align-items: center;
  .svg-icon {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    color: ${commonStyles.feature3};
  }
  .tab {
    text-align: center;
    min-width: 50px;
    padding: 10px 14px;
    margin: 0 3px;
    border: 1px solid #000;
    border-radius: 6px 6px 0 0;
    background: #fff;
    transition: 0.1s;
    cursor: pointer;
    &.active {
      background: ${commonStyles.feature3};
      border: 1px solid ${commonStyles.feature3};
      color: #fff;
    }
  }
`;

const initialArray = (list = [], order = 0) => {
  const array = [];
  list.forEach((val, key) =>
    array.push({
      index: key,
      name: val,
      status: order === key ? true : false,
    })
  );
  return array;
};

const initialEditArray = (list = [], order = 0) => {
  const array = [];
  list.forEach((val, key) =>
    array.push({
      index: key,
      data: { ...val },
      status: order === key ? true : false,
    })
  );
  return array;
};

const TabsIcon = ({ type = "" }) => {
  switch (type) {
    case "lang":
      return <BsGlobeAmericas className="svg-icon" />;
    default:
      return <></>;
  }
};

export const Tabs = ({
  list = [],
  order = 0,
  value = "",
  type = "",
  className = "",
  styles = {},
  onClick = noop,
  onUpdate = noop,
}) => {
  storageItemInitial("lang", order);
  const [tabList, setTabList] = useState(
    initialArray(list, Number(getStorageItem("lang", order)))
  );
  const arrayUpdate = (index = 0) => {
    const update = [];
    tabList.forEach((val) =>
      update.push({
        ...val,
        status: val.index === index ? true : false,
      })
    );
    localStorage.setItem("lang", index);
    setTabList(update);
    onUpdate(index);
  };
  useEffect(() => {
    arrayUpdate(value);
  }, [value]);
  return (
    <StyledTabs style={styles} className={className}>
      <TabsIcon type={type} />
      {tabList.map((val, key) => (
        <div
          className={cx("tab", { active: tabList[key].status })}
          key={key}
          onClick={() => onClick(val.index)}
        >
          <span>{val.name}</span>
        </div>
      ))}
    </StyledTabs>
  );
};

const StyledSecondTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .tab {
    text-align: center;
    min-width: 50px;
    padding: 8px 12px;
    margin: 3px 3px;
    border: 1px solid #000;
    border-radius: 6px;
    background: #fff;
    font-size: 12px;
    transition: 0.1s;
    cursor: pointer;
    &.active {
      background: ${commonStyles.feature3};
      border: 1px solid ${commonStyles.feature3};
      color: #fff;
    }
  }
`;

export const SecondTabs = ({
  list = [],
  order = 0,
  value = "",
  className = "",
  styles = {},
  onClick = noop,
  onUpdate = noop,
}) => {
  const [tabList, setTabList] = useState(initialArray(list, order));
  const arrayUpdate = (index = 0) => {
    const update = [];
    tabList.forEach((val) =>
      update.push({
        ...val,
        status: val.index === index ? true : false,
      })
    );
    setTabList(update);
    onUpdate(index);
  };
  useEffect(() => {
    arrayUpdate(value);
  }, [value]);
  return (
    <StyledSecondTabs className={className} style={styles}>
      {tabList.map((val, key) => (
        <div
          className={cx("tab", { active: tabList[key].status })}
          key={key}
          onClick={() => {
            // arrayUpdate(tabList, val.index, setTabList);
            onClick(val.index);
          }}
        >
          <span>{val.name}</span>
        </div>
      ))}
    </StyledSecondTabs>
  );
};

const StyledEditTabs = styled.div`
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .dropArea {
    position: relative;
    overflow: hidden;
  }
  .dropArea::before {
    content: "";
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
  }
  .tab {
    position: relative;
    margin: 15px 3px;
    border: 1px solid ${commonStyles.borderColor2};
    border-radius: 6px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .selected {
      text-align: center;
      min-width: 50px;
      padding: 8px 12px;
      font-size: 14px;
      border-right: 1px solid ${commonStyles.borderColor2};
      color: #8a8a8a;
      cursor: pointer;
    }
    .svg-FaToggleOn,
    .svg-FaToggleOff {
      position: absolute;
      top: 0;
      right: 6px;
      transform: translateY(calc(-100% - 2px));
      width: 20px;
      height: 20px;
      pointer-events: none;
    }
    .svg-FaToggleOn {
      color: green;
    }
    .svg-FaToggleOff {
      color: ${commonStyles.borderColor2};
    }
    &.status {
      border: 1px solid #000;
      .selected {
        border-right: 1px solid #000;
        color: #000;
      }
    }
    &.active .selected {
      background: ${commonStyles.feature3};
      color: #fff;
    }
    &.isOrder {
      border: 1px solid ${commonStyles.feature1};
      color: ${commonStyles.feature1};
      .selected {
        border-right: 1px solid ${commonStyles.feature1};
        pointer-events: none;
      }
      &.active .selected {
        background: ${commonStyles.feature1};
      }
    }
    .svg-icon {
      width: 18px;
      height: 18px;
      margin: 0 6px;
      cursor: pointer;
      &.active {
        color: ${commonStyles.feature1};
      }
    }
    .move {
      color: #000;
      cursor: move;
    }
  }
`;

const TabBlock = ({
  children,
  focusNumber = 0,
  index = 0,
  className = "",
  reorderStatus = false,
  isAdd = false,
  PopupComps = noop,
}) => {
  const [popupStatus, setPopupStatus] = useState(false);
  useEffect(() => {
    if (isAdd || reorderStatus || focusNumber !== index) {
      setPopupStatus(false);
    }
  }, [isAdd, reorderStatus, index, focusNumber]);
  return (
    <div className={className}>
      {children}
      <PopupComps
        index={index}
        popupStatus={popupStatus}
        setPopupStatus={setPopupStatus}
      />
    </div>
  );
};

export const EditTabs = ({
  list = [],
  order = 0,
  isAdd = false,
  value = "",
  reorderStatus = false,
  className = "",
  styles = {},
  cancelStatus = noop,
  FloatComponent = noop,
  onClick = noop,
  onUpdate = noop,
  onUpdateSort = noop,
}) => {
  const [tabList, setTabList] = useState(initialEditArray(list, order));
  const [focusNumber, setFocusNumber] = useState(0);
  const newListSortHandler = (list) => {
    const newSort = [];
    list.map((v) => newSort.push(getData(v, ["data", "id"])));
    return newSort;
  };
  const arrayUpdate = (index = 0) => {
    const update = [];
    tabList.forEach((val) =>
      update.push({
        ...val,
        status: val.index === index ? true : false,
      })
    );
    setTabList(update);
    onUpdate(index);
  };
  useEffect(() => {
    arrayUpdate(value);
  }, [value]);
  return (
    <StyledEditTabs className={className} style={styles}>
      <ReactSortable
        list={tabList}
        setList={(newList) => {
          setTabList(newList);
          onUpdateSort(newListSortHandler(newList));
        }}
        ghostClass="dropArea"
        handle=".dragHandle"
        filter=".ignoreDrag"
        preventOnFilter={true}
        className="grid-container"
      >
        <>
          {tabList.map((val, key) => (
            <TabBlock
              className={cx("tab", {
                active: tabList[key].status,
                status: getData(tabList, [key, "data", "status"]),
                isOrder: reorderStatus,
              })}
              key={key}
              focusNumber={focusNumber}
              index={key}
              reorderStatus={reorderStatus}
              isAdd={isAdd}
              PopupComps={({ index, popupStatus, setPopupStatus }) => (
                <>
                  {getData(tabList, [index, "data", "status"]) ? (
                    <FaToggleOn className="svg-FaToggleOn" />
                  ) : (
                    <FaToggleOff className="svg-FaToggleOff" />
                  )}
                  {reorderStatus ? (
                    <PiHandTapLight className="svg-icon move dragHandle" />
                  ) : (
                    <FaGear
                      className={`svg-icon ${popupStatus && "active"}`}
                      onClick={() => {
                        setPopupStatus(true);
                        cancelStatus(false);
                        setFocusNumber(index);
                      }}
                    />
                  )}
                  {popupStatus && (
                    <FloatComponent
                      index={index}
                      // data={getData(list, [index], {})}
                      setPopupStatus={setPopupStatus}
                    />
                  )}
                </>
              )}
            >
              <div
                className="selected"
                onClick={() => {
                  // arrayUpdate(tabList, val.index, setTabList);
                  if (!reorderStatus) {
                    onClick(val.index);
                    localStorage.setItem("newscategory", val.index);
                  }
                  cancelStatus(false);
                }}
              >
                {getData(val, ["data", "name"])}
              </div>
            </TabBlock>
          ))}
        </>
      </ReactSortable>
    </StyledEditTabs>
  );
};

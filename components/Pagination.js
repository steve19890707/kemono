import React, { useEffect, useState } from "react";
import styled from "styled-components";
import cx from "classnames";
import noop from "lodash.noop";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// icons
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

const StyledPagination = styled.div`
  .pagination {
    position: relative;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .number {
      font-size: 18px;
      padding: 0 5px;
      cursor: pointer;
      &.active,
      &:hover {
        color: ${commonStyles.feature2};
      }
    }
    svg {
      width: 28px;
      height: 28px;
      cursor: pointer;
      &:hover {
        color: ${commonStyles.feature2};
      }
    }
    .close {
      color: ${commonStyles.borderColor};
      pointer-events: none;
    }
    .limited-operation {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      span {
        color: ${commonStyles.borderColor2};
      }
    }
    .limited-number {
      border: 1px solid ${commonStyles.feature3};
      border-radius: 6px;
      padding: 4px 6px;
      margin-right: 5px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:hover,
      &.active {
        color: ${commonStyles.feature2};
        border: 1px solid ${commonStyles.feature2};
      }
    }
  }
`;

const mappingPages = (size = 1, limited = 1) => {
  const totalPage = Math.ceil(Number(size) / Number(limited));
  let array = [];
  for (let i = 0; i < totalPage; i++) {
    array.push(i + 1);
  }
  return array;
};

const mappingData = (list = [], page = 1, limited = 1) => {
  const start = page * limited - limited + 1;
  const end = page * limited;
  let array = [];
  for (let i = 0; i < list.length; i++) {
    if (i + 1 >= start && i + 1 <= end) {
      array.push(list[i]);
    }
  }
  return array;
};

const mappingAllSelectedList = (list = [], page = 1, limited = 1) => {
  const start = page * limited - limited + 1;
  const end = page * limited;
  let array = [];
  for (let i = 0; i < list.length; i++) {
    if (i + 1 >= start && i + 1 <= end) {
      array.push(getData(list, [i, "id"]));
    }
  }
  return array;
};

export default function Pagination({
  className = "",
  contentClass = "",
  page = 1,
  limited = 12,
  list = [],
  ListComponents,
  setPage = noop,
  setLimited = noop,
  setDeleteArray = noop,
  setCurrentIdList = noop,
}) {
  const $defaultMaxSize = 5;
  const [maxSize, setMaxSize] = useState($defaultMaxSize);
  const dataList = mappingData(list, page, limited);
  const pagesList = mappingPages(list.length, limited);
  useEffect(() => {
    const update = mappingAllSelectedList(list, page, limited);
    setCurrentIdList(update);
  }, [list, page, limited]);
  return (
    <StyledPagination className={className}>
      <div className={contentClass}>
        {dataList.map((value, key) => (
          <ListComponents key={key} value={value} index={key} />
        ))}
      </div>
      <div className="pagination">
        <MdOutlineKeyboardDoubleArrowLeft
          className={cx({ close: page === 1 })}
          onClick={() => {
            setDeleteArray([]);
            setMaxSize($defaultMaxSize);
            setPage(1);
          }}
        />
        <IoMdArrowDropleft
          className={cx({ close: page === 1 })}
          onClick={() => {
            setDeleteArray([]);
            setMaxSize((prev) => {
              if (prev - 1 < $defaultMaxSize) {
                return prev;
              } else return (prev -= 1);
            });
            setPage((prev) => {
              if (prev === 1) {
                return prev;
              } else return (prev -= 1);
            });
          }}
        />
        {maxSize > $defaultMaxSize && <div>...</div>}
        {pagesList.map((val, key) => {
          if (key + 1 > maxSize || key + 1 <= maxSize - $defaultMaxSize) {
            return <React.Fragment key={key} />;
          } else {
            return (
              <div
                key={key}
                className={cx("number", { active: page === key + 1 })}
                onClick={() => {
                  setDeleteArray([]);
                  setPage(val);
                }}
              >
                {val}
              </div>
            );
          }
        })}
        {maxSize < pagesList.length && <div>...</div>}
        <IoMdArrowDropright
          className={cx({
            close: list.length < limited || page === pagesList.length,
          })}
          onClick={() => {
            setDeleteArray([]);
            setMaxSize((prev) => {
              if (prev + 1 > pagesList.length || prev > page) {
                return prev;
              } else return (prev += 1);
            });
            setPage((prev) => {
              if (prev === page * pagesList.length) {
                return prev;
              } else return (prev += 1);
            });
          }}
        />
        <MdOutlineKeyboardDoubleArrowRight
          className={cx({
            close: list.length < limited || page === pagesList.length,
          })}
          onClick={() => {
            setDeleteArray([]);
            setMaxSize(pagesList.length);
            setPage(pagesList.length);
          }}
        />
        <div className="limited-operation">
          <span>顯示筆數：</span>
          <div
            className={cx("limited-number", { active: limited === 12 })}
            onClick={() => {
              setDeleteArray([]);
              setMaxSize($defaultMaxSize);
              setPage(1);
              setLimited(12);
            }}
          >
            12
          </div>
          <div
            className={cx("limited-number", { active: limited === 50 })}
            onClick={() => {
              setDeleteArray([]);
              setMaxSize($defaultMaxSize);
              setPage(1);
              setLimited(50);
            }}
          >
            50
          </div>
          <div
            className={cx("limited-number", { active: limited === 100 })}
            onClick={() => {
              setDeleteArray([]);
              setMaxSize($defaultMaxSize);
              setPage(1);
              setLimited(100);
            }}
          >
            100
          </div>
        </div>
      </div>
    </StyledPagination>
  );
}

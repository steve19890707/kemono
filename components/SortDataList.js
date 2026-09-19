import styled, { StyleSheetManager } from "styled-components";
import isValidProp from "@emotion/is-prop-valid";
import noop from "lodash.noop";
import { ReactSortable } from "react-sortablejs";
import { commonStyles } from "../styles/styles";
import { getData } from "../common-lib/lib";
// icons
import { PiHandTapLight } from "react-icons/pi";
const StyledSortDataList = styled.div`
  .dataList-container {
  }
  .dropArea {
    position: relative;
  }
  .dropArea::before {
    content: "";
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
  }
`;

const StyledDataList = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px solid ${commonStyles.borderColor2};
  background-color: #fff;
  &.dragHandle {
    border: 1px solid ${commonStyles.feature1};
    overflow: hidden;
    cursor: move;
  }
  .move {
    position: absolute;
    top: 50%;
    left: 25px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50px;
    background: linear-gradient(to bottom, #fff, #e7e7e7);
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
    transform: translateY(-50%) scale(1);
    svg {
      width: 22px;
      height: 22px;
      /* color: #fff; */
    }
  }
`;

export default function SortDataList({
  data = [],
  isSorting = false,
  Component = noop,
  setData = noop,
  setListSort = noop,
}) {
  // Drag and Drop Handler
  const onDragDropEnds = (oldIndex, newIndex) => {
    // console.log("Drag and drop other tasks");
  };
  const newListSortHandler = (list) => {
    const newSort = [];
    list.map((v) => newSort.push(getData(v, ["id"])));
    return newSort;
  };
  return (
    <StyleSheetManager shouldForwardProp={(propName) => isValidProp(propName)}>
      <StyledSortDataList>
        <ReactSortable
          list={data}
          setList={(newlist) => {
            setData(newlist);
            setListSort(newListSortHandler(newlist));
          }}
          ghostClass="dropArea"
          handle=".dragHandle"
          filter=".ignoreDrag"
          preventOnFilter={true}
          className="dataList-container"
          onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
        >
          <>
            {data.map((val, key) => (
              <StyledDataList
                key={key}
                className={`${isSorting && "dragHandle"}`}
              >
                {isSorting && (
                  <div className="move">
                    <PiHandTapLight />
                  </div>
                )}
                <Component value={val} index={key} />
              </StyledDataList>
            ))}
          </>
        </ReactSortable>
      </StyledSortDataList>
    </StyleSheetManager>
  );
}

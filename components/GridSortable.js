import styled from "styled-components";
import noop from "lodash.noop";
import { ReactSortable } from "react-sortablejs";
import { commonStyles } from "../styles/styles";
// icons
import { IoMdAddCircleOutline } from "react-icons/io";
import { PiHandTapLight } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

const StyledGridSortable = styled.div`
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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

const StyledGrid = styled.div`
  position: relative;
  width: calc(25% - 16px);
  margin: 7px;
  min-height: 200px;
  border-radius: 6px;
  border: 1px solid ${commonStyles.feature3};
  background-color: #fff;
  overflow: hidden;
  .move {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50px;
    background: linear-gradient(to bottom, #fff, #e7e7e7);
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
    cursor: move;
    transition: 0.2s;
    svg {
      width: 22px;
      height: 22px;
      /* color: #fff; */
    }
    &:hover {
      transform: scale(1.2);
    }
  }
  .remove {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50px;
    background: linear-gradient(to bottom, #828282, #353535);
    /* box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2); */
    cursor: pointer;
    svg {
      width: 20px;
      height: 20px;
      color: #fff;
    }
  }
`;

const StyledAddGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  margin: 14px 7px;
  min-height: 50px;
  border-radius: 50px;
  background: linear-gradient(#efefef, #a5a5a5);
  cursor: pointer;
  svg {
    width: 40px;
    height: 40px;
    color: ${commonStyles.feature3};
  }
`;

export default function GridSortable({
  data = [],
  defalutData = {
    link: "",
    src: "",
  },
  setData = noop,
  Component = noop,
}) {
  // Drag and Drop Handler
  const onDragDropEnds = (oldIndex, newIndex) => {
    console.log(oldIndex, newIndex);
  };
  const arraySetIndex = (array = []) => {
    const update = [];
    for (let i = 0; i < array.length; i++) {
      update.push({
        link: array[i].link || "",
        src: array[i].src || "",
        index: i,
      });
    }
    return update;
  };
  const arraySetAddIndex = (array = []) => {
    const update = [];
    for (let i = 0; i < array.length; i++) {
      update.push({
        link: array[i].link || "",
        src: array[i].src || "",
        index: i + 1,
      });
    }
    return update;
  };
  return (
    <>
      <StyledAddGrid
        className="add-item"
        onClick={() => {
          const addIndexData = arraySetAddIndex(data);
          const update = [
            {
              ...defalutData,
              index: 0,
            },
            ...addIndexData,
          ];
          setData(update);
        }}
      >
        <IoMdAddCircleOutline />
        <span>新增Icon</span>
      </StyledAddGrid>
      <StyledGridSortable>
        <ReactSortable
          list={data}
          setList={(newlist) => setData(arraySetIndex(newlist))}
          ghostClass="dropArea"
          handle=".dragHandle"
          filter=".ignoreDrag"
          preventOnFilter={true}
          className="grid-container"
          onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
        >
          {data.map((val, key) => (
            <StyledGrid key={key}>
              <div className="move dragHandle">
                <PiHandTapLight />
              </div>
              <div
                className="remove"
                onClick={() => {
                  const filterArray = arraySetIndex(
                    data.filter((val) => val.index !== key),
                  );
                  setData(filterArray);
                }}
              >
                <IoCloseSharp />
              </div>
              <Component value={val} index={key} />
            </StyledGrid>
          ))}
        </ReactSortable>
      </StyledGridSortable>
    </>
  );
}

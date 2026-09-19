import { useState } from "react";
import cx from "classnames";
import noop from "lodash.noop";
import styled from "styled-components";
import { commonStyles } from "../styles/styles";
// icons
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdUnlock, IoMdLink } from "react-icons/io";

const StyleButtonInput = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  .svg-icon {
    width: 24px;
    height: 24px;
    color: #5d5d5d;
    padding: 0 8px;
    transition: 0.3s;
  }
  .content {
    color: #8d8d8d;
    font-size: 0.9em;
    max-width: calc(100% - 110px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &.isVal {
      color: ${commonStyles.feature2};
    }
  }
  a {
    color: unset;
  }
  input {
    transition: 0.3s;
    outline: none;
    border: 1px solid #a0a0a0;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 8px 16px;
    background-color: #f6f6f6;
    width: calc(100% - 110px);
    cursor: pointer;
  }
  input:focus {
    border: 1px solid ${commonStyles.feature2};
    color: ${commonStyles.feature2};
    &::placeholder {
      color: ${commonStyles.feature2};
    }
    & + svg {
      color: ${commonStyles.feature2};
    }
  }
  button {
    margin-left: 5px;
    box-sizing: border-box;
    padding: 5px 10px;
    cursor: pointer;
  }
`;

export default function ButtonInput({
  className = "",
  styles = {},
  iconType = 0,
  keyValue = "",
  placeholder = "內容",
  contentIsLink = false,
  dataUpdate = noop,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [inputVal, setInputVal] = useState(keyValue);
  const UseIcon = () => {
    switch (iconType) {
      case 1:
        return <RiAccountCircleLine className="svg-icon" />;
      case 2:
        return <IoMdUnlock className="svg-icon" />;
      case 3:
        return <IoMdLink className="svg-icon" />;
      default:
        return <></>;
    }
  };
  return (
    <StyleButtonInput className={className} style={{ ...styles }}>
      <UseIcon />
      {!isEdit ? (
        <div className={cx("content", { isVal: keyValue })}>
          {keyValue ? (
            contentIsLink ? (
              <a href={keyValue} target="_blank">
                {keyValue}
              </a>
            ) : (
              keyValue
            )
          ) : (
            `尚未編輯${placeholder}`
          )}
        </div>
      ) : (
        <input
          placeholder={`請輸入${placeholder}`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
      )}
      <button
        onClick={() => {
          setIsEdit((prev) => !prev);
          isEdit && dataUpdate(inputVal);
        }}
      >
        {isEdit ? "確認" : "編輯"}
      </button>
    </StyleButtonInput>
  );
}

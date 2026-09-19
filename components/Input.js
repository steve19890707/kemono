import noop from "lodash.noop";
import styled from "styled-components";
import { commonStyles } from "../styles/styles";
// icons
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdUnlock, IoIosCloseCircle } from "react-icons/io";

const StyledInput = styled.label`
  position: relative;
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  width: ${({ width }) => (width ? width : "auto")};
  cursor: pointer;
  input {
    transition: 0.3s;
    outline: none;
    border: 1px solid #a0a0a0;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 8px 16px;
    min-width: 200px;
    background-color: #f6f6f6;
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
  .svg-icon {
    width: 24px;
    height: 24px;
    color: #5d5d5d;
    padding: 0 8px;
    transition: 0.3s;
  }
  .svg-close {
    position: absolute;
    width: 22px;
    height: 22px;
    color: #5d5d5d;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

export default function Input({
  className = "",
  placeholder = "內容",
  width = "",
  styles = {},
  type = "text",
  iconType = 0,
  keyValue = "",
  closeIcon = false,
  isLoading = false,
  setKeyValue = noop,
}) {
  const UseIcon = () => {
    switch (iconType) {
      case 1:
        return <RiAccountCircleLine className="svg-icon" />;
      case 2:
        return <IoMdUnlock className="svg-icon" />;
      default:
        return <></>;
    }
  };
  return (
    <StyledInput width={width} className={className}>
      <input
        placeholder={`請輸入${placeholder}`}
        style={{ ...styles }}
        type={type}
        disabled={isLoading}
        value={keyValue}
        onChange={(e) => setKeyValue(e.target.value)}
      />
      <UseIcon />
      {keyValue && closeIcon && !isLoading && (
        <IoIosCloseCircle
          className="svg-close"
          onClick={() => setKeyValue("")}
        />
      )}
    </StyledInput>
  );
}

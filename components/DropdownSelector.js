import { useState } from "react";
import styled, { StyleSheetManager } from "styled-components";
import noop from "lodash.noop";
import isValidProp from "@emotion/is-prop-valid";
import { Mousedown } from "../common-lib/hooks";
import { getData } from "../common-lib/lib";
// icons
import { IoMdArrowDropdown } from "react-icons/io";

const StyledDropdownSelector = styled.div`
  position: relative;
  margin-right: 6px;
  cursor: pointer;
  .dropdown-caption {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px 10px 20px;
    border-radius: 6px;
    background: ${({ styles }) => styles.backgroundColor};
    color: ${({ styles }) => styles.fontColor};
  }
  .dropdown-title {
    text-align: center;
    white-space: nowrap;
  }
  .IoMdArrowDropdown-svg {
    width: 20px;
    height: 20px;
  }
  .dropdown {
    position: absolute;
    background: #ebebeb;
    color: #353535;
    width: 100%;
    top: 100%;
    left: 0;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 2px 3px 0px #dadada;
    z-index: 999;
  }
  .dropdown-list {
    padding: 8px 0;
    text-align: center;
    border-left: 1px solid #bfbfbf;
    border-right: 1px solid #bfbfbf;
    border-bottom: 1px solid #bfbfbf;
    &:last-child {
      border-radius: 0 0 6px 6px;
    }
    &:hover {
      background: ${({ styles }) => styles.backgroundColor};
      color: ${({ styles }) => styles.fontColor};
    }
  }
`;

export default function DropdownSelector({
  dropId = "",
  title = "下拉選單",
  backgroundColor = "#353535",
  fontColor = "#fff",
  droplist = [],
  dropdownAction = noop,
}) {
  const [isDrop, setIsDrop] = useState(false);
  Mousedown((e) => {
    const dropdown = document.getElementById(`${dropId}-dropdown`);
    if (dropdown && !dropdown.contains(e.target)) {
      setIsDrop(false);
    }
  });
  return (
    <StyleSheetManager shouldForwardProp={(propName) => isValidProp(propName)}>
      <StyledDropdownSelector
        id={`${dropId}-dropdown`}
        styles={{ backgroundColor, fontColor }}
      >
        <div className="dropdown-caption" onClick={() => setIsDrop(true)}>
          <div className="dropdown-title">{title}</div>
          <IoMdArrowDropdown className="IoMdArrowDropdown-svg" />
        </div>
        <div className="dropdown">
          {isDrop &&
            droplist.map((val, key) => {
              return (
                <div
                  className="dropdown-list"
                  key={key}
                  onClick={() => {
                    dropdownAction(val, key);
                    setIsDrop(false);
                  }}
                >
                  {getData(val, ["name"])}
                </div>
              );
            })}
        </div>
      </StyledDropdownSelector>
    </StyleSheetManager>
  );
}

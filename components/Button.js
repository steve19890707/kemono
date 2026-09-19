import noop from "lodash.noop";
import styled, { StyleSheetManager } from "styled-components";
import isValidProp from "@emotion/is-prop-valid";
import { RotatingLines } from "react-loader-spinner";

const StyledButton = styled.button`
  box-sizing: border-box;
  border: 0;
  border-radius: 6px;
  padding: 10px 0;
  width: 100%;
  font-size: 16px;
  white-space: nowrap;
  color: ${({ basedstyle }) => basedstyle.color};
  background: ${({ basedstyle }) => basedstyle.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default function Button({
  content = "button",
  color = "#fff",
  bgColor = "#353535",
  className = "",
  styles = {},
  isLoading = false,
  disable = false,
  onClick = noop,
}) {
  return (
    <StyleSheetManager shouldForwardProp={(propName) => isValidProp(propName)}>
      <StyledButton
        className={className}
        disabled={isLoading || disable}
        basedstyle={{ color: color, bgColor: bgColor }}
        style={{ ...styles }}
        onClick={() => onClick()}
      >
        {isLoading ? (
          <RotatingLines height="24" width="24" strokeColor={color} />
        ) : (
          <span>{content}</span>
        )}
      </StyledButton>
    </StyleSheetManager>
  );
}

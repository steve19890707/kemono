import noop from "lodash.noop";
import styled from "styled-components";
import { commonStyles } from "../styles/styles";

const StyledTextArea = styled.textarea`
  width: auto;
  outline: none;
  border: 1px solid #a0a0a0;
  background-color: #f6f6f6;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 8px 16px;
  min-width: 400px;
  min-height: 80px;
  resize: none;
  &:focus {
    border: 1px solid ${commonStyles.feature2};
    color: ${commonStyles.feature2};
  }
`;
const StyledTip = styled.div`
  margin-left: 15px;
  font-size: 13px;
  color: #9e9e9e;
`;
export default function TextArea({
  placeholder = "內容",
  styles = {},
  keyValue = "",
  limitedTip = "",
  setKeyValue = noop,
}) {
  return (
    <>
      <StyledTextArea
        placeholder={`請輸入${placeholder}`}
        style={{ ...styles }}
        value={keyValue}
        onChange={(e) => setKeyValue(e.target.value)}
      />
      {limitedTip && <StyledTip>建議總字數：{limitedTip}</StyledTip>}
    </>
  );
}

import styled from "styled-components";
import noop from "lodash.noop";
import { commonStyles } from "../styles/styles";
// compoments
import Button from "../components/Button";

const StyledAboveContentBtns = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
  .btn {
    width: auto;
    min-width: 100px;
    padding: 10px 12px;
    margin-left: 10px;
    &.edit {
      background-color: ${commonStyles.feature1};
    }
    &.add {
      background-color: ${commonStyles.feature2};
    }
    &.disable {
      background-color: ${commonStyles.borderColor};
      pointer-events: none;
    }
  }
`;

export default function AboveContentBtns({
  btnArray = [
    {
      text: "button",
      className: "",
      handler: noop,
    },
  ],
  className = "",
}) {
  return (
    <StyledAboveContentBtns className={className}>
      {btnArray.map((val, key) => (
        <Button
          className={`btn ${val.className}`}
          key={key}
          content={val.text}
          onClick={() => val.handler()}
        />
      ))}
    </StyledAboveContentBtns>
  );
}

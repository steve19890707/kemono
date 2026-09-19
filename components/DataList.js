import styled from "styled-components";
import { commonStyles } from "../styles/styles";
import noop from "lodash.noop";

const StyledDataList = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 2px solid ${commonStyles.borderColor};
  &:last-child {
    border-bottom: 0;
  }
`;

export default function DataList({ children, className = "", onClick = noop }) {
  return (
    <StyledDataList className={className} onClick={(e) => onClick(e)}>
      {children}
    </StyledDataList>
  );
}

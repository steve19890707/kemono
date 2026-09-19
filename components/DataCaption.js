import styled from "styled-components";
import { commonStyles } from "../styles/styles";

const StyledDataCaption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 6px 6px 0 0;
  box-sizing: border-box;
  padding: 0 12px;
  .caption {
    width: ${({ size }) => `${100 / size}%`};
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid ${commonStyles.borderColor};
    color: #a4a4a4;
    &:last-child {
      border-right: 0;
    }
  }
`;

export default function DataCaption({
  className = "",
  captions = [],
  size = 5,
}) {
  return (
    <StyledDataCaption className={className} size={size}>
      {captions.map((val, key) => (
        <div key={key} className="caption">
          {val}
        </div>
      ))}
    </StyledDataCaption>
  );
}

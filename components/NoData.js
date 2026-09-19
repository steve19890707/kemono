import styled from "styled-components";

const StyledNoData = styled.div`
  padding: 40px 0;
  text-align: center;
  opacity: 0.5;
`;

export default function NoData({ text = "暫無資料!" }) {
  return <StyledNoData>{text}</StyledNoData>;
}

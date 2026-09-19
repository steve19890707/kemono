import styled from "styled-components";
import { Oval } from "react-loader-spinner";

const StyledCommonLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

export default function CommonLoader() {
  return (
    <StyledCommonLoader>
      <Oval color="#4fa94d" ariaLabel="oval-loading" width={50} height={50} />
    </StyledCommonLoader>
  );
}

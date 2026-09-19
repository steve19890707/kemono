import styled from "styled-components";
import { Hourglass } from "react-loader-spinner";

const StyledUpdateLoader = styled.div`
  position: fixed;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #ffffffb3;
`;

export default function UpdateLoader({}) {
  return (
    <StyledUpdateLoader>
      <Hourglass
        visible={true}
        height={90}
        width={90}
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["#306cce", "#72a1ed"]}
      />
    </StyledUpdateLoader>
  );
}

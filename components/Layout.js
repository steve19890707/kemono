import { GlobalStyle } from "../styles/styles";
import useMediaQuery from "../common-lib/hooks/useMediaQuery";

export default function Layout({ children }) {
  const { mediaType } = useMediaQuery();
  return (
    <>
      <GlobalStyle />
      {mediaType && children}
    </>
  );
}

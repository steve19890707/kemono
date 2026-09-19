import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getData } from "../common-lib/lib";
import packageJson from "../package.json";
// compoments
import Nav from "../components/Nav";
import Aside from "../components/Aside";
import UpdateLoader from "./UpdataLoader";

const StyledAuthVerify = styled.div`
  display: flex;
  .content-wrap {
    width: 100%;
    max-width: 1350px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
  }
`;

export default function AuthVerify({ children }) {
  const [checkAside, setCheckAside] = useState(true);
  const loader = useSelector((state) => state.props.loader);
  const asideList = useSelector((state) => state.props.asideList);
  const router = useRouter();
  useEffect(() => {
    if (asideList.length > 0) {
      const pathname = window.location.pathname;
      const checkPathname = asideList.find(
        (v) => getData(v, ["link"]) === pathname
      );
      if (!checkPathname && pathname !== "/") {
        router.push("/");
      } else {
        setCheckAside(false);
      }
    }
  }, [asideList]);
  return (
    <>
      <Nav />
      <StyledAuthVerify data-version={packageJson.version}>
        <Aside />
        {!checkAside && <div className="content-wrap">{children}</div>}
      </StyledAuthVerify>
      {loader && <UpdateLoader />}
    </>
  );
}

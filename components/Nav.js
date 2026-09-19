import { useRouter } from "next/router";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { commonStyles } from "../styles/styles";
import { getData } from "../common-lib/lib";
import { storageItemRemove } from "../lib/toolFuntions";
import { ProgressBar } from "react-loader-spinner";
import { langauge, langaugeTranslation, clientSideHost } from "../lib/static";
// icons
import { FaUserAlt } from "react-icons/fa";
// components
import Button from "./Button";
import DropdownSelector from "./DropdownSelector";
// reducers
import { setAsideList, setUserid } from "../reducer/props";
// api
import { FetchGetHook, apiGetAdminUserInfo } from "../pages/api";

const StyledNav = styled.div`
  position: relative;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #fff;
  padding: 5px 45px;
  border-bottom: 2px solid ${commonStyles.borderColor};
  .logo-img {
    display: block;
    height: 100%;
    cursor: pointer;
  }
  .user-zone,
  .info-content {
    display: flex;
    align-items: center;
  }
  .loader {
    padding: 0 24px 0 12px;
  }
  .svg-FaUserAlt {
    width: 24px;
    height: 24px;
    color: ${commonStyles.feature3};
  }
  .user-name {
    font-size: 20px;
    font-weight: bold;
    padding: 0 12px;
    white-space: nowrap;
  }
  .login-ip {
    white-space: nowrap;
    padding-right: 24px;
  }
`;
const assetBasePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/kemono" : "";

const assetPath = (path) => `${assetBasePath}${path}`;

const createDropdownList = () => {
  const array = [];
  for (let i = 0; i < langauge.length; i++) {
    array.push({
      name: langauge[i],
      url: `${clientSideHost(i === 3 ? "ja" : langaugeTranslation(i))}`,
    });
  }
  return array;
};
export default function Nav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    data: adminUserInfoData,
    isLoading: adminUserInfoIsLoading,
    // mutate: adminUserInfoMutate,
  } = FetchGetHook({
    defaultDataType: {},
    isUserInfo: true,
    promise: apiGetAdminUserInfo,
    success: (data) => {
      dispatch(setAsideList(getData(data, ["level"], [])));
      dispatch(setUserid(getData(data, ["account"], "")));
    },
  });
  return (
    <StyledNav>
      <img
        className="logo-img"
        alt=""
        src={assetPath("/imgs/logo.jpg")}
        onClick={() => router.push("/")}
      />
      <div className="user-zone">
        <div className="info-content">
          <FaUserAlt className="svg-FaUserAlt" />
          {adminUserInfoIsLoading ? (
            <div className="loader">
              <ProgressBar
                visible={true}
                height="70"
                width="70"
                barColor="#4fa94d"
                borderColor="#000"
                ariaLabel="progress-bar-loading"
              />
            </div>
          ) : (
            <>
              <div className="user-name">
                {getData(adminUserInfoData, ["account"])} |
              </div>
              <div className="login-ip">
                IP：{getData(adminUserInfoData, ["login_ip"])}
              </div>
            </>
          )}
        </div>
        <DropdownSelector
          dropId="client-side-host"
          title="前台網址"
          droplist={createDropdownList()}
          dropdownAction={(val) => window.open(val.url)}
        />
        {/* logout */}
        <Button
          content="登出"
          styles={{
            padding: "10px 20px",
            background: "linear-gradient(to bottom, #FF5722, #a90000)",
          }}
          onClick={() => {
            const confrim = confirm("確定登出嗎？");
            if (confrim) {
              storageItemRemove(["authorization"]);
              router.push("/login");
            }
          }}
        />
      </div>
    </StyledNav>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import packageJson from "../package.json";
import { getData } from "../common-lib/lib";
import { commonStyles } from "../styles/styles";
// reducer
import { setAuthorization } from "../reducer/props";
// api
import { apiPostLogin, apiUpdateAction } from "../pages/api/index";
// components
import Input from "../components/Input";
import Button from "../components/Button";
// hooks
import { Keydown } from "../common-lib/hooks";

const StyledLogin = styled.div`
  width: 100%;
  min-height: 100vh;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("./imgs/login_bg.jpg") no-repeat center;
    z-index: 1;
    pointer-events: none;
    animation: 1.5s fadeIn;
  }
  .operation-zone {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid ${commonStyles.feature3};
    border-radius: 10px;
    padding: 60px;
    z-index: 99;
    background: #ffffffad;
  }
  .subtitle {
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: #5d5d5d;
    padding-bottom: 10px;
  }
  .input-zone {
    padding-top: 10px;
  }
`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dataPost = () => {
    const valCheck = account && password;
    if (valCheck) {
      setIsLoading(true);
      apiUpdateAction({
        promise: apiPostLogin({
          account: account,
          pwd: password,
        }),
        success: (response) => {
          const token = getData(response, ["result"]);
          dispatch(setAuthorization(token));
          localStorage.setItem("authorization", token);
          const timeout = setTimeout(() => {
            router.push("/");
            return () => clearTimeout(timeout);
          }, 100);
        },
        unsuccessfully: () => setIsLoading(false),
      });
    } else return;
  };
  Keydown((e) => {
    if (e.keyCode === 13) {
      dataPost();
    }
  });
  useEffect(() => {
    const authorization = localStorage.getItem("authorization");
    if (authorization) {
      router.push("/");
    }
  });
  return (
    <StyledLogin data-version={packageJson.version}>
      <div className="background" />
      <div className="operation-zone">
        <div className="subtitle">Welcome to CQ9</div>
        <div className="input-zone">
          <Input
            placeholder="帳號"
            closeIcon={true}
            type={"text"}
            iconType={1}
            isLoading={isLoading}
            keyValue={account}
            setKeyValue={setAccount}
          />
        </div>
        <div className="input-zone">
          <Input
            placeholder="密碼"
            closeIcon={true}
            type={"password"}
            iconType={2}
            isLoading={isLoading}
            keyValue={password}
            setKeyValue={setPassword}
          />
        </div>
        <Button
          content={"登入"}
          styles={{
            marginTop: "20px",
          }}
          isLoading={isLoading}
          onClick={() => dataPost()}
        />
      </div>
    </StyledLogin>
  );
};

const DynamicLogin = dynamic(() => Promise.resolve(LoginPage), {
  ssr: false,
});
export default function Login() {
  return <DynamicLogin />;
}

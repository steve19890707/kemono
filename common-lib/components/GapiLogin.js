import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Loader from "react-loader-spinner";
import { Keydown } from "../hooks/index";

const apiLogin = ({ API_URL = "", param = {} }) => {
  const { account = "", password = "" } = param;
  return axios.post(`${API_URL}/login`, {
    account: account,
    pwd: password,
  });
};

const StyledGapiLogin = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100vh;
  .ucl-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(-45deg, #e739f5, #737be6, #61d9e1);
    z-index: 1;
  }
  .d-text {
    position: absolute;
    opacity: 0.15;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    z-index: 1;
    pointer-events: none;
    letter-spacing: 15px;
    &.a {
      top: 25px;
      left: 25px;
    }
    &.b {
      right: 25px;
      bottom: 25px;
    }
  }
  .ucl-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -75%);
    z-index: 2;
    background: #1f1f1f;
    width: 360px;
    border-radius: 10px;
    padding: 40px;
    box-sizing: border-box;
  }
  h2 {
    color: #ffffffb3;
    font-size: 24px;
    font-weight: bold;
  }
  .type-input {
    margin-top: 20px;
  }
  .type-input .caption {
    margin-bottom: 8px;
    color: #ffffffb3;
    font-size: 14px;
  }
  .type-input input {
    width: 100%;
    border-radius: 5px;
    padding: 10px 16px;
    box-sizing: border-box;
    font-size: 14px;
    background: #fff;
    color: #1f1f1f;
    outline: transparent;
    border: 0;
  }
  .type-input .tip {
    margin-top: 10px;
    font-size: 14px;
    color: #f44336;
    box-sizing: border-box;
    padding-left: 16px;
  }
  button {
    width: 100%;
    border-radius: 5px;
    padding: 10px 16px;
    font-size: 16px;
    background: #00bcd4;
    cursor: pointer;
    margin-top: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #0097a7;
    }
  }
`;
export const GapiLogin = ({ apiUrl = "" }) => {
  const [actVal, setActVal] = useState("");
  const [pwdVal, setPwdVal] = useState("");
  const [sendIsLoding, setSendIsLoding] = useState(false);
  const [firstFoucs, setFirstFoucs] = useState(true);
  const isErrorVal = actVal.length === 0 || pwdVal.length === 0;
  const fetchLogin = () => {
    setSendIsLoding(true);
    return apiLogin({
      API_URL: apiUrl,
      param: {
        account: actVal,
        password: pwdVal,
      },
    })
      .then((res) => {
        const preview = res.data;
        const SUCCESS = preview.error_msg === "SUCCESS";
        if (!SUCCESS) {
          alert(preview.error_msg);
          console.error(preview.error_msg);
          setSendIsLoding(false);
        } else {
          localStorage.setItem("authorization", preview.result.access_token);
          localStorage.setItem("isLogin", "true");
          window.location.href = "";
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
        setSendIsLoding(false);
      });
  };
  Keydown((e) => {
    if (e.keyCode === 13 && !isErrorVal && !sendIsLoding) {
      fetchLogin();
    } else return;
  });
  return (
    <StyledGapiLogin>
      <div className="ucl-background" />
      <div className="d-text a">USERCENTER LOGINPAGE</div>
      <div className="d-text b">USERCENTER LOGINPAGE</div>
      <div className="ucl-content">
        <h2>會員系統-登入</h2>
        <div className="type-input">
          <div className="caption">帳號</div>
          <input
            placeholder="請輸入帳號"
            onChange={(e) => {
              firstFoucs && setFirstFoucs(false);
              setActVal(e.target.value);
            }}
          />
          {actVal.length === 0 && !firstFoucs && (
            <div className="tip">帳號不可為空</div>
          )}
        </div>
        <div className="type-input">
          <div className="caption">密碼</div>
          <input
            placeholder="請輸入密碼"
            type="password"
            onChange={(e) => {
              firstFoucs && setFirstFoucs(false);
              setPwdVal(e.target.value);
            }}
          />
          {pwdVal.length === 0 && !firstFoucs && (
            <div className="tip">密碼不可為空</div>
          )}
        </div>
        <button
          disabled={isErrorVal || sendIsLoding}
          onClick={() => fetchLogin()}
        >
          {!sendIsLoding ? (
            <span>登入</span>
          ) : (
            <Loader type={`Oval`} color={`#fff`} width={30} height={30} />
          )}
        </button>
      </div>
    </StyledGapiLogin>
  );
};

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Loader from "react-loader-spinner";
import { Keydown } from "../hooks/index";

const apiPassword = ({ API_URL = "", param = {} }) => {
  const { newPwd = "", newPwdConfirmation = "", oldPwd = "" } = param;
  return axios.put(`${API_URL}/password`, {
    new_pwd: newPwd,
    new_pwd_confirmation: newPwdConfirmation,
    old_pwd: oldPwd,
  });
};

const StyledGapiChangPwd = styled.div`
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
    background: #000000a6;
    z-index: 1;
  }
  .ucl-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -75%);
    z-index: 2;
    background: #1f1f1f;
    width: 400px;
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
  .btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .btns button {
    border-radius: 5px;
    padding: 10px 16px;
    font-size: 14px;
    background: #00bcd4;
    cursor: pointer;
    margin-top: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.cancel {
      background: #9b9b9b;
      &:hover {
        background: #d7d7d7;
      }
    }
    &:last-child {
      margin-left: 10px;
    }
    &:hover {
      background: #0097a7;
    }
  }
`;
export const GapiChangePwd = ({ apiUrl = "", closehandler = () => {} }) => {
  const [newPwd, setNewPwd] = useState("");
  const [newPwdConfirmation, setNewPwdConfirmation] = useState("");
  const [oldPwd, setOldPwd] = useState("");
  const [sendIsLoding, setSendIsLoding] = useState(false);
  const isErrorVal =
    newPwd.length === 0 ||
    newPwdConfirmation.length === 0 ||
    oldPwd.length === 0;
  const fetchChangePwd = () => {
    setSendIsLoding(true);
    return apiPassword({
      API_URL: apiUrl,
      param: {
        newPwd: newPwd,
        newPwdConfirmation: newPwdConfirmation,
        oldPwd: oldPwd,
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
          alert("修改成功! 請重新登入");
          localStorage.setItem("authorization", "");
          localStorage.setItem("isLogin", "false");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
        setSendIsLoding(false);
      });
  };
  Keydown((e) => {
    if (e.keyCode === 27) {
      closehandler();
    }
    if (e.keyCode === 13 && !isErrorVal && !sendIsLoding) {
      fetchChangePwd();
    } else return;
  });
  return (
    <StyledGapiChangPwd>
      <div className="ucl-background" />
      <div className="ucl-content">
        <h2>會員系統-修改密碼</h2>
        <div className="type-input">
          <div className="caption">舊密碼</div>
          <input
            placeholder="請輸入舊密碼"
            type="password"
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>
        <div className="type-input">
          <div className="caption">新密碼</div>
          <input
            placeholder="請輸入新密碼"
            type="password"
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>
        <div className="type-input">
          <div className="caption">確認新密碼</div>
          <input
            placeholder="請再次輸入新密碼"
            type="password"
            onChange={(e) => setNewPwdConfirmation(e.target.value)}
          />
        </div>
        <div className="btns">
          {!sendIsLoding && (
            <button className="cancel" onClick={() => closehandler()}>
              <span>取消</span>
            </button>
          )}
          <button
            disabled={isErrorVal || sendIsLoding}
            onClick={() => fetchChangePwd()}
          >
            {!sendIsLoding ? (
              <span>確定</span>
            ) : (
              <Loader type={`Oval`} color={`#fff`} width={25} height={25} />
            )}
          </button>
        </div>
      </div>
    </StyledGapiChangPwd>
  );
};

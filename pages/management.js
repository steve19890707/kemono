import { useState } from "react";
import { getData } from "../common-lib/lib";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Switch from "react-switch";
import { commonStyles } from "../styles/styles";
import { storageItemRemove } from "../lib/toolFuntions";
import { defaultPaths } from "../lib/static";
// icons
import { FaRegCircleUser } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { RiAccountCircleFill } from "react-icons/ri";
// compoments
import Popup from "../components/Popup/Index";
import ConfirmPopup from "../components/Popup/Confirm";
import Input from "../components/Input";
import AuthVerify from "../components/AuthVerify";
import DataList from "../components/DataList";
import Button from "../components/Button";
import CheckBox from "../components/CheckBox";
import CommonLoader from "../components/CommonLoader";
// reducer
import { setLoader } from "../reducer/props";
// api
import {
  apiPutEditAdmin,
  apiPostAccountRegister,
  apiUpdateAction,
  apiGetAdminList,
  apiDeleteAdminUser,
  FetchGetHook,
} from "../pages/api";

const StyledManagementPage = styled.div`
  border: 2px solid ${commonStyles.borderColor};
  border-radius: 8px;
  .svg-FaRegCircleUser {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
  .text {
    width: calc(100% - 100px);
    display: flex;
    align-items: center;
  }
  .info {
    display: flex;
    align-items: center;
  }
  .info-span {
    color: ${commonStyles.feature4};
    margin: 0 10px;
    &.no-email {
      color: ${commonStyles.borderColor2};
    }
  }
  .right-side {
    display: flex;
    align-items: center;
    justify-content: center;
    .caption {
      white-space: nowrap;
      margin-right: 10px;
    }
    .text {
      white-space: nowrap;
      margin-left: 5px;
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 25px;
      &.close svg,
      &.close .text {
        color: #bbbbbb;
      }
      .text {
        color: ${commonStyles.feature2};
      }
      svg {
        color: ${commonStyles.feature2};
        width: 24px;
        height: 24px;
      }
    }
  }
  .other-btns {
    padding: 16px 20px;
    box-sizing: border-box;
    border-radius: 6px 6px 0 0;
    border-bottom: 1px solid ${commonStyles.borderColor2};
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    background: #f0f0f0;
  }
  .svg-RiAccountCircleFill {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    color: #adadad;
  }
`;
const StyledManagementPopup = styled(Popup)`
  .popup-content {
    height: auto;
    max-height: 80vh;
  }
`;

const StyledPopupContent = styled.div`
  .info-block {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .switch-caption {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    .subtitle {
      font-size: 14px;
      color: #888888;
      margin-left: 10px;
    }
  }
  .check-list {
    padding-top: 25px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .check-box {
    width: 25%;
  }
  .tips {
    color: red;
    font-size: 13px;
    padding-left: 10px;
  }
`;

const levelList = (array = []) => {
  const list = [];
  array.map((val, key) =>
    list.push({
      key: getData(val, ["key"]),
      status: false,
      name: getData(val, ["name"]),
    })
  );
  return list;
};

const contentPattern = (val = "") => {
  const reg = new RegExp("^[A-Za-z0-9]+$");
  if (reg.test(val) || val.length === 0) {
    return false;
  } else return true;
};

const ManagementPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authorization = useSelector((state) => state.props.authorization);
  const userid = useSelector((state) => state.props.userid);
  const [popupState, setPopupState] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [changePwdStatus, setChangePwdStatus] = useState(false);
  const [account, setAccount] = useState("");
  const [accId, setAccId] = useState("");
  const [confirmDeletePopup, setConfirmDeletePopup] = useState({
    props: "",
    caption: "",
    status: false,
  });
  const [createAccountPopup, setCreateAccountPopup] = useState({
    props: "",
    status: false,
  });
  // props
  const [status, setStatus] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [checkList, setCheckList] = useState([]);
  const {
    data: adiminlistData,
    isLoading: adminListIsLoading,
    mutate: adminListMutate,
  } = FetchGetHook({
    defaultDataType: [],
    promise: apiGetAdminList,
    // success: (data) => {},
  });

  const setAllProps = ({
    id = "",
    status = true,
    account = "",
    email = "",
    password = "",
    passwordConfirm = "",
    checkList = levelList(defaultPaths),
  }) => {
    setAccId(id);
    setStatus(status);
    setAccount(account);
    setEmail(email);
    setPassword(password);
    setPasswordConfirm(passwordConfirm);
    setCheckList(checkList);
    setChangePwdStatus(false);
  };

  const setCurrentChecklist = (array = []) => {
    const defaultArray = levelList(defaultPaths) || [];
    const update = [];
    const findId = (value = "") => array.find((v) => v === value);
    for (let i = 0; i < defaultArray.length; i++) {
      update.push({
        key: getData(defaultArray, [i, "key"]),
        status: findId(getData(defaultArray, [i, "key"])) ? true : false,
        name: getData(defaultArray, [i, "name"]),
      });
    }
    return update;
  };

  const filterUpdateLevel = (array = []) => {
    const update = [];
    for (let i = 0; i < array.length; i++) {
      if (getData(array, [i, "status"])) {
        update.push(getData(array, [i, "key"]));
      }
    }
    return update;
  };

  const FetchStatus = ({ status = true }) => {
    return <>{status ? <FaRegCheckCircle /> : <ImBlocked />}</>;
  };
  return (
    <>
      <AuthVerify>
        <StyledManagementPage>
          {adminListIsLoading ? (
            <CommonLoader />
          ) : (
            <>
              <div className="other-btns">
                <Button
                  content={"創建帳號"}
                  styles={{ width: "100px", background: "#ff9800" }}
                  onClick={() => {
                    setAllProps({});
                    setCreateAccountPopup({
                      props: "isCreate",
                      status: true,
                    });
                  }}
                />
                <RiAccountCircleFill className="svg-RiAccountCircleFill" />
              </div>
              {adiminlistData.map((val, key) => (
                <DataList key={key}>
                  <div className="text">
                    <FaRegCircleUser className="svg-FaRegCircleUser" />
                    <div className="info">
                      <span className="info-span">
                        {getData(val, ["account"])}
                      </span>
                      | 信箱:
                      <span
                        className={`info-span ${
                          !getData(val, ["email"]) && "no-email"
                        }`}
                      >
                        {getData(val, ["email"])
                          ? getData(val, ["email"])
                          : "暫無填寫"}
                      </span>
                    </div>
                  </div>
                  <div className="right-side">
                    <div
                      className={`status ${
                        !getData(val, ["status"]) && "close"
                      }`}
                    >
                      <div className="caption">| 帳號狀態:</div>
                      <FetchStatus status={getData(val, ["status"])} />
                      <div className="text">
                        {getData(val, ["status"]) ? `啟用` : `關閉`}
                      </div>
                    </div>
                    <Button
                      content={"編輯"}
                      styles={{ width: "100px" }}
                      onClick={() => {
                        setAllProps({
                          id: getData(val, ["id"]),
                          status: getData(val, ["status"]),
                          account: getData(val, ["account"]),
                          email: getData(val, ["email"]),
                          password: getData(val, ["pwd"]),
                          checkList: setCurrentChecklist(
                            getData(val, ["level"])
                          ),
                        });
                        setPopupState(true);
                      }}
                    />
                    <Button
                      content={"刪除"}
                      styles={{
                        width: "100px",
                        marginLeft: "5px",
                        background: "#f44336",
                      }}
                      onClick={() => {
                        setConfirmDeletePopup({
                          props: getData(val, ["id"]),
                          caption: getData(val, ["account"]),
                          status: true,
                        });
                      }}
                    />
                  </div>
                </DataList>
              ))}
            </>
          )}
        </StyledManagementPage>
      </AuthVerify>
      {popupState && (
        <StyledManagementPopup
          title={"帳號權限"}
          // secondPopupStatus={updatePopup}

          dataUpdate={() => {
            if (changePwdStatus) {
              if (password.length < 6 || contentPattern(password)) {
                alert("新密碼格式錯誤!");
                return;
              }
            }
            if (!password && changePwdStatus) {
              alert("新密碼不可為空白!");
              return;
            } else {
              setUpdatePopup(true);
            }
          }}
          cancelPopup={() => {
            setAllProps({});
            setPopupState(false);
          }}
        >
          <StyledPopupContent>
            <div className="info-block">
              <div>帳號：{account}</div>
            </div>
            <div className="info-block">
              <div>狀態：</div>
              <Switch checked={status} onChange={(e) => setStatus(e)} />
            </div>
            <div className="info-block">
              <div>信箱：</div>
              <Input keyValue={email} setKeyValue={setEmail} />
            </div>
            <label className="switch-caption">
              <Switch
                checked={changePwdStatus}
                onChange={(e) => setChangePwdStatus(e)}
              />
              {!changePwdStatus && <div className="subtitle">不更新密碼</div>}
            </label>
            {changePwdStatus && (
              <div className="info-block">
                <div>更新密碼：</div>
                <Input
                  keyValue={password}
                  setKeyValue={setPassword}
                  placeholder="新密碼"
                />
                {(password.length < 6 || contentPattern(password)) && (
                  <div className="tips">請至少輸入6個字元(英/數混合)</div>
                )}
              </div>
            )}
            <div>管理權限：</div>
            <div className="check-list">
              {checkList.map((val, key) => (
                <CheckBox
                  className="check-box"
                  key={key}
                  name={val.name}
                  checked={val.status}
                  onChange={(status) => {
                    const update = [];
                    checkList.forEach((val, k) => {
                      if (k === key) {
                        update.push({
                          ...checkList[key],
                          status: status,
                        });
                      } else return update.push(val);
                    });
                    setCheckList(update);
                  }}
                />
              ))}
            </div>
          </StyledPopupContent>
        </StyledManagementPopup>
      )}
      {updatePopup && (
        <ConfirmPopup
          content={`確定${
            createAccountPopup.props === "isCreate" ? "創建帳號" : "更新內容"
          }嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise:
                createAccountPopup.props === "isCreate"
                  ? apiPostAccountRegister(
                      {
                        account: account,
                        email: email,
                        level: filterUpdateLevel(checkList),
                        pwd: password,
                        pwd_confirmation: passwordConfirm,
                      },
                      authorization
                    )
                  : apiPutEditAdmin(
                      {
                        id: accId,
                        email: email,
                        level: filterUpdateLevel(checkList),
                        pwd: password,
                        status: status,
                      },
                      authorization
                    ),
              success: (response) => {
                if (userid === account) {
                  alert("您的帳號有資料更新，請重新登入！");
                  storageItemRemove(["authorization"]);
                  dispatch(setLoader(false));
                  router.push("/login");
                } else {
                  adminListMutate();
                  setAllProps({});
                  dispatch(setLoader(false));
                  setPopupState(false);
                  setUpdatePopup(false);
                  setCreateAccountPopup({
                    props: "",
                    status: false,
                  });
                }
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setUpdatePopup(false);
              },
            });
          }}
          cancelPopup={() => {
            dispatch(setLoader(false));
            setUpdatePopup(false);
          }}
        />
      )}
      {confirmDeletePopup.status && (
        <ConfirmPopup
          content={`確定刪除『 ${confirmDeletePopup.caption} 』嗎？`}
          dataUpdate={() => {
            dispatch(setLoader(true));
            apiUpdateAction({
              promise: apiDeleteAdminUser(
                confirmDeletePopup.props,
                authorization
              ),
              success: (response) => {
                adminListMutate();
                dispatch(setLoader(false));
                setConfirmDeletePopup({
                  props: "",
                  caption: "",
                  status: false,
                });
              },
              unsuccessfully: () => {
                dispatch(setLoader(false));
                setConfirmDeletePopup({
                  props: "",
                  caption: "",
                  status: false,
                });
              },
            });
          }}
          cancelPopup={() => {
            dispatch(setLoader(false));
            setConfirmDeletePopup({
              props: "",
              caption: "",
              status: false,
            });
          }}
        />
      )}
      {createAccountPopup.status && (
        <StyledManagementPopup
          title={"創建帳號"}
          updateText={"創建"}
          // secondPopupStatus={updatePopup}
          dataUpdate={() => {
            if (
              contentPattern(account) ||
              contentPattern(password) ||
              contentPattern(passwordConfirm) ||
              password.length < 6 ||
              passwordConfirm.length < 6
            ) {
              alert("帳號/密碼格式有誤，請重新檢查!");
              return;
            }
            if (!password || !passwordConfirm || !account) {
              alert("帳號/密碼不可為空白!");
              return;
            } else {
              setUpdatePopup(true);
            }
          }}
          cancelPopup={() => {
            setAllProps({});
            setCreateAccountPopup({
              props: "",
              status: false,
            });
          }}
        >
          <StyledPopupContent>
            <div className="info-block">
              <div>帳號：</div>
              <Input keyValue={account} setKeyValue={setAccount} />
              {contentPattern(account) && (
                <div className="tips">僅允許輸入英/數混合字元</div>
              )}
            </div>
            <div className="info-block">
              <div>信箱：</div>
              <Input keyValue={email} setKeyValue={setEmail} />
            </div>
            <div className="info-block">
              <div>密碼：</div>
              <Input
                keyValue={password}
                setKeyValue={setPassword}
                placeholder="密碼"
              />
              {(password.length < 6 || contentPattern(password)) && (
                <div className="tips">請至少輸入6個字元(英/數混合)</div>
              )}
            </div>
            <div className="info-block">
              <div>再次輸入密碼：</div>
              <Input
                keyValue={passwordConfirm}
                setKeyValue={setPasswordConfirm}
                placeholder="密碼"
              />
              {(passwordConfirm.length < 6 ||
                contentPattern(passwordConfirm)) && (
                <div className="tips">請至少輸入6個字元(英/數混合)</div>
              )}
            </div>
            <div>管理權限：</div>
            <div className="check-list">
              {checkList.map((val, key) => (
                <CheckBox
                  className="check-box"
                  key={key}
                  name={val.name}
                  checked={val.status}
                  onChange={(status) => {
                    const update = [];
                    checkList.forEach((val, k) => {
                      if (k === key) {
                        update.push({
                          ...checkList[key],
                          status: status,
                        });
                      } else return update.push(val);
                    });
                    setCheckList(update);
                  }}
                />
              ))}
            </div>
          </StyledPopupContent>
        </StyledManagementPopup>
      )}
    </>
  );
};

const DynamicManagement = dynamic(() => Promise.resolve(ManagementPage), {
  ssr: false,
});
export default function Management() {
  return <DynamicManagement />;
}

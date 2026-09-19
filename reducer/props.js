import { createSlice } from "@reduxjs/toolkit";
import { defaultPaths } from "../lib/static";

export const createAsideList = (array = []) => {
  const result = [];
  const findId = (value = "") => array.find((v) => v === value);
  for (let i = 0; i < defaultPaths.length; i++) {
    if (findId(defaultPaths[i].key)) {
      result.push(defaultPaths[i]);
    }
  }
  return result;
};

const props = createSlice({
  name: "props",
  initialState: {
    loader: false,
    userid: "",
    authorization: "",
    popupType: "",
    asideList: [],
    temporaryList: [],
    temporaryText: "",
  },
  reducers: {
    setLoader: (state, actions) => {
      state.loader = actions.payload;
    },
    setUserid: (state, actions) => {
      state.userid = actions.payload;
    },
    setAsideList: (state, actions) => {
      state.asideList = createAsideList(actions.payload || []);
    },
    setAuthorization: (state, actions) => {
      state.authorization = actions.payload || "";
    },
    setPopupType: (state, actions) => {
      state.popupType = actions.payload || "";
    },
    setTemporaryList: (state, actions) => {
      state.temporaryList = actions.payload || [];
    },
    setTemporaryText: (state, actions) => {
      state.temporaryText = actions.payload;
    },
  },
});
export default props.reducer;
export const {
  setLoader,
  setUserid,
  setAuthorization,
  setAsideList,
  setPopupType,
  setTemporaryList,
  setTemporaryText,
} = props.actions;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import props from "./props";

const rootReducer = combineReducers({
  props,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

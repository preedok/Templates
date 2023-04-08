import { combineReducers } from "@reduxjs/toolkit";

import { productReducer } from "./productReducer";

const rootReducer = combineReducers({
  product: productReducer,
});
export default rootReducer;

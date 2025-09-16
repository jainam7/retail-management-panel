// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { combineReducers } from "redux";
import authReducer from "@/features/auth/authSlice";
import invetoryReducer from "@/features/inventory/redux/inventorySlices";
import rootSaga from "./rootSaga";

const rootReducer = combineReducers({
  auth: authReducer,
  inventory: invetoryReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

/**
 * Persist auth to localStorage/sessionStorage depending on `remember` flag.
 * Keep this simple: when logged in store { token, user, remember } in the chosen storage.
 */
if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    const auth = state.auth;
    if (auth?.isAuthenticated) {
      const payload = JSON.stringify({
        token: auth.token,
        user: auth.user,
        remember: auth.remember,
      });
      if (auth.remember) {
        localStorage.setItem("auth", payload);
        sessionStorage.removeItem("auth");
      } else {
        sessionStorage.setItem("auth", payload);
        localStorage.removeItem("auth");
      }
    } else {
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

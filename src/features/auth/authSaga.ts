// features/auth/authSaga.ts
import { takeLatest, put, delay } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupComplete,
} from "./authSlice";

/**
 * Mocked login:
 * Accept demo@demo.com / password OR accept any credentials (for convenience)
 * For clarity we return an error when credentials are wrong to demonstrate failure handling.
 */
function* handleLogin(
  action: PayloadAction<{ email: string; password: string; remember: boolean }>
) {
  try {
    // simulate network latency
    yield delay(900);

    const { email, password, remember } = action.payload;

    // A simple demo check — change to real API call here.
    const VALID_EMAIL = "retailer@example.com";
    const VALID_PASSWORD = "RetailerPass123";

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const token = "demo-token-123"; // mock token
      const user = {
        name: "Demo User",
        email: VALID_EMAIL,
        businessName: "Reliance",
        businessCategory: "Retail",
        businessPhone: "9912332233",
        businessAddress: "Mumbai",
      };
      yield put(loginSuccess({ token, user, remember }));
    } else {
      // If you prefer to allow any credentials, comment out the next line and
      // directly return success for any credentials.
      yield put(
        loginFailure("Invalid credentials. Use demo@demo.com / password")
      );
    }
  } catch (err) {
    yield put(loginFailure("Network error"));
  }
}

/**
 * When signupComplete is dispatched (from Signup wizard final step),
 * we simply accept it and make user logged in (payload carries token/user).
 */
function* handleSignupComplete(
  action: PayloadAction<{ token: string; user: any; remember: boolean }>
) {
  // simulate processing time
  yield delay(700);
  // Already dispatched from UI — but we can perform server call here if needed.
  // Nothing else is required because signupComplete reducer already sets auth.
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupComplete.type, handleSignupComplete);
}

// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  email: string;
  businessName?: string;
  avatarUrl?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  remember: boolean;
};

function loadPersisted(): Partial<AuthState> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token,
      user: parsed.user,
      isAuthenticated: true,
      remember: parsed.remember ?? false,
    };
  } catch {
    return null;
  }
}

const persisted = loadPersisted();

const initialState: AuthState = {
  token: persisted?.token ?? null,
  user: persisted?.user ?? null,
  loading: false,
  error: null,
  isAuthenticated: persisted?.isAuthenticated ?? false,
  remember: persisted?.remember ?? false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    loginRequest(
      state,
      action: PayloadAction<{
        email: string;
        password: string;
        remember: boolean;
      }>
    ) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; user: User; remember: boolean }>
    ) {
      state.loading = false;
      state.error = null;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.remember = action.payload.remember;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // LOGOUT
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.remember = false;
      state.error = null;
      state.loading = false;
    },

    // Signup complete (after OTP & business details)
    signupComplete(
      state,
      action: PayloadAction<{ token: string; user: User; remember: boolean }>
    ) {
      state.loading = false;
      state.error = null;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.remember = action.payload.remember;
    },

    // Optional: request to send OTP (UI handled)
    sendOtpRequest(state) {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    sendOtpFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  signupComplete,
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
} = authSlice.actions;

export default authSlice.reducer;

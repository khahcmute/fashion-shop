import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  needVerify: boolean;
  verifyEmail: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  needVerify: false,
  verifyEmail: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Đăng ký thất bại");
      }

      return result;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result);
      }

      return result.data;
    } catch {
      return rejectWithValue({
        message: "Có lỗi xảy ra",
      });
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/me");
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Không lấy được user");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Đăng xuất thất bại");
      }

      return true;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.needVerify = false;
      state.verifyEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.needVerify = false;
        state.verifyEmail = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.needVerify = false;
        state.verifyEmail = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload as
          | { message?: string; needVerify?: boolean; email?: string }
          | string;

        if (typeof payload === "string") {
          state.error = payload;
          state.needVerify = false;
          state.verifyEmail = null;
        } else {
          state.error = payload.message || "Đăng nhập thất bại";
          state.needVerify = !!payload.needVerify;
          state.verifyEmail = payload.email || null;
        }

        state.user = null;
        state.isAuthenticated = false;
      })

      // fetch me
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.needVerify = false;
        state.verifyEmail = null;
      });
  },
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;

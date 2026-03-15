import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Account = {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  district?: string;
};

type State = {
  profile: Account | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: State = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/account");
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Không lấy được tài khoản");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Cập nhật thất bại");
      }

      return result;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const changePassword = createAsyncThunk(
  "account/changePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Đổi mật khẩu thất bại");
      }

      return result.message;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAccountMessages } = accountSlice.actions;
export default accountSlice.reducer;

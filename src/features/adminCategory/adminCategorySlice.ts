import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
};

type State = {
  categories: AdminCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchAdminCategories = createAsyncThunk(
  "adminCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/categories");
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const createAdminCategory = createAsyncThunk(
  "adminCategory/create",
  async (name: string, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const updateAdminCategory = createAsyncThunk(
  "adminCategory/update",
  async (data: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/categories/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name }),
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const deleteAdminCategory = createAsyncThunk(
  "adminCategory/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return id;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(createAdminCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateAdminCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c._id !== action.payload,
        );
      })
      .addCase(deleteAdminCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default adminCategorySlice.reducer;

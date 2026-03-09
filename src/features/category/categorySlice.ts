import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Category = {
  _id: string;
  name: string;
  slug: string;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/categories");
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Không lấy được categories");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;

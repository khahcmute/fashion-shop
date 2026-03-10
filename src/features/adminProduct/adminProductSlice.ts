import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Variant = {
  color: string;
  size: string;
  stock: number;
  sku: string;
};

export type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Category;
  images: string[];
  variants: Variant[];
  isFeatured: boolean;
  isActive: boolean;
};

type State = {
  products: AdminProduct[];
  selectedProduct: AdminProduct | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchAdminProducts = createAsyncThunk(
  "adminProduct/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/products");
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const fetchAdminProductById = createAsyncThunk(
  "adminProduct/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const createAdminProduct = createAsyncThunk(
  "adminProduct/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const updateAdminProduct = createAsyncThunk(
  "adminProduct/update",
  async (data: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/products/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.payload),
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProduct/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
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

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    clearSelectedAdminProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAdminProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAdminProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;

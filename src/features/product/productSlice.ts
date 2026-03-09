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

export type Product = {
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
  createdAt: string;
  updatedAt: string;
};

type ProductState = {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    params: { search?: string; category?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const query = new URLSearchParams();

      if (params?.search) {
        query.set("search", params.search);
      }

      if (params?.category) {
        query.set("category", params.category);
      }

      const url = query.toString()
        ? `/api/products?${query.toString()}`
        : "/api/products";

      const res = await fetch(url);
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          result.message || "Không lấy được danh sách sản phẩm",
        );
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const fetchProductBySlug = createAsyncThunk(
  "product/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          result.message || "Không lấy được chi tiết sản phẩm",
        );
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch detail
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

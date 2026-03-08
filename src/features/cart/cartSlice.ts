import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type CartProduct = {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  salePrice?: number;
};

export type CartItem = {
  _id: string;
  product: CartProduct;
  color: string;
  size: string;
  quantity: number;
  priceAtAddedTime: number;
};

type CartState = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/cart");
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Không lấy được giỏ hàng");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    data: { productId: string; color: string; size: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Thêm vào giỏ hàng thất bại");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (data: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/cart/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: data.quantity }),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Cập nhật giỏ hàng thất bại");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Xóa sản phẩm thất bại");
      }

      return id;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload as CartItem;
        const index = state.items.findIndex((item) => item._id === newItem._id);

        if (index !== -1) {
          state.items[index] = newItem;
        } else {
          state.items.unshift(newItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updated = action.payload as CartItem;
        const index = state.items.findIndex((item) => item._id === updated._id);

        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;

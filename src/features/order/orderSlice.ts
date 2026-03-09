import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
};

type OrderItem = {
  product: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

type OrderState = {
  orders: Order[];
  createdOrder: Order | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  createdOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data: ShippingAddress, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Tạo đơn hàng thất bại");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/orders/my");
      const result = await res.json();

      if (!res.ok) {
        return rejectWithValue(result.message || "Không lấy được đơn hàng");
      }

      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;

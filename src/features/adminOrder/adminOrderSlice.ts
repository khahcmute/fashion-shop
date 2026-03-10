import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AdminOrder = {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  };
  items: {
    name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

type State = {
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchAdminOrders = createAsyncThunk(
  "adminOrder/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/orders");
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const fetchAdminOrderById = createAsyncThunk(
  "adminOrder/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

export const updateAdminOrderStatus = createAsyncThunk(
  "adminOrder/updateStatus",
  async (
    data: { id: string; status: AdminOrder["status"] },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: data.status }),
      });
      const result = await res.json();
      if (!res.ok) return rejectWithValue(result.message);
      return result.data;
    } catch {
      return rejectWithValue("Có lỗi xảy ra");
    }
  },
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearSelectedAdminOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })

      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.orders.findIndex((o) => o._id === updated._id);
        if (index !== -1) state.orders[index] = updated;
        state.selectedOrder = updated;
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAdminOrder } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

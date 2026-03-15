import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import productReducer from "@/features/product/productSlice";
import cartReducer from "@/features/cart/cartSlice";
import categoryReducer from "@/features/category/categorySlice";
import orderReducer from "@/features/order/orderSlice";
import adminCategoryReducer from "@/features/adminCategory/adminCategorySlice";
import adminProductReducer from "@/features/adminProduct/adminProductSlice";
import adminOrderReducer from "@/features/adminOrder/adminOrderSlice";
import accountReducer from "@/features/account/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    category: categoryReducer,
    order: orderReducer,
    adminCategory: adminCategoryReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

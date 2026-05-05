import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../apislice/auth/authSlice';
import cartReducer from '../apislice/cart/cartSlice';
import { apiSlice } from '../api/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

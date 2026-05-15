import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../apislice/auth/authSlice';
import cartReducer from '../apislice/cart/cartSlice';
import { publicApi } from '../api/publicApi';
import { privateApi } from '../api/privateApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [privateApi.reducerPath]: privateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(publicApi.middleware)
      .concat(privateApi.middleware),
});

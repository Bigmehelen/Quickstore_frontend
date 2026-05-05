import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addItem as addItemAction, 
  removeItem as removeItemAction, 
  updateQty as updateQtyAction, 
  clearCart as clearCartAction,
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal
} from '../apislice/cart/cartSlice';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const subtotal = useSelector(selectCartSubtotal);

  const addItem = (product, qty = 1) => {
    dispatch(addItemAction({ product, qty }));
  };

  const removeItem = (id) => {
    dispatch(removeItemAction(id));
  };

  const updateQty = (id, qty) => {
    dispatch(updateQtyAction({ id, qty }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

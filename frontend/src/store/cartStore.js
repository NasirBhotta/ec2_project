import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
  cart: useAuthStore.getState().user?.cart || [],

  syncCartWithUser: (cart) => {
    const auth = useAuthStore.getState();
    auth.updateCart(cart);
  },

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      let updatedCart;

      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }

      get().syncCartWithUser(updatedCart);
      return { cart: updatedCart };
    });
  },

  increaseQuantity: (id) => {
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      get().syncCartWithUser(updatedCart);
      return { cart: updatedCart };
    });
  },

  decreaseQuantity: (id) => {
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      get().syncCartWithUser(updatedCart);
      return { cart: updatedCart };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      get().syncCartWithUser(updatedCart);
      return { cart: updatedCart };
    });
  },
}));

import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
  cart: [],

  // Initialize cart from backend for logged-in user
  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.email) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart?email=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      set({ cart: data.cart || [] });
    } catch (err) {
      console.error("fetchCart error:", err);
    }
  },

  syncCartWithBackend: async (cart) => {
    const user = useAuthStore.getState().user;
    if (!user?.email) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, cart }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      set({ cart });
    } catch (err) {
      console.error("syncCartWithBackend error:", err);
    }
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

      get().syncCartWithBackend(updatedCart);
      return { cart: updatedCart };
    });
  },

  increaseQuantity: (id) => {
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      get().syncCartWithBackend(updatedCart);
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
      get().syncCartWithBackend(updatedCart);
      return { cart: updatedCart };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      get().syncCartWithBackend(updatedCart);
      return { cart: updatedCart };
    });
  },
}));

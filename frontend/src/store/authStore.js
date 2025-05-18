import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signup: async ({ name, email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Since backend doesn't send user data, we'll just save email as user
      set({ user: { email }, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    set({ user: null });
  },

  fetchCart: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart?email=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      set((state) => ({ user: { ...state.user, cart: data.cart || [] } }));
    } catch (err) {
      console.error(err);
    }
  },

  updateCart: async (cartItems) => {
    const user = get().user;
    if (!user) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, cart: cartItems }),
      });
      if (!res.ok) throw new Error("Failed to update cart");

      set((state) => ({ user: { ...state.user, cart: cartItems } }));
    } catch (err) {
      console.error(err);
    }
  },
}));

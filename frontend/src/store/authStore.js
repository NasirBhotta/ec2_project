import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  users: JSON.parse(localStorage.getItem("users")) || [],
  user: JSON.parse(localStorage.getItem("currentUser")) || null,

  login: ({ email, password }) => {
    const { users } = get();
    const existingUser = users.find(u => u.email === email && u.password === password);
    if (existingUser) {
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      set({ user: existingUser });
      return { success: true };
    }
    return { success: false };
  },

  signup: ({ email, password }) => {
    const { users } = get();
    const exists = users.some(u => u.email === email);
    if (exists) return { success: false };

    const newUser = { email, password, cart: [] };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    set({ users: updatedUsers, user: newUser });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem("currentUser");
    set({ user: null });
  },

  updateCart: (cartItems) => {
    const { users, user } = get();
    const updatedUsers = users.map(u =>
      u.email === user.email ? { ...u, cart: cartItems } : u
    );
    const updatedUser = { ...user, cart: cartItems };

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    set({ users: updatedUsers, user: updatedUser });
  }
}));

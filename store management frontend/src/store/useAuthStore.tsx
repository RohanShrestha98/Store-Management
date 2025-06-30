import { create } from "zustand";
import Cookies from "universal-cookie";
import { decryptedData, encryptData } from "../utils/crypto";
const cookies = new Cookies();

const authStore = (set: any) => ({
  loggedIn: decryptedData(cookies.get("user"))?.token ? true : false,
  user: decryptedData(cookies.get("user")) || null,

  setUser: (user: any) => {
    set(() => {
      cookies.set("user", encryptData(user));
      return { user: user };
    });
  },
  registerStore: decryptedData(cookies.get("registerStore")) || null,

  setRegisterStore: (registerStore: any) => {
    set(() => {
      cookies.set("registerStore", encryptData(registerStore));
      return { registerStore: registerStore };
    });
  },

  logout: () =>
    set(() => {
      cookies.remove("user");
      return {
        loggedIn: false,
        user: null,
      };
    }),
});

export const useAuthStore = create(authStore);

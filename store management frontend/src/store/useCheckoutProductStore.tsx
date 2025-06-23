import { create } from "zustand";
import Cookies from "universal-cookie";
import { decryptedData, encryptData } from "../utils/crypto";

const cookies = new Cookies();

const checkoutProductStore = (set: any) => ({
  checkoutProduct: decryptedData(cookies.get("checkoutProduct")) || [],

  setCheckoutProduct: (data: any) => {
    cookies.set("checkoutProduct", encryptData(data));
    set({ checkoutProduct: data });
  },
});

export const useCheckoutProductStore = create(checkoutProductStore);

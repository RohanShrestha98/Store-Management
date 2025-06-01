import axios from "../utils/axios";
import Cookies from "universal-cookie";
import { decryptedData } from "../utils/crypto";
import { useNavigate } from "react-router-dom";

export const useRefreshToken = () => {
  const cookies = new Cookies({ path: "/" });
  const navigate = useNavigate();

  const refreshTokenFn = async () => {
    try {
      const response = await axios.post("auth/v1/token/access/", {
        refresh: decryptedData(cookies.get("user"))?.token,
      });
      return response?.data?.data?.access;
    } catch (error) {
      cookies.remove("user");
      cookies.remove("userModules");
      console.log("error", error?.response?.data?.errors?.error?.toString() || "Token expired")
      navigate("/login", { replace: true });
    }
  };
  return refreshTokenFn;
};

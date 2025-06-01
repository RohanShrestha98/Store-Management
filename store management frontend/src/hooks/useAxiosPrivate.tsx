import { useEffect } from "react";
import { axiosPrivate } from "../utils/axios";
import { useAuthStore } from "../store/useAuthStore";
import useVerify from "./useVerify";

export default function useAxiosPrivate() {
  const { user } = useAuthStore();
  const verify = useVerify();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && user?.token) {
          config.headers["Authorization"] = `Bearer ${user?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const result = await verify();
          prevRequest.headers.Authorization = `Bearer ${result?.token}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user?.access, verify]);

  return axiosPrivate;
}

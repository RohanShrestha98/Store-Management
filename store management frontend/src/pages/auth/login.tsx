/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const { setUser } = useAuthStore();
  const authMutation = useAuthMutation();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const onSubmitHandler = async (data) => {
    try {
      const result = await authMutation.mutateAsync(["post", "", data]);
      setUser({
        token: result?.data?.access,
        refresh: result?.data?.access,
        data: result?.data,
      });
      toast.success("Login successfully");
      result?.data?.role == "Staff" ? navigate("/user-product") : navigate("/");
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setError(error?.response?.data?.error);
    }
  };

  return (
    //
    <div className=" flex flex-col ">
      {/* <img src={loginBgR} className="absolute right-0 sm:w-7" alt="" /> */}
      <div className="flex md:justify-center p-4 gap-1 items-center ">
        <img className="h-8 w-8" src={logo} alt="logo" />
        <div className="font-bold text-[#121212] flex flex-col">
          <p>Staff Management System</p>
          {/* <p className="mt-[-6px]">App</p> */}
        </div>
      </div>
      <div className="md:items-center md:justify-center flex flex-col">
        <div className="flex flex-col items-center md:justify-center mt-10 ">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl">Log in</p>
              <p className="text-[#666] text-base font-medium">
                Enter your credentials to login to your account.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="flex w-full flex-col gap-3 md:px-4 "
            >
              <div className="rounded-md">
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Email <span className="text-red-600">*</span>
                </p>
                <LoginInput
                  className="bg-white w-full text-sm"
                  register={register}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  error={errors?.email?.message}
                />
                <p className="text-red-600 text-xs"></p>
              </div>
              <div className="rounded-md">
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Password <span className="text-red-600">*</span>
                </p>
                <LoginInput
                  className="bg-white w-full text-sm"
                  register={register}
                  name="password"
                  type="password"
                  placeholder="Password"
                  error={errors?.password?.message}
                />
              </div>
              <p className="text-red-600 text-xs">{error}</p>
              <div className={`tracking-tight flex gap-2 justify-end sm:my-4`}>
                {/* <p className="text-theme-color text-sm lg:text-xs whitespace-nowrap cursor-pointer underline">
                  Forgot your password?
                </p> */}
              </div>
              <Button
                buttonName={"Login"}
                className={"w-full h-10 text-lg font-normal "}
                icon={undefined}
              />
            </form>
          </div>
          <div className="flex whitespace-nowrap justify-center tracking-tight text-sm gap-1 mt-20">
            <p className="text-[#666]">Don’t have an account? </p>

            <p
              onClick={() => navigate("/signup")}
              className="text-theme-color text-blue-700 cursor-pointer underline"
            >
              register
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

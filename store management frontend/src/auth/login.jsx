import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "`react-router-dom`";
import { ImArrowRight2 } from "react-icons/im";
import { useAuthMutation } from "../hooks/UseMutateData";
import { useAuthContext } from "../context/authContext";
import Cookies from "universal-cookie";
import { encryptData } from "../utils/crypto";
import toast from "react-hot-toast";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import TextField from "../components/TextField";

const Login = () => {
  const { setAuth } = useAuthContext();
  const authMutation = useAuthMutation();
  const navigate = useNavigate();
  const cookies = new Cookies({ path: "/" });
  const [error, setError] = useState();
  let direction = "right";
  let changeView = "login";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });
  const onSubmitHandler = async (data) => {
    try {
      const response = await authMutation.mutateAsync(["post", "", data]);
      setAuth({
        token: response?.data?.access,
        refresh: response?.data?.refresh,
        data: response?.data?.user,
      });
      cookies.set("refreshToken", encryptData(response?.data?.refresh));
      cookies.set("userDetails", encryptData(response?.data));
      toast.success("Login successfully");
      navigate("/");
      reset();
    } catch (error) {
      console.log("error", error);
      setError(error?.response?.data?.errors);
    }
  };

  return (
    <AuthLayout
      changeView={() => navigate("/reset")}
      view={"login"}
      direction={direction}
      submitHandler={handleSubmit(onSubmitHandler)}
      // isLoading={mutation.isLoading}
    >
      <TextField
        type="email"
        placeholder="Email"
        // Icon={EmailSvg}
        required
        register={register}
        {...register("email")}
      />
      <TextField
        type="password"
        placeholder="Password"
        // Icon={LockSvg}
        required
        register={register}
        value={watch("password") || ""}
      />
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            name="remember"
            className="h-3.5 w-3.5 cursor-pointer accent-primary"
          />
          <label htmlFor="remember-me" className="cursor-pointer pl-2 text-sm">
            Keep me logged in
          </label>
        </div>
        <button
          type="button"
          className="cursor-pointer text-sm underline underline-offset-2 hover:text-primary hover:decoration-primary"
          onClick={() => changeView("reset")}
        >
          Forgot password?
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;

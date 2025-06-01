/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useAuthSignupMutation,
  useChangePasswordMutation,
} from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  firstName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  lastName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  password: Yup.string().required("Required"),
});

const SignUp = () => {
  const { setUser } = useAuthStore();
  const authMutation = useAuthSignupMutation();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const fieldSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Required"),
    newPassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    // password: Yup.string().required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {},
  });

  const changePasswordMutation = useChangePasswordMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      userId: user?.id,
    };
    try {
      const response = await changePasswordMutation.mutateAsync([
        `post`,
        "",
        postData,
      ]);
      toast.success(`Password changed successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };

  return (
    //
    <div className=" flex flex-col ">
      {/* <img src={loginBgR} className="absolute right-0 sm:w-7" alt="" /> */}
      <div className="flex md:justify-center p-4 gap-1 items-center ">
        <img className="h-12 w-12" src={logo} alt="logo" />
        <div className="font-bold text-[#121212] flex flex-col">
          <p>Risk Register</p>
          <p className="mt-[-6px]">App</p>
        </div>
      </div>
      <div className="md:items-center md:justify-center flex flex-col">
        <div className="flex flex-col items-center md:justify-center mt-10 ">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl">Reset Password </p>
              <p className="text-[#666] text-base font-medium">
                Reset your password
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="m-6 border p-4 bg-white"
            >
              <p
                className={`text-sm font-semibold mb-4 ${
                  active ? "text-blue-800" : ""
                }`}
                onClick={() => setActive(true)}
              >
                Change Password
              </p>
              <div className="grid grid-cols-2 text-sm gap-2 w-1/2 ">
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Oid Password <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="oldPassword"
                    type="password"
                    placeholder="Enter old password"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.oldPassword?.message ?? error?.oldPassword}
                  </p>
                </div>

                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    New Password <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.newPassword?.message ?? error?.newPassword}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Confirm Password <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter confirm password"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.confirmPassword?.message ?? error?.confirmPassword}
                  </p>
                </div>
              </div>
              <p className="text-red-600 text-xs">
                {errors?.confirmPassword?.message ?? error?.error}
              </p>
              <Button
                buttonName={"Change Password"}
                className={" h-9 w-1/2 text-sm mt-4 font-normal "}
                icon={undefined}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

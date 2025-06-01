import InputField from "@/ui/InputField";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  useAuthMutation,
  useChangePasswordMutation,
} from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import LoginInput from "@/ui/LoginInput";
import Button from "@/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function Settings() {
  const [active, setActive] = useState(true);
  const [error, setError] = useState(true);
  const { user } = useAuthStore();
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
  );
}

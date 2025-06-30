/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthSignupMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  lastName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  address: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  password: Yup.string().required("Required"),
});

const SignUp = () => {
  const authMutation = useAuthSignupMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { registerStore, setRegisterStore } = useAuthStore();
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

  useEffect(() => {
    setRegisterStore({
      storeId: searchParams.get("store"),
      userId: searchParams.get("userId"),
    });
  }, []);

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      isVerified: false,
      storeId: registerStore?.storeId,
      createdBy: registerStore?.userId,
    };
    try {
      await authMutation.mutateAsync(["post", "", postData]);
      toast.success("Regsiter successfully");
      navigate("/login");
      reset();
    } catch (error) {
      console.log("error", error);
      setError(error?.response?.data?.message);
    }
  };

  return (
    //
    <div className=" flex flex-col ">
      <div className="flex md:justify-center p-4 gap-1 items-center ">
        <img className="h-8 w-8" src={logo} alt="logo" />
        <div className="font-bold text-[#121212] flex flex-col">
          <p>Staff Management System</p>
          {/* <p className="mt-[-6px]">App</p> */}
        </div>
      </div>
      <div className="md:items-center md:justify-center flex flex-col">
        <div className="flex flex-col items-center md:justify-center mt-4 ">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl text-center">Register </p>
              <p className="text-[#666] text-base font-medium">
                Register your free account
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="w-[500px] lg:w-full "
            >
              <div className="grid grid-cols-2  gap-3">
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Firstname <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.firstName?.message ?? error?.firstName}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Lastname <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.lastName?.message ?? error?.lastName}
                  </p>
                </div>

                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Email <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.email?.message ?? error?.email}
                  </p>
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
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.password?.message ?? error?.password}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Phone number <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="phoneNumber"
                    type="number"
                    placeholder="Enter phone number"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.phoneNumber?.message ?? error?.phoneNumber}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Address <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="address"
                    type="text"
                    placeholder="Enter your address"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.address?.message ?? error?.address}
                  </p>
                </div>
              </div>
              <p className="text-red-600 text-xs mt-6">{error}</p>
              <Button
                buttonName={"Register"}
                className={"w-full h-10 text-lg mt-6 font-normal "}
                icon={undefined}
              />
            </form>
          </div>
          <div className="flex whitespace-nowrap justify-center tracking-tight text-sm gap-1 mt-20">
            <p className="text-[#666]">Already have an account? </p>

            <p
              onClick={() => navigate("/login")}
              className="text-theme-color text-blue-700 cursor-pointer underline"
            >
              login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

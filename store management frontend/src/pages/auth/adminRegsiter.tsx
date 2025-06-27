/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthAdminMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  name: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  storeLimit: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  password: Yup.string().required("Required"),
});

const AdminRegister = () => {
  const authMutation = useAuthAdminMutation();
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
      await authMutation.mutateAsync(["post", "", data]);
      toast.success("Admin register successfully");
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
      <div className="flex cursor-pointer md:justify-center p-4 gap-1 items-center mb-1">
        <img className="h-12 w-12" src={logo} alt="logo" />
        {
          <div className="flex flex-col mt-2">
            <p className="text-[10px] font-semibold mb-[-6px] pl-[2px]">
              store
            </p>
            <p className="font-bold text-xl">STORE</p>
          </div>
        }
      </div>
      <div className="md:items-center md:justify-center flex flex-col">
        <div className="flex flex-col items-center md:justify-center mt-4 ">
          <div className="flex flex-col items-center px-10">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl text-center">Register </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="w-[480px] lg:w-full "
            >
              <div className="grid grid-cols-2  gap-3">
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Name <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.name?.message ?? error?.name}
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
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Store Limit <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="storeLimit"
                    type="number"
                    placeholder="Enter store limit"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.storeLimit?.message ?? error?.storeLimit}
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

export default AdminRegister;

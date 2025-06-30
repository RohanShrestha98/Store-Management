import { useClockInMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function ClockIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });
  const [error, setError] = useState();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const clockInMutation = useClockInMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      storeNumber: 2301,
    };
    try {
      const response = await clockInMutation.mutateAsync([
        "post",
        "/create/",
        postData,
      ]);
      reset();
      setError();
      setUser({
        token: response?.data?.access,
        refresh: response?.data?.access,
        data: response?.data,
      });
      navigate("/user-product");
      toast.success(`Clockin successfully`);
    } catch (err) {
      console.log("err", err);
      toast.error(`${err?.response?.data?.message}`);
      setError(err?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="flex cursor-pointer md:justify-center p-4 gap-1 items-center mb-1">
        <img className="h-12 w-12" src={logo} alt="logo" />
        <div className="flex flex-col mt-2">
          <p className="text-[10px] font-semibold mb-[-6px] pl-[2px]">store</p>
          <p className="font-bold text-xl">STORE</p>
        </div>
      </div>
      <div className="flex justify-center items-center h-full mt-[100px] ">
        <form
          className="flex flex-col gap-10 w-80 p-4 drop-shadow-md bg-white rounded-[10px] py-6 border"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <InputField
            register={register}
            name="staffId"
            placeholder="Enter staff id"
            className="w-full text-sm text-gray-500"
            defaultValue=""
            required={true}
            label="Staff ID"
            error={error}
          />
          <Button
            type="submit"
            buttonName={`Submit`}
            className={"w-full"}
            icon={""}
          />
        </form>
      </div>
    </div>
  );
}

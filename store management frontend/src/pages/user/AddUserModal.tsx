import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useUserMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useStoreData } from "@/hooks/useQueryData";

export default function AddUserModal({
  asChild,
  children,
  edit = false,
  editData,
}) {
  console.log("editData", editData);
  const [selectedStore, setSelectedStore] = useState(
    edit ? editData?.role?.title : ""
  );
  const [open, setOpen] = useState(false);
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [error, setError] = useState("");
  const { data, isLoading, isError } = useStoreData();
  console.log("data", data);

  const fieldSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    lastName: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    email: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    staffId: Yup.string().required("Required"),
    password: Yup.string().when(`${edit}`, {
      is: false,
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    payPerHour: Yup.string().required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {
      firstName: editData?.firstName ?? "",
      lastName: editData?.lastName ?? "",
      phoneNumber: editData?.phoneNumber ?? "",
      address: editData?.address ?? "",
      email: editData?.email ?? "",
      staffId: editData?.staffId ?? "",
      payPerHour: editData?.payPerHour ?? "",
    },
  });

  useEffect(() => {
    reset({
      firstName: editData?.firstName ?? "",
      lastName: editData?.lastName ?? "",
      phoneNumber: editData?.phoneNumber ?? "",
      address: editData?.address ?? "",
      email: editData?.email ?? "",
      staffId: editData?.staffId ?? "",
      payPerHour: editData?.payPerHour ?? "",
    });
    setError();
  }, [editData, reset, open]);

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedStore("");
    reset();
  };

  const userMutation = useUserMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      isVerified: true,
      store_number: selectedStore,
    };
    try {
      await userMutation.mutateAsync([
        `${edit ? "patch" : "post"}`,
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setHasSubmittedClick(false);
      setOpen(false);
      reset();
      setError();
      toast.success(`Staff ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };

  const storeOptions = data?.data?.map((item) => {
    return {
      label: item?.name,
      value: item?.storeNumber,
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Staff
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                register={register}
                name="firstName"
                placeholder="Enter First Name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="First Name"
                error={errors?.firstname?.message ?? error?.firstname}
              />
              <InputField
                register={register}
                name="lastName"
                placeholder="Enter Last Name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Last Name"
                error={errors?.lastname?.message ?? error?.lastname}
              />
              <InputField
                register={register}
                required
                name="email"
                type="email"
                placeholder="Enter email"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                label="Email"
                error={errors?.email?.message ?? error?.email}
              />
              {!edit && (
                <InputField
                  register={register}
                  required
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  label="Password"
                  error={errors?.password?.message ?? error?.password}
                />
              )}

              <InputField
                register={register}
                name="address"
                placeholder="Enter user address"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                error={errors?.address?.message ?? error?.address}
                label="Address"
              />

              <InputField
                register={register}
                name="phoneNumber"
                placeholder="Enter phone number"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required={true}
                type="number"
                label="Phone number"
                error={errors?.phonenumber?.message ?? error?.phonenumber}
              />

              <div>
                <CustomSelect
                  options={storeOptions}
                  label={""}
                  placeholder={edit ? editData?.store?.name : "Select store"}
                  setSelectedField={setSelectedStore}
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Store"}
                  required={true}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick && !selectedStore && "Required"}
                  {error?.store}
                </p>
              </div>
              <InputField
                register={register}
                name="staffId"
                placeholder="Enter staff id"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required={true}
                label="Staff ID"
                error={errors?.staffId?.message}
              />
              <InputField
                register={register}
                name="payPerHour"
                placeholder="Enter pay per hour"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required={true}
                type="number"
                label="Pay per hour"
                error={errors?.payPerHour?.message}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={`${edit ? "Reset" : "Clear"}`}
              className={"w-full "}
              danger
              handleButtonClick={(e) => handleClear(e)}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} Staff`}
              handleButtonClick={() => {
                setHasSubmittedClick(true);
              }}
              className={"w-full"}
              icon={""}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

export default function AddUserModal({
  asChild,
  children,
  edit = false,
  editData,
}) {
  console.log("editData", editData);
  const [selectedRole, setSelectedRole] = useState(
    edit ? editData?.role?.title : ""
  );
  const [open, setOpen] = useState(false);
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [error, setError] = useState("");

  const fieldSchema = Yup.object().shape({
    firstname: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    lastname: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    email: Yup.string().required("Required"),
    phonenumber: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    // password: Yup.string().required("Required"),
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
      firstname: editData?.firstName ?? "",
      lastname: editData?.lastName ?? "",
      username: editData?.username ?? "",
      phonenumber: editData?.phoneNumber ?? "",
      email: editData?.email ?? "",
      role: editData?.role?.title ?? "",
    },
  });

  useEffect(() => {
    reset({
      firstname: editData?.firstName ?? "",
      lastname: editData?.lastName ?? "",
      username: editData?.username ?? "",
      phonenumber: editData?.phoneNumber ?? "",
      email: editData?.email ?? "",
      role: editData?.role?.title ?? "",
    });
    setError();
  }, [editData, reset, open]);

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedRole("");
    reset();
  };

  const userMutation = useUserMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      isVerified: true,
      RoleID: selectedRole ?? editData?.role?.id,
    };
    try {
      const response = await userMutation.mutateAsync([
        `${edit ? "patch" : "post"}`,
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setHasSubmittedClick(false);
      setOpen(false);
      reset();
      setError();
      toast.success(`User ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };
  const roleOptions = [
    {
      value: 1,
      label: "Admin",
    },
    {
      value: 2,
      label: "Analyst",
    },
    {
      value: 3,
      label: "Mid Level Analyst",
    },
    {
      value: 4,
      label: "Executive Level Analyst",
    },
    {
      value: 5,
      label: "ISO",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} User
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <InputField
                  register={register}
                  name="firstname"
                  placeholder="Enter First Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="First Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.firstname?.message ?? error?.firstname}
                </p>
              </div>

              <div className="">
                <InputField
                  register={register}
                  name="lastname"
                  placeholder="Enter Last Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="Last Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.lastname?.message ?? error?.lastname}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  name="username"
                  placeholder="Enter user Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="User Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.username?.message ?? error?.username}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  required
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  label="Email"
                />
                <p className="text-red-600 text-xs">
                  {errors?.email?.message ?? error?.email}
                </p>
              </div>
              {!edit && (
                <div className="">
                  <InputField
                    register={register}
                    required
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full text-sm text-gray-500"
                    defaultValue=""
                    label="Password"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.password?.message ?? error?.password}
                  </p>
                </div>
              )}
              <div>
                <CustomSelect
                  options={roleOptions}
                  label={""}
                  placeholder={edit ? editData?.role?.title : "Select role"}
                  setSelectedField={setSelectedRole}
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Role"}
                  required={true}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick && !selectedRole && "Required"}
                  {error?.role}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  name="phonenumber"
                  placeholder="Enter phone number"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required={true}
                  type="number"
                  label="Phone number"
                />
                <p className="text-red-600 text-xs">
                  {errors?.phonenumber?.message ?? error?.phonenumber}
                </p>
              </div>
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
              buttonName={`${edit ? "Edit" : "Add"} User`}
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

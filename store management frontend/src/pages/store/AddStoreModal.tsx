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
import { useStoreMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function AddStoreModal({
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
    name: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    address: Yup.string().required("Required"),
    store_number: Yup.string().required("Required"),
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
      name: editData?.name ?? "",
      address: editData?.address ?? "",
      store_number: editData?.store_number ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: editData?.name ?? "",
      address: editData?.address ?? "",
      store_number: editData?.store_number ?? "",
    });
    setError();
  }, [editData, reset, open]);

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedRole("");
    reset();
  };

  const storeMutation = useStoreMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      open: [],
      close: [],
    };
    try {
      await storeMutation.mutateAsync([
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
          {edit ? "Edit" : "Add"} Store
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                register={register}
                name="name"
                placeholder="Enter store name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Store name"
                error={errors?.name?.message ?? error?.name}
              />
              <InputField
                register={register}
                name="address"
                placeholder="Enter store address"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Address"
                error={errors?.lastname?.message ?? error?.lastname}
              />
              <InputField
                register={register}
                required
                name="store_number"
                placeholder="Enter store number"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                label="Store number"
                error={errors?.store_number?.message ?? error?.store_number}
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
              buttonName={`${edit ? "Edit" : "Add"} Store`}
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

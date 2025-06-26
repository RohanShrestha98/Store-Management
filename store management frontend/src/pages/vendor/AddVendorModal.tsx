import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useVendorMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import KeywordSelect from "@/components/KeywordSelect";

export default function AddVendorModal({
  asChild,
  children,
  edit = false,
  editData,
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [productList, setProductList] = useState([]);

  const fieldSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    address: Yup.string().required("Required"),
    storeName: Yup.string().required("Required"),
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
      storeName: editData?.storeName ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: editData?.name ?? "",
      address: editData?.address ?? "",
      storeName: editData?.storeName ?? "",
    });
    setError();
  }, [editData, reset, open]);

  const handleClear = (e) => {
    e.preventDefault();
    reset();
  };

  const vendorMutation = useVendorMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      products: productList,
    };
    try {
      await vendorMutation.mutateAsync([
        `${edit ? "patch" : "post"}`,
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setOpen(false);
      reset();
      setError();
      toast.success(`Vendor ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Vendor
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                register={register}
                name="name"
                placeholder="Enter vendor name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Vendor name"
                error={errors?.name?.message ?? error?.name}
              />
              <InputField
                register={register}
                required
                name="storeName"
                placeholder="Enter store name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                label="Store name"
                error={errors?.storeName?.message ?? error?.storeName}
              />
            </div>
            <InputField
              register={register}
              name="address"
              placeholder="Enter vendor address"
              className="w-full text-sm text-gray-500"
              defaultValue=""
              required
              label="Address"
              error={errors?.address?.message ?? error?.address}
            />
            <KeywordSelect
              title={"Enter the product you buy from this vendor"}
              id="products"
              tags={productList}
              setTags={setProductList}
            />
          </div>
          <div className="grid grid-cols-2 w-full mt-14 gap-2">
            <Button
              buttonName={`${edit ? "Reset" : "Clear"}`}
              className={"w-full "}
              danger
              handleButtonClick={(e) => handleClear(e)}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} Vendor`}
              className={"w-full"}
              icon={""}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

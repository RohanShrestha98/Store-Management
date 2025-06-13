import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import {
  useUserMutation,
  useCategoryMutation,
  useStoreMutation,
  useProductMutation,
  useVendorMutation,
} from "@/hooks/useMutateData";
import "react-quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteModal({ asChild, children, title, desc, id }) {
  const loaction = useLocation();
  const [open, setOpen] = useState(false);
  const pathname = loaction?.pathname?.slice(1);
  const userMutation = useUserMutation();
  const categoryMutation = useCategoryMutation();
  const storeMutation = useStoreMutation();
  const productMutation = useProductMutation();
  const vendorMutation = useVendorMutation();

  const deleteMutation =
    pathname === "store"
      ? storeMutation
      : pathname === "category"
      ? categoryMutation
      : pathname === "product"
      ? productMutation
      : pathname === "vendor"
      ? vendorMutation
      : pathname === "user" && userMutation;

  const handleDelete = async () => {
    try {
      const response = await deleteMutation.mutateAsync([
        "delete",
        `delete/${id}/`,
      ]);
      setOpen(false);
      toast.success("Deleted successfully");
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.errors?.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="max-w-[325px]  min-w-[300px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base ">
          {title}
        </DialogTitle>
        <div>
          <div>{desc} ?</div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={"Cancel"}
              className={"w-full "}
              handleButtonClick={() => setOpen(false)}
              icon={""}
            />
            <Button
              type="submit"
              buttonName="Confirm"
              handleButtonClick={() => {
                handleDelete();
              }}
              className={"w-full bg-red-600 border-red-600 hover:text-red-600"}
              icon={""}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

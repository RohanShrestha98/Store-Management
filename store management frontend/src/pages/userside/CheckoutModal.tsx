import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Loading from "@/assets/AllSvg";

export default function CheckoutModal({
  asChild,
  children,
  loading,
  open,
  setOpen,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[200px] max-[200px] w-60 bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base mt-[-10px]">
          Checkout Process
        </DialogTitle>
        <div className="flex flex-col items-center text-center justify-center  gap-2 p-4">
          {<Loading />}
          <p className="font-semibold text-sm">Payment in process</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

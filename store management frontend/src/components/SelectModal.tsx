import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputField from "@/ui/InputField";
import { useState } from "react";
import { LuStore } from "react-icons/lu";

export default function SelectModal({
  asChild,
  children,
  title,
  setSearchText,
  setSelectedField,
  data,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="max-w-[625px]  min-w-[600px]  bg-[#FAFAFA] ">
        <DialogTitle className="text-[#22244D] font-medium text-base flex mt-3 items-center justify-between">
          <p>Select {title}</p>
          <InputField
            placeholder={`Search ${title} ...`}
            className={"w-[180px] px-1 border text-gray-500 border-gray-300"}
            setSearchText={setSearchText}
          />
        </DialogTitle>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2 min-h-[280px]">
            {data?.map((item) => {
              return (
                <div
                  onClick={() => {
                    setSelectedField(item?.id);
                    setOpen(!open);
                  }}
                  className="border h-fit border-gray-400 bg-blue-50 hover:bg-blue-800 hover:text-white rounded-[8px] flex flex-col gap-1 py-3 cursor-pointer  justify-center items-center"
                >
                  <LuStore />
                  <p className="text-sm">{item?.name}</p>{" "}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

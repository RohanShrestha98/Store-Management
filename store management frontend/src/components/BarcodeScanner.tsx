import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import { useEffect, useRef, useState } from "react";

export default function BarcodeScanner({
  open,
  setOpen,
  children,
  asChild,
  setScannedBarCode,
}) {
  const [manual, setManual] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (manual) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (inputValue.trim()) {
          setScannedBarCode(inputValue);
        }
      }, 3000);
    } else {
      if (inputValue.trim()) {
        setScannedBarCode(inputValue);
        setOpen(false);
      }
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, manual]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="max-w-[325px] min-w-[300px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] mt-4 font-medium text-base flex items-center justify-between gap-2">
          <p>Scan Barcode</p>
          <div
            onClick={() => setManual(!manual)}
            className={`flex items-center gap-1 font-semibold rounded-[6px] cursor-pointer border text-sm px-2 ${
              !manual ? "bg-gray-200" : "bg-blue-200"
            }`}
          >
            Manual
          </div>
        </DialogTitle>
        <div>
          <input
            placeholder={"Scan the product barcode"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`flex h-8 border border-gray-300 rounded-lg bg-white px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:border-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full mt-[-10px] ${
              !manual && "cursor-not-allowed"
            }`}
          />
          <div className="w-full mt-8 gap-2">
            <Button
              type="submit"
              buttonName="Confirm"
              disabled={!manual}
              handleButtonClick={() => {
                setScannedBarCode(inputValue); // immediate on confirm
                setOpen(false);
                setManual(false);
              }}
              className={"w-full"}
              icon={""}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

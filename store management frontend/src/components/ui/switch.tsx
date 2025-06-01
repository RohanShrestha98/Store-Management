"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, isToggle, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gray-300 transition-colors focus-visible:outline-[#4365a7] bg-gray-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#4365a7] data-[state=checked]:border-[#4365a7] data-[state=unchecked]:bg-gray-100",
      className,
      isToggle ? "h-5 w-9 " : ""
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block ml-[2px]  bg-gray-300 data-[state=checked]:border-[#4365a7] data-[state=checked]:bg-white border h-5 w-5 rounded-full  shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        isToggle ? "h-4 w-4 ml-[1px] data-[state=checked]:translate-x-4" : ""
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

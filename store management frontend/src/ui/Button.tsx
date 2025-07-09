import { Button as ShadcnButton } from "@/components/ui/button";

export default function Button({
  buttonName,
  loading,
  className,
  handleButtonClick,
  icon,
  danger = false,
  type,
  noFill,
  disabled = false,
}) {
  return (
    <div>
      <ShadcnButton
        onClick={handleButtonClick}
        type={type}
        disabled={loading || disabled}
        className={`${
          danger
            ? "border border-red-600  text-red-600 hover:bg-red-600 hover:text-white"
            : noFill
            ? "bg-white text-[#000080] hover:bg-[#000080] border border-[#000080] hover:text-white"
            : "bg-[#000080] text-white  hover:bg-white border border-[#000080] hover:text-[#000080]"
        } flex items-center gap-1 h-8   ${className}`}
      >
        {icon}
        {buttonName}
      </ShadcnButton>
    </div>
  );
}

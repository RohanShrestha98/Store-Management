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
}) {
  return (
    <div>
      <ShadcnButton
        onClick={handleButtonClick}
        type={type}
        disabled={loading}
        className={`${
          danger
            ? "border border-red-600  text-red-600 hover:bg-red-600 hover:text-white"
            : noFill
            ? "bg-white text-[#121212] hover:bg-[#121212] border border-[#121212] hover:text-white"
            : "bg-[#121212] text-white hover:bg-white border border-[#121212] hover:text-[#121212]"
        } flex items-center gap-1 h-8 rounded  ${className}`}
      >
        {icon}
        {buttonName}
      </ShadcnButton>
    </div>
  );
}

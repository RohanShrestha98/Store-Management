import Button from "@/ui/Button";
import { FaPlus } from "react-icons/fa6";

export default function TopButton({ buttonName, className, handleButtonClick }) {
    return (
        <div className="flex justify-end">
            <Button buttonName={buttonName} icon={<FaPlus />} className={className} handleButtonClick={handleButtonClick} />
        </div>
    )
}

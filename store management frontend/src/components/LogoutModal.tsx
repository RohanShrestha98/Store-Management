import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/ui/Button"
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";


export default function LogoutModal({ asChild, children }) {
    const [open, setOpen] = useState(false)
    const cookies = new Cookies();


    const navigate = useNavigate()

    const handleLogout = () => {
        cookies.remove("user");
        setOpen(false)
        navigate("/login")
        toast.success("Logout success")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[325px]  min-w-[300px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">Logout</DialogTitle>
                <div>
                    <div>Are you sure you want to logout?</div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={"Cancel"} className={"w-full "} handleButtonClick={() => setOpen(false)} icon={""} />
                        <Button type="submit" buttonName="Logout" handleButtonClick={() => { handleLogout() }} className={"w-full bg-red-600 border-red-600 hover:text-red-600"} icon={""} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

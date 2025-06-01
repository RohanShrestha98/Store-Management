import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { MdOutlineMail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { useCourseData, usePackageData } from "@/hooks/useQueryData";
import InputField from "@/ui/InputField";
import { useManualPaymentMutation } from "@/hooks/useMutateData";
import { useForm } from "react-hook-form";
import Button from "@/ui/Button";
import toast from "react-hot-toast";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import CustomSelect from "@/ui/CustomSelect";


export default function AddManualPaymentModal({ asChild, children, editData }) {
    const [open, setOpen] = useState(false)
    const { data: courseData } = useCourseData()
    const [selectedPackage, setSelectedPackage] = useState()
    const [error, setError] = useState()
    const { register, reset, handleSubmit } = useForm()
    const [selectedCourse, setSelectedCourse] = useState()
    const { data } = usePackageData("", selectedCourse, "10", "1")

    const courseOptions = convertToSelectOptions(courseData?.data)
    const manualPaymanetMutation = useManualPaymentMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            userID: editData?.id,
            packageID: selectedPackage,
        }
        try {
            const response = await manualPaymanetMutation.mutateAsync(["post", "", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Payment added successfully`)
        } catch (err) {
            { err?.response?.data?.errors?.error && toast.error(err?.response?.data?.errors?.error, [2]) }
            setError(err?.response?.data?.errors)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[600px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] uppercase font-medium text-base">Add Payment</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-100 "></div>
                        <div className="flex flex-col gap-1">
                            <p>{editData?.firstName} {editData?.middleName} {editData?.lastName}</p>
                            <p className="text-[#6D7177] flex items-center gap-1 text-sm"> <MdOutlineMail size={16} /> {editData?.email}</p>
                            <p className="text-[#6D7177] flex items-center gap-1 text-xs"> <MdLocalPhone size={16} /> {editData?.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[#6F7A90] text-sm font-medium">Select a subscription to add</p>
                        <CustomSelect options={courseOptions} placeholder={"Select course"} className={"max-w-[220px] min-w-[220px]  text-sm text-gray-500"} setSelectedField={setSelectedCourse} />
                    </div>
                    <div className="border-x border-gray-200 rounded-sm ">
                        {
                            data?.data ?
                                <table className="w-full text-sm text-gray-700 ">
                                    <thead className='border-y h-8 bg-[#F6F7F9] text-[#6F7A90]'>
                                        <tr>
                                            <th>Package Name</th>
                                            <th>Period (In Days)</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#4C5666] border-b ">
                                        {data?.data?.map((item) => {
                                            return <tr key={item?.id} onClick={() => { setSelectedPackage(item?.id) }} className='cursor-pointer  h-10 hover:bg-[#ECF2FE]'>
                                                <td className=' flex mt-3 items-center  ml-8 gap-1'><input type="radio" checked={selectedPackage === item?.id} name="" id="" />{item?.title}</td>
                                                <td className='text-start pl-10'> {item?.period} days</td>
                                                <td className='text-start pl-10 '>Rs {item?.price}</td>
                                            </tr>
                                        }
                                        )}
                                    </tbody>


                                </table> : <div className="h-[200px] text-gray-500 font-semibold bg-white flex flex-col justify-center items-center">
                                    No package in this course
                                </div>
                        }
                    </div>
                    <div>
                        <InputField register={register} name="invoiceNumber" placeholder="Enter Invoice number" className="w-full text-sm text-gray-500" defaultValue="" required label="Invoice Number" />
                        <p className="text-red-600 text-xs">
                            {error?.invoiceId}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={"Cancel"} className={"w-full "} danger handleButtonClick={(e) => {
                            e.preventDefault()
                            setOpen(false)
                        }} icon={""} />
                        <Button type="submit" buttonName={`Add Payment`} handleButtonClick={() => { }} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

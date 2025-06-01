import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useNotificationMutation } from "@/hooks/useMutateData";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRiskData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import moment from "moment";
import ReactQuill from "react-quill";

export default function AddNotificationModal({
  asChild,
  children,
  edit,
  editData,
}) {
  const [open, setOpen] = useState(false);
  const [selectedNotificationType, setSelectedNotificationType] = useState(
    edit ? editData?.notificationType : ""
  );
  const [selectedRecipientType, setSelectedRecipientType] = useState(
    edit ? editData?.recipient : ""
  );
  const [selectedRisk, setSelectedRisk] = useState(edit ? editData?.risk : "");
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [error, setError] = useState("");
  const { data } = useRiskData();
  const [value, setValue] = useState(edit ? editData?.description : "");

  const riskOptions = convertToSelectOptions(data?.data);

  const fieldSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required")
      .max(100, "Must be 100 characters or less"),
    scheduledDate: Yup.string().required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {
      title: editData?.title,
      scheduledDate: editData?.scheduledDate?.slice(0, 16),
    },
  });

  useEffect(() => {
    reset({
      title: editData?.title,
      scheduledDate: editData?.scheduledDate?.slice(0, 16),
    });
    setError();
  }, [editData, reset, open]);
  const notificationMutation = useNotificationMutation();

  const notificationTypeOptions = [
    {
      label: "Push notification",
      value: "push notification",
    },
    {
      label: "Announcement",
      value: "announcement",
    },
  ];
  const recipientTypeOptions = [
    {
      value: 1,
      label: "Admin",
    },
    {
      value: 2,
      label: "Analyst",
    },
    {
      value: 3,
      label: "Mid Level Analyst",
    },
    {
      value: 4,
      label: "Executive Level Analyst",
    },
    {
      value: 5,
      label: "ISO",
    },
  ];

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      notificationType: selectedNotificationType,
      recipient: selectedRecipientType,
      riskId: selectedRisk,
      description: value,
      scheduledDate: moment(data?.scheduledDate).format(),
    };
    try {
      const response = await notificationMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setOpen(false);
      reset();
      setValue("");
      setError();
      toast.success(`Notification ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.errors?.error);
      setError(err?.response?.data?.errors);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Notification
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <div>
              <InputField
                register={register}
                name="title"
                placeholder="Enter Notification Name"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Notification Name"
              />
              <p className="text-red-600 text-xs">
                {errors?.title?.message ?? error?.title}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <CustomSelect
                  options={notificationTypeOptions}
                  placeholder={
                    edit
                      ? editData?.notificationType
                      : selectedNotificationType
                      ? selectedNotificationType
                      : "Select type"
                  }
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Notification type"}
                  required={true}
                  setSelectedField={setSelectedNotificationType}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick &&
                    !selectedNotificationType &&
                    !edit &&
                    "Required"}
                </p>
              </div>
              <div>
                <CustomSelect
                  options={recipientTypeOptions}
                  placeholder={
                    edit
                      ? editData?.recipient
                      : selectedRecipientType
                      ? selectedRecipientType
                      : "Select recipient"
                  }
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Recipient"}
                  required={true}
                  setSelectedField={setSelectedRecipientType}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick &&
                    !selectedRecipientType &&
                    !edit &&
                    "Required"}
                </p>
              </div>
              {(selectedRecipientType || editData?.recipient) === "course" && (
                <div>
                  <CustomSelect
                    options={riskOptions}
                    placeholder={
                      edit
                        ? editData?.risk?.title
                        : selectedRisk
                        ? selectedRisk
                        : "Select course"
                    }
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Course"}
                    required={true}
                    setSelectedField={setSelectedRisk}
                  />
                </div>
              )}
              <div className="">
                <InputField
                  type="datetime-local"
                  register={register}
                  name="scheduledDate"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="Scheduled date"
                />
                <p className="text-red-600 text-xs">
                  {errors?.scheduledDate?.message ?? error?.scheduledDate}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
                Description <span className="text-red-600">*</span>{" "}
              </p>
              <ReactQuill
                theme="snow"
                className="h-[100px] mb-10"
                value={value}
                onChange={setValue}
              />
              <p className="text-red-600 text-xs">{error?.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={"Clear"}
              className={"w-full "}
              danger
              handleButtonClick={(e) => {
                handleClear(e);
              }}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} Notification`}
              handleButtonClick={() => setHasSubmittedClick(true)}
              className={"w-full"}
              icon={""}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

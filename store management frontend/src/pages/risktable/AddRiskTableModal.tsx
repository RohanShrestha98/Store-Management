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
import { useRiskMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText";
import moment from "moment";
import { MultiSelect } from "@/ui/MultiSelect";

export default function AddRiskTableModal({
  asChild,
  children,
  edit,
  editData,
}) {
  const [open, setOpen] = useState(false);
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [value, setValue] = useState(edit ? editData?.description : "");
  const [risk, setRisk] = useState(edit ? editData?.risk : "");
  const [action, setAction] = useState(edit ? editData?.action : "");
  const [error, setError] = useState("");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState();
  edit ? editData?.threatLevel : "";
  const [selectedlLikelihood, setSelectedLikelihood] = useState();
  edit ? editData?.likelihood : "";
  const [selectedImpact, setSelectedImpact] = useState();
  edit ? editData?.impact : "";
  const [selectedAssignee, setSelectedAssignee] = useState();
  edit ? editData?.assignees?.[0]?.username : "";
  const [selectedStatus, setSelectedStatus] = useState();
  edit ? editData?.status : "";

  const fieldSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required")
      .max(50, "Must be 36 characters or less"),
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
      description: editData?.description,
      risk: editData?.risk,
      action: editData?.action,
      threatLevel: editData?.threatLevel,
      impact: editData?.impact,
      likelihood: editData?.likelihood,
      assignees: editData?.assignees?.[0]?.username,
      status: editData?.status,
      deadline: editData?.deadline?.slice(0, 16),
    },
  });

  useEffect(() => {
    reset({
      threatLevel: editData?.threatLevel,
      title: editData?.title,
      description: editData?.description,
      risk: editData?.risk,
      assignees: editData?.assignees?.[0]?.username,
      status: editData?.status,
      action: editData?.action,
      impact: editData?.impact,
      likelihood: editData?.likelihood,
      deadline: editData?.deadline?.slice(0, 16),
    });
    setError();
  }, [editData, reset, open]);

  const threatlevelOptions = [...Array(10)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const statusOptions = [
    {
      value: "identified",
      label: "Identified",
    },
    {
      value: "evaluated",
      label: "Evaluated",
    },
    {
      value: "mitigationInProgress",
      label: "Mitigation in Progress",
    },
    {
      value: "mitigated",
      label: "Mitigated",
    },
    {
      value: "opened",
      label: "Opened",
    },
    {
      value: "closed",
      label: "Closed",
    },
    {
      value: "escalated",
      label: "Escalated",
    },
    {
      value: "transferred",
      label: "Transferred",
    },
  ];
  const impactOptions = [
    {
      value: "low",
      label: "Low",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "high",
      label: "High",
    },
    {
      value: "critical",
      label: "Critical",
    },
  ];
  const roleOptions = [
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
  const riskMutation = useRiskMutation();
  console.log("selectedAssignee", selectedAssignee);

  const onSubmitHandler = async (data) => {
    const assignees = [];
    selectedAssignee?.map((item) => assignees?.push(item?.value));
    const postData = {
      ...data,
      threatLevel: parseInt(selectedThreatLevel ?? editData?.threatLevel),
      impact: selectedImpact ?? editData?.impact,
      likelihood: selectedlLikelihood ?? editData?.likelihood,
      assignees: assignees ?? editData?.assignees,
      status: selectedStatus ?? editData?.status,
      description: ConvertHtmlToPlainText(value),
      risk: ConvertHtmlToPlainText(risk),
      action: ConvertHtmlToPlainText(action),
      deadline: moment(data?.deadline).format(),
    };

    try {
      const response = await riskMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setOpen(false);
      reset();
      setError();
      toast.success(`Risk ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setValue("");
    setAction("");
    setRisk("");
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[540px] overflow-auto  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Risk
        </DialogTitle>
        <form
          onSubmit={handleSubmit(
            !edit
              ? selectedAssignee &&
                  selectedStatus &&
                  selectedThreatLevel &&
                  value &&
                  risk &&
                  action &&
                  onSubmitHandler
              : onSubmitHandler
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="">
              <InputField
                register={register}
                name="title"
                placeholder="Enter Risk Title"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Risk Title"
              />
              <p className="text-red-600 text-xs">
                {errors?.title?.message ?? error?.title}
              </p>
            </div>
            <div>
              <div className="flex justify-between gap-2">
                <div className="w-1/3">
                  <CustomSelect
                    options={threatlevelOptions}
                    label={""}
                    placeholder={
                      edit ? editData?.threatLevel : "Select Threat Level"
                    }
                    setSelectedField={setSelectedThreatLevel}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Threat Level"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.threatLevel?.message ?? error?.threatLevel}
                    {hasSubmittedClick &&
                      !edit &&
                      !selectedThreatLevel &&
                      "Required"}
                  </p>
                </div>
                <div className="w-1/3">
                  {/* <CustomSelect
                    options={roleOptions}
                    label={""}
                    placeholder={
                      edit
                        ? editData?.assignees?.[0]?.username
                        : "Select assignee"
                    }
                    setSelectedField={setSelectedAssignee}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Assignee"}
                    required={true}
                  /> */}
                  <MultiSelect
                    placeholder={
                      edit
                        ? editData?.assignees?.[0]?.username
                        : "Select assignee"
                    }
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Assignee"}
                    options={roleOptions}
                    selected={selectedAssignee}
                    setSelected={setSelectedAssignee}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.assignees?.message ?? error?.assignees}
                    {hasSubmittedClick &&
                      !edit &&
                      !selectedAssignee &&
                      "Required"}
                  </p>
                </div>
                <div className="w-1/3">
                  <CustomSelect
                    options={statusOptions}
                    label={""}
                    placeholder={edit ? editData?.status : "Select status"}
                    setSelectedField={setSelectedStatus}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Status"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.status?.message ?? error?.status}
                    {hasSubmittedClick &&
                      !edit &&
                      !selectedStatus &&
                      "Required"}
                  </p>
                </div>
              </div>
              <div className="flex  gap-2 mt-2">
                <div className="w-1/2">
                  <CustomSelect
                    options={impactOptions}
                    label={""}
                    placeholder={edit ? editData?.impact : "Select impact"}
                    setSelectedField={setSelectedImpact}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Impact"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.impact?.message ?? error?.impact}
                    {hasSubmittedClick &&
                      !edit &&
                      !selectedImpact &&
                      "Required"}
                  </p>
                </div>
                <div className="w-1/2">
                  <CustomSelect
                    options={impactOptions}
                    label={""}
                    placeholder={
                      edit ? editData?.likelihood : "Select likelihood"
                    }
                    setSelectedField={setSelectedLikelihood}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Likelihood"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.likelihood?.message ?? error?.likelihood}
                    {hasSubmittedClick &&
                      !edit &&
                      !selectedlLikelihood &&
                      "Required"}
                  </p>
                </div>
              </div>
              <p className="text-[#344054] leading-5 font-medium text-sm my-1">
                Risk <span className="text-red-600">*</span>{" "}
              </p>
              <ReactQuill
                theme="snow"
                className="h-[70px] mb-10 w-100"
                value={risk}
                onChange={setRisk}
              />
              <p className="text-red-600 text-xs mt-1">
                {hasSubmittedClick && !risk && "Required"}
              </p>
              <p className="text-[#344054] leading-5 font-medium text-sm my-1">
                Action <span className="text-red-600">*</span>{" "}
              </p>
              <ReactQuill
                theme="snow"
                className="h-[70px] mb-10 w-100"
                value={action}
                onChange={setAction}
              />
              <p className="text-red-600 text-xs mt-1">
                {hasSubmittedClick && !action && "Required"}
              </p>
              <p className="text-[#344054] leading-5 font-medium text-sm my-1">
                Description <span className="text-red-600">*</span>{" "}
              </p>
              <ReactQuill
                theme="snow"
                className="h-[70px] mb-10"
                value={value}
                onChange={setValue}
              />
              <p className="text-red-600 text-xs mt-1">
                {hasSubmittedClick && !value && "Required"}
              </p>
              <div className="w-1/2">
                <div className="">
                  <InputField
                    type="datetime-local"
                    register={register}
                    name="deadline"
                    className="w-full text-sm text-gray-500"
                    defaultValue=""
                    label="Deadline"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.deadline?.message ?? error?.deadline}
                  </p>
                </div>
              </div>
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
              buttonName={`${edit ? "Edit" : "Add"} Risk`}
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

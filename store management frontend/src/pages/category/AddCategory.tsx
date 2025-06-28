import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useCategoryMutation } from "../../hooks/useMutateData";
import { useLocation, useNavigate } from "react-router-dom";
import {
  capitalizeFirstLetter,
  smallLetter,
} from "../../utils/capitalizeFirstLetter";
import ChooseImage from "@/components/ChooseImage";
import InputField from "@/ui/InputField";
import KeywordSelect from "@/components/KeywordSelect";
import CustomSelect from "@/ui/CustomSelect";
import { CiImageOn } from "react-icons/ci";
import Button from "@/ui/Button";
import EmptyPage from "@/components/EmptyPage";

export default function AddCategory() {
  const location = useLocation();
  const editData = location.state;
  const edit = location.state;
  const [selectedImage, setSelectedImage] = useState();
  const [specification, setSpecification] = useState(
    edit ? editData?.specification : []
  );
  const [brands, setBrands] = useState(edit ? editData?.brands : []);

  const fieldSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {
      name: editData?.name,
    },
  });
  const formValue = watch();
  const navigate = useNavigate();
  const categoryMutation = useCategoryMutation();
  const [selectedBrand, setSelectedBrand] = useState();
  const [error, setError] = useState();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      file: selectedImage && selectedImage,
      specification: specification && specification,
      brands: brands && brands,
    };
    try {
      await categoryMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      toast.success(`Category ${edit ? "edited" : "added"} successfully`);
      navigate("/category");
      reset();
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data);
      toast(err?.response?.data?.msg);
    }
  };

  const brandOptions = brands?.map((item) => {
    return { label: item, value: item };
  });

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedImage();
    reset();
  };

  return (
    <div className="flex justify-between gap-3 items-start p-6">
      <form
        className="w-3/5 bg-white p-6 rounded-md h-[80vh] overflow-auto flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col gap-4">
          <InputField
            register={register}
            name="name"
            required
            placeholder="Enter Category Name"
            className="w-full text-sm text-gray-500"
            defaultValue=""
            error={errors?.name?.message ?? error?.name}
            label="Category Name"
          />
          <KeywordSelect
            title={"Enter the brand under this category"}
            id="brands "
            tags={brands}
            setTags={setBrands}
          />
          <KeywordSelect
            title={
              "Enter the field you want add as an specification in this category"
            }
            id="catagory_inputfield "
            tags={specification}
            setTags={setSpecification}
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="grid  grid-cols-2 w-1/2 border mt-10 gap-2 md:w-full">
            <Button
              buttonName={"Clear"}
              noFill
              danger
              className={"w-full"}
              handleButtonClick={(e) => {
                e.preventDefault();
                handleClear(e);
              }}
            />
            <Button
              className={"w-full "}
              handleButtonClick={() => {}}
              buttonName={`${edit ? "Edit" : "Add"} Category`}
            />
          </div>
        </div>
      </form>
      <div className="w-2/5 flex flex-col h-[80vh] overflow-auto bg-white py-4 px-4">
        <p className="text-[#344054] leading-5 font-semibold text-base  border-gray-600 underline">
          Category Form Preview
        </p>
        <div className="gap-2 w-full grid grid-cols-2 mt-2">
          <InputField
            disabled
            placeholder={
              formValue?.title ? formValue?.title : "Enter category name"
            }
            className="w-full text-sm bg-gray-200"
            label={"Category Name "}
          />
          <CustomSelect
            options={brandOptions}
            placeholder={"Select brand"}
            className={"w-full text-sm text-gray-500"}
            labelName={"Brands"}
            setSelectedField={setSelectedBrand}
          />
        </div>
        <p className="text-[#344054] leading-5 mt-2 mb-2 font-semibold text-base underline  w-24">
          Specifications
        </p>
        <div className="gap-2 w-full grid grid-cols-2 ">
          {specification?.map((item) => {
            return (
              <InputField
                disabled
                placeholder={`Enter ${smallLetter(item)} details`}
                className="w-full text-sm bg-gray-200"
                label={capitalizeFirstLetter(item)}
              />
            );
          })}
        </div>
        <div className="w-full">
          {specification?.length == 0 && (
            <div className="w-full flex justify-center mt-10">
              <EmptyPage message={"Specification not added"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

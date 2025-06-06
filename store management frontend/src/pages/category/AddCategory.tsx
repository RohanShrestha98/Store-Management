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

export default function AddCategory() {
  const location = useLocation();
  const editData = location.state;
  const edit = location.state;
  const [selectedImage, setSelectedImage] = useState();
  const [tags, setTags] = useState(edit ? editData?.tags : []);
  const [brands, setBrands] = useState(edit ? editData?.brands : []);

  const fieldSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
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

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      file: selectedImage && selectedImage,
      tags: tags,
      brands: brands,
    };
    console.log("postData", postData);
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
    <div className="flex justify-between gap-6 items-start p-6">
      <form
        className="w-3/5 bg-white p-6 rounded-md"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <InputField
              register={register}
              name="name"
              placeholder="Enter Category Name"
              className="w-full text-sm text-gray-500"
              defaultValue=""
              required
              error={errors?.title?.message}
              label="Category Name"
            />
            <ChooseImage
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              defaultUrl={editData?.thumbnail?.url}
            />
          </div>
          <KeywordSelect
            title={"Enter the brand under this category"}
            id="brands "
            tags={brands}
            setTags={setBrands}
          />
          <KeywordSelect
            title={
              "Enter the field you want add as an feature in this category"
            }
            id="catagory_inputfield "
            tags={tags}
            setTags={setTags}
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
      <div className="w-2/5 flex flex-col items-center gap-2 h-[70vh] overflow-auto bg-white py-4 px-4">
        <p className="font-medium">Preview Category Form</p>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-full  bg-gray-200 border-2 border-gray-200">
            {selectedImage && URL.createObjectURL(selectedImage) ? (
              <img
                className="h-14 w-14 rounded-full object-cover"
                src={selectedImage && URL.createObjectURL(selectedImage)}
                alt=""
              />
            ) : (
              <CiImageOn size={50} className="text-gray-500 p-2" />
            )}
          </div>
        </div>
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
          {tags?.map((item) => {
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
      </div>
    </div>
  );
}

import { useProductMutation } from "@/hooks/useMutateData";
import {
  useCategoryDetailsData,
  useCategoryNameData,
  useStoreData,
  useVendorData,
} from "@/hooks/useQueryData";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import InputField from "@/ui/InputField";
import {
  capitalizeFirstLetter,
  smallLetter,
} from "@/utils/capitalizeFirstLetter";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PiCalendarBlank } from "react-icons/pi";
import ReactQuill from "react-quill";
import MultiSelectImage from "@/components/MultiSelectImage";
import { defaultSelect } from "@/utils/defaultSelect";

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const edit = location.state;
  const [files, setFiles] = useState();
  const [selectedVendor, setSelectedVendor] = useState();
  const [description, setDesccription] = useState(edit?.description);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [error, setError] = useState();
  const {
    data: vendorData,
    isLoading: vendorIsLoading,
    isError: vendorIsError,
  } = useVendorData();
  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useCategoryNameData();

  const {
    data: categoryDetsilsData,
    isLoading: categoryDetailsIsLoading,
    isError: categoryDetailsIsError,
  } = useCategoryDetailsData(selectedCategory);

  const {
    data: storeData,
    isLoading: storeIsLoading,
    isError: storeIsError,
  } = useStoreData();

  const fieldSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    costPrice: Yup.string().required("Required"),
    sellingPrice: Yup.string().required("Required"),
    tax: Yup.string(),
    quantity: Yup.string().required("Required"),
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
      name: edit?.name,
      costPrice: edit?.costPrice,
      sellingPrice: edit?.sellingPrice,
      tax: edit?.tax,
      quantity: edit?.quantity,
    },
  });
  const productMutation = useProductMutation();

  const onSubmitHandler = async (data) => {
    const specification = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith("_specification")) {
        const specKey = key.replace("_specification", "");
        specification[specKey] = value;
      }
    }
    const formData = new FormData();
    formData.append("barCode", "1234");
    formData.append("description", description);
    formData.append("vendor", selectedVendor);
    formData.append("storeNumber", selectedStore);
    formData.append("specification", JSON.stringify(specification));
    formData.append("categoryId", selectedCategory);
    Object.entries(data).forEach(([key, value]) => {
      if (!key.endsWith("_specification")) {
        formData.append(key, value);
      }
    });
    files && files.forEach((file) => formData.append("images", file));

    try {
      await productMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${edit?.id}` : "create/",
        formData,
      ]);
      toast.success(`Product ${edit ? "edited" : "added"} successfully`);
      navigate("/product");
      reset();
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.error);
    }
  };

  console.log("edit", edit);

  const handleClear = (e) => {
    e.preventDefault();
    setFiles();
    reset();
  };
  const productNameFields = [
    {
      registerName: "name",
      placeHolder: "Enter product name",
      className: "",
      defaultValue: "",
      error: errors?.name?.message ?? error?.name,
      label: "Product Name",
    },
  ];

  const productPricesFields = [
    {
      registerName: "quantity",
      placeHolder: "Enter quantity",
      className: "",
      defaultValue: "",
      error: errors?.quantity?.message ?? error?.quantity,
      label: "Quantity",
      type: "number",
    },
    {
      registerName: "costPrice",
      placeHolder: "Enter cost price",
      className: "",
      defaultValue: "",
      error: errors?.costPrice?.message ?? error?.costPrice,
      label: "Cost price",
      type: "number",
    },
    {
      registerName: "sellingPrice",
      placeHolder: "Enter selling price",
      className: "",
      defaultValue: "",
      error: errors?.sellingPrice?.message ?? error?.sellingPrice,
      label: "Selling price",
      type: "number",
    },
    {
      registerName: "tax",
      placeHolder: "Enter tax (%)",
      className: "",
      defaultValue: "",
      error: errors?.tax?.message ?? error?.tax,
      label: "Tax (%)",
      type: "number",
    },
  ];

  const productSelectFields = [
    {
      placeHolder: "Select vendor",
      options: convertToSelectOptions(vendorData?.data, true),
      className: "",
      defaultValue: defaultSelect(vendorData?.data, edit?.vendor, true),
      setSelectedField: setSelectedVendor,
      error: errors?.vendor?.message ?? error?.vendor,
      label: "Vendor",
    },
    {
      placeHolder: "Select store",
      options: convertToSelectOptions(storeData?.data),
      className: "",
      defaultValue: defaultSelect(storeData?.data, edit?.storeNumber),
      setSelectedField: setSelectedStore,
      error: error?.store,
      label: "Store",
    },
    {
      placeHolder: "Select category",
      options: convertToSelectOptions(categoryData?.data),
      className: "",
      defaultValue: defaultSelect(categoryData?.data, edit?.categoryId),
      setSelectedField: setSelectedCategory,
      error: error?.category,
      label: "Category",
    },
  ];

  if (
    vendorIsError ||
    storeIsError ||
    categoryIsError ||
    categoryDetailsIsError
  ) {
    return <p>Error</p>;
  }
  return (
    <div className="flex justify-between gap-6 items-start p-6">
      <form
        className="w-2/3 no-scrollbar bg-white p-6 rounded-md h-[82vh] overflow-auto flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col gap-2 w-full shadow-[inset_0_-6px_6px_-3px_rgba(0,0,0,0.2)] overflow-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-1">
            {edit ? (
              <div>
                <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
                  Images
                </p>
                <div className="flex items-center gap-2 ">
                  {edit?.images?.map((item) => {
                    return (
                      <img
                        className="w-12 h-12 border border-gray-200 rounded-lg p-[2px]"
                        src={item}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <MultiSelectImage setFiles={setFiles} files={files} />
            )}

            {productNameFields?.map((item) => {
              return (
                <InputField
                  register={register}
                  name={item?.registerName}
                  placeholder={item?.placeHolder}
                  className={`w-full text-sm text-gray-500 min-h-12 ${item?.className}`}
                  defaultValue={item?.defaultValue}
                  error={item?.error}
                  label={item?.label}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-4 md:grid-cols-2 gap-x-2">
            {productPricesFields?.map((item) => {
              return (
                <InputField
                  register={register}
                  name={item?.registerName}
                  placeholder={item?.placeHolder}
                  className={`w-full text-sm text-gray-500 ${item?.className}`}
                  defaultValue={item?.defaultValue}
                  error={item?.error}
                  label={item?.label}
                  type={item?.type}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-2 gap-x-2">
            {productSelectFields?.map((item, id) => {
              console.log("item", item);
              return (
                <div>
                  <CustomSelect
                    id={id}
                    defaultValue={item?.defaultValue}
                    options={item?.options}
                    placeholder={item?.placeHolder}
                    className={`w-full text-sm text-gray-500 ${item?.className}`}
                    labelName={item?.label}
                    setSelectedField={
                      item?.setSelectedField ?? item?.defaultValue
                    }
                  />
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              );
            })}
          </div>
          <p className="text-[#344054] leading-5 font-medium text-sm border-b-[3px] border-[#C9BCF7] w-[100px]">
            Specifications
          </p>
          <div
            className={`${
              !categoryDetsilsData?.data &&
              "border border-dashed border-gray-400 h-full min-h-[140px]"
            } `}
          >
            {categoryDetsilsData?.data ? (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {categoryDetsilsData?.data?.[0]?.specification?.map((item) => {
                  return (
                    <InputField
                      register={register}
                      name={`${smallLetter(item)}_specification`}
                      placeholder={`Enter ${item} details`}
                      className={`w-full text-sm text-gray-500 ${item?.className}`}
                      defaultValue={item?.defaultValue}
                      error={item?.error}
                      label={capitalizeFirstLetter(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full w-full  text-center gap-1 text-xs font-medium text-gray-500 flex flex-col items-center justify-center">
                <PiCalendarBlank className="border p-[6px] rounded-full bg-gray-100 w-[36px] h-[36px]" />
                Choose category to get <br />
                specification fields
              </div>
            )}
          </div>
          <p className="text-[#344054] leading-5 font-medium text-sm ">
            Description
          </p>
          <ReactQuill
            className="h-[110px] w-full "
            value={description}
            onChange={setDesccription}
          />
        </div>
        <div className="flex items-center justify-end">
          <div className="grid  grid-cols-2 w-1/2 border mt-6 gap-2 md:w-full">
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
              buttonName={`${edit ? "Edit" : "Add"} Product`}
            />
          </div>
        </div>
      </form>
      <div className="w-1/3 bg-white p-6 rounded-md h-[82vh] overflow-auto flex flex-col justify-between"></div>
    </div>
  );
}

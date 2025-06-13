import ChooseImage from "@/components/ChooseImage";
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
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;
  const edit = location.state;
  const [selectedImage, setSelectedImage] = useState();
  const [selectedVendor, setSelectedVendor] = useState();
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

  console.log("categoryDetsilsData", categoryDetsilsData);

  const fieldSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    costPrice: Yup.string().required("Required"),
    sellingPrice: Yup.string().required("Required"),
    discountPercentage: Yup.string(),
    quantity: Yup.string().required("Required"),
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
      costPrice: editData?.costPrice,
      sellingPrice: editData?.sellingPrice,
      discountPercentage: editData?.discountPercentage,
      quantity: editData?.quantity,
    },
  });
  const formValue = watch();
  const productMutation = useProductMutation();
  const [selectedBrand, setSelectedBrand] = useState();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      barCode: "1234",
      images: selectedImage && selectedImage,
    };
    console.log("postData", postData);
    try {
      await productMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      toast.success(`Category ${edit ? "edited" : "added"} successfully`);
      navigate("/category");
      reset();
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.error);
    }
  };

  const brandOptions = []?.map((item) => {
    return { label: item, value: item };
  });

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedImage();
    reset();
  };
  // const okey = [
  //   vendor,
  //   categoryId,
  //   storeNumber,
  //   specification,
  //   images,
  // ];
  const productNameFields = [
    {
      registerName: "name",
      placeHolder: "Enter product name",
      className: "",
      defaultValue: "",
      error: errors?.name?.message ?? error?.name,
      label: "Product Name",
    },
    {
      registerName: "description",
      placeHolder: "Enter product description",
      className: "",
      defaultValue: "",
      error: "",
      label: "Description",
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
      registerName: "discountPercentage",
      placeHolder: "Enter discount (%)",
      className: "",
      defaultValue: "",
      error: errors?.discountPercentage?.message ?? error?.discountPercentage,
      label: "Discount (%)",
      type: "number",
    },
  ];

  const productSelectFields = [
    {
      placeHolder: "Select vendor",
      options: convertToSelectOptions(vendorData?.data),
      className: "",
      defaultValue: "",
      setSelectedField: setSelectedVendor,
      error: errors?.vendor?.message ?? error?.vendor,
      label: "Vendor",
    },
    {
      placeHolder: "Select store",
      options: convertToSelectOptions(storeData?.data),
      className: "",
      defaultValue: "",
      setSelectedField: setSelectedStore,
      error: error?.store,
      label: "Store",
    },
    {
      placeHolder: "Select category",
      options: convertToSelectOptions(categoryData?.data),
      className: "",
      defaultValue: "",
      setSelectedField: setSelectedCategory,
      error: error?.category,
      label: "Category",
    },
  ];
  console.log("selected", selectedCategory);

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
        className="w-2/3 bg-white p-6 rounded-md h-[82vh] overflow-auto flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-1">
            {productNameFields?.map((item) => {
              return (
                <InputField
                  register={register}
                  name={item?.registerName}
                  placeholder={item?.placeHolder}
                  className={`w-full text-sm text-gray-500 ${item?.className}`}
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
              return (
                <div>
                  <CustomSelect
                    id={id}
                    options={item?.options}
                    placeholder={item?.placeHolder}
                    className={`w-full text-sm text-gray-500 ${item?.className}`}
                    labelName={item?.label}
                    setSelectedField={item?.setSelectedField}
                  />
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              );
            })}
          </div>
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
      <div className="w-1/3 bg-white p-6 rounded-md h-[82vh] overflow-auto flex flex-col justify-between"></div>
    </div>
  );
}

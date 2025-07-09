import Loading from "@/assets/AllSvg";
import {
  useAddProductByBarcodeData,
  useCategoryData,
  useProductForUserData,
  useStoreData,
} from "@/hooks/useQueryData";
import Button from "@/ui/Button";
import truncateText from "@/utils/truncateText";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";
import { useCheckoutProductStore } from "@/store/useCheckoutProductStore";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import BarcodeScanner from "@/components/BarcodeScanner";
import { useSalesMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import CheckoutModal from "./CheckoutModal";
import { useAuthStore } from "@/store/useAuthStore";
import EmptyPage from "@/components/EmptyPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomSelect from "@/ui/CustomSelect";
import Pagination from "@/components/Pagination";
import InputField from "@/ui/InputField";

export default function UserProduct() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? "1");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? ""
  );
  const [selectedStore, setSelectedStore] = useState(
    searchParams.get("store") ?? user?.data?.storeId ?? ""
  );
  const { data, isLoading, isError } = useProductForUserData(
    selectedStore,
    10,
    false,
    true,
    debouncedSearchText,
    pageSize,
    page,
    selectedCategory
  );
  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useCategoryData();

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [scannedBarCode, setScannedBarCode] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { checkoutProduct, setCheckoutProduct } = useCheckoutProductStore();
  const [debouncedBarCode, setDebouncedBarCode] = useState("");
  const [scannedBarCodeData, setScannedBarCodeData] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBarCode(scannedBarCode);
      setScannedBarCode("");
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [scannedBarCode]);

  const {
    data: productDetsilsData,
    isLoading: productDetailsIsLoading,
    isError: productDetailsIsError,
  } = useAddProductByBarcodeData(debouncedBarCode);

  const {
    data: storeData,
    isLoading: storeIsLoading,
    isError: storeIsError,
  } = useStoreData();

  useEffect(() => {
    const product = productDetsilsData?.data?.[0];

    if (product) {
      setScannedBarCodeData((prev) => [product, ...prev]);

      setSelectedProduct((prev) => {
        const updated = [product, ...prev];
        setCheckoutProduct(updated);
        setOpen(true);
        return updated;
      });
    }
  }, [productDetsilsData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (productDetsilsData?.data?.length == 0)
        return toast.error("Product not added in the store");
    }, 500);

    return () => clearInterval(interval);
  }, [productDetsilsData]);

  const categoryOptions = categoryData?.data?.map((item) => {
    return { value: item?.id, label: item?.name };
  });

  const storeOptions = storeData?.data?.map((item) => {
    return { value: item?.id, label: item?.name };
  });

  const handleProductClick = (item) => {
    const updated = [item, ...selectedProduct];
    setSelectedProduct(updated);
    setCheckoutProduct(updated);
  };

  const handleRemoveProduct = (index) => {
    const updated = selectedProduct.filter((_, i) => i !== index);
    setSelectedProduct(updated);
    setCheckoutProduct(updated);
  };

  const totalPrice = selectedProduct.reduce(
    (sum, item) => parseInt(sum) + (parseInt(item.sellingPrice) || 0),
    0
  );

  useEffect(() => {
    setSelectedProduct([]);
    setCheckoutProduct([]);
  }, []);

  const salesMutation = useSalesMutation();

  const onSubmitHandler = async () => {
    const postData = {
      sales: checkoutProduct,
      quantity: checkoutProduct?.length,
      storeId: selectedStore,
      subTotal: totalPrice,
      total: totalPrice,
      salesTax: 8,
    };
    try {
      await salesMutation.mutateAsync([`post`, "/create", postData]);
      setOpenCheckOutModal(false);
      setError();
      toast.success(`Sales completed`);
      setCheckoutProduct([]);
      setSelectedProduct([]);
      setScannedBarCodeData([]);
      setLoading(false);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      setOpenCheckOutModal(false);
      toast.error(err?.response?.data?.message);
      setError(err?.response?.data?.message);
    }
  };

  const delayedSubmitHandler = () => {
    setOpenCheckOutModal(true);
    setLoading(true);
    setTimeout(() => {
      onSubmitHandler();
    }, 3000);
  };

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
      category: selectedCategory,
      store: selectedStore,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText, selectedCategory, selectedStore]);

  return (
    <div>
      <div className="flex items-center gap-2 pt-4 px-4 relative">
        <MdOutlineQrCodeScanner
          onClick={() => setOpen(true)}
          className="absolute cursor-pointer bg-white text-2xl border p-1 w-8 h-8 top-0 right-0"
        />
        <InputField
          placeholder={"Search product ..."}
          className={"w-[220px] border text-gray-500 border-gray-300"}
          setSearchText={setSearchText}
        />
        {user?.data?.role === "Admin" && (
          <CustomSelect
            options={storeOptions}
            placeholder={"Select store"}
            className={`w-[160px] text-xs text-gray-500 border-gray-300 focus-visible:border-gray-700`}
            setSelectedField={setSelectedStore}
          />
        )}
        <CustomSelect
          options={categoryOptions}
          placeholder={"Select Category"}
          className={`w-[160px] text-xs text-gray-500 border-gray-300 focus-visible:border-gray-700`}
          setSelectedField={setSelectedCategory}
        />
        {(searchText || selectedCategory) && (
          <div
            onClick={() => {
              setSearchText("");
              setSelectedCategory("");
              setPage("1");
              setPageSize("10");
              setSearchParams({});
            }}
            className="flex border h-[30px] gap-1 border-red-600  bg-red-600 text-white cursor-pointer items-center font-semibold px-2 text-xs"
          >
            <RxCross2 size={14} />
            <p>Clear</p>
          </div>
        )}

        {/* <Pagination
          setPageSize={setPageSize}
          totalPage={data?.pagenation?.totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
        /> */}
      </div>
      <div className="px-4 pt-2 pb-4 flex gap-2 relative">
        <BarcodeScanner
          asChild
          open={open}
          setOpen={setOpen}
          setScannedBarCode={setScannedBarCode}
        />
        {/* Product List */}
        <div className="w-2/3 border h-[76vh] overflow-auto border-b-4 no-scrollbar bg-white p-4">
          <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3">
            {data?.data?.map((item) => {
              if (item?.quantity !== 0)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item)}
                    className="p-2 border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-center border-gray-300 text-sm relative"
                  >
                    <img
                      className="h-28 object-cover"
                      src={
                        item?.images?.[0] ??
                        "http://localhost:3001/uploads/laptop3.jpg"
                      }
                      alt=""
                    />
                    {item?.offer >= 4 && (
                      <p className="absolute top-[10px] right-0 font-semibold px-2 text-xs bg-red-600 text-white">
                        {item?.offer} % OFF
                      </p>
                    )}
                    <p className="font-semibold w-full line-clamp-2 text-gray-600">
                      {truncateText(item?.name, 40)}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-yellow-600 text-base">
                        ${item?.sellingPrice}
                      </p>
                      <p className="text-green-500 text-[13px] line-clamp-1 top-[100px] left-0 px-2 font-semibold">
                        {item?.quantity} in stock
                      </p>
                    </div>
                  </div>
                );
            })}
          </div>
          {isLoading && (
            <div className="pt-40">
              <Loading />
            </div>
          )}
          {isError && <p className="flex items-center justify-center">Error</p>}
          {data?.data?.length == 0 && (
            <div className="w-full flex justify-center  pt-16 pb-20">
              <EmptyPage message={"Oops! No product in this store"} />
            </div>
          )}
        </div>

        {/* Checkout Panel */}
        <div className="w-1/3 border px-3 py-2 h-[76vh] bg-white ">
          <p className="font-semibold text-gray-600">Selected Product</p>
          <div className="flex flex-col gap-3 bg-white justify-between h-[69vh] no-scrollbar">
            {selectedProduct?.length ? (
              <div className="flex flex-col gap-2 h-full border-b-4 overflow-auto no-scrollbar">
                {selectedProduct?.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 hover:drop-shadow-lg bg-white relative grid grid-cols-3 cursor-pointer items-center gap-1 px-3"
                  >
                    <img
                      className="h-10 w-[90%] object-cover"
                      src={
                        item?.images?.[0] ??
                        "http://localhost:3001/uploads/laptop3.jpg"
                      }
                      alt=""
                    />
                    <RxCross2
                      onClick={() => handleRemoveProduct(index)}
                      className="absolute top-0 right-0 bg-gray-300 p-[4px] cursor-pointer font-bold text-xl hover:bg-red-600 hover:text-white"
                    />
                    <div className="absolute top-0 left-0 px-2 py-[2px] cursor-pointer font-bold text-xs bg-gray-500 text-white">
                      {index + 1}
                    </div>
                    <div className="col-span-2 py-2">
                      <p className="font-medium w-full line-clamp-1 text-sm text-gray-600">
                        {truncateText(item?.name, 20)}
                      </p>
                      <p className="font-semibold w-full text-yellow-600 text-base">
                        ${item?.sellingPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center font-semibold text-sm text-gray-500">
                <div className="flex flex-col gap-1 items-center">
                  <IoCalendarClearOutline size={20} />
                  No item selected
                </div>
              </div>
            )}
            <CheckoutModal
              asChild
              loading={loading}
              open={openCheckOutModal}
              setOpen={setOpenCheckOutModal}
            >
              <Button
                buttonName={`CheckOut ($${totalPrice})`}
                className="w-full"
                disabled={totalPrice == "0"}
                handleButtonClick={() => delayedSubmitHandler()}
              />
            </CheckoutModal>
          </div>
        </div>
      </div>
    </div>
  );
}

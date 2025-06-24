import Loading from "@/assets/AllSvg";
import {
  useProductDataByBarcode,
  useProductForUserData,
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

export default function UserProduct() {
  const { data, isLoading } = useProductForUserData("", 10, 1);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [open, setOpen] = useState(true);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [scannedBarCode, setScannedBarCode] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const { checkoutProduct, setCheckoutProduct } = useCheckoutProductStore();

  const [debouncedBarCode, setDebouncedBarCode] = useState("");

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
  } = useProductDataByBarcode(debouncedBarCode);

  const [scannedBarCodeData, setScannedBarCodeData] = useState([]);

  useEffect(() => {
    const product = productDetsilsData?.data?.[0];
    if (product) {
      setScannedBarCodeData((prev) => [product, ...prev]);

      setSelectedProduct((prev) => {
        const updated = [product, ...prev];
        setCheckoutProduct(updated);
        return updated;
      });
    }
    setOpen(true);
  }, [productDetsilsData]);

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

  console.log("che", checkoutProduct);

  const onSubmitHandler = async () => {
    const postData = {
      sales: checkoutProduct,
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
      setError(err?.response?.data?.errors);
      setLoading(false);
    }
  };

  const delayedSubmitHandler = () => {
    setOpenCheckOutModal(true);
    setLoading(true);
    setTimeout(() => {
      onSubmitHandler();
    }, 3000);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 flex gap-4 relative">
      <MdOutlineQrCodeScanner
        onClick={() => setOpen(true)}
        className="absolute cursor-pointer bg-white text-2xl border p-1 w-8 h-8 top-0 right-0"
      />
      <BarcodeScanner
        asChild
        open={open}
        setOpen={setOpen}
        setScannedBarCode={setScannedBarCode}
      />
      {/* Product List */}
      <div className="w-2/3 border h-[84vh] overflow-auto border-b-4 no-scrollbar bg-white p-4 rounded-[8px]">
        <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.data?.map((item) => {
            if (item?.quantity !== 0)
              return (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="px-2 py-1 border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-center border-gray-300 rounded-[6px] text-sm relative"
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
      </div>

      {/* Checkout Panel */}
      <div className="w-1/3 border px-3 py-2 h-[84vh] bg-white rounded-[8px]">
        <p className="font-semibold text-gray-600">Selected Product</p>
        <div className="flex flex-col gap-3 bg-white justify-between h-[77vh] no-scrollbar">
          {selectedProduct?.length ? (
            <div className="flex flex-col gap-2 h-full border-b-4 overflow-auto no-scrollbar">
              {selectedProduct?.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 hover:drop-shadow-lg bg-white rounded-[8px] relative grid grid-cols-3 cursor-pointer items-center gap-1 px-3"
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
                    className="absolute top-0 right-0 bg-gray-300 p-[4px] cursor-pointer font-bold rounded-tr-[8px] rounded-bl-[8px] text-xl hover:bg-red-600 hover:text-white"
                  />
                  <div className="absolute top-0 left-0 px-2 py-[2px] cursor-pointer font-bold rounded-br-[8px] rounded-tl-[8px] text-xs bg-gray-500 text-white">
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
              handleButtonClick={() => delayedSubmitHandler()}
            />
          </CheckoutModal>
        </div>
      </div>
    </div>
  );
}

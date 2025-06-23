import Loading from "@/assets/AllSvg";
import { useProductForUserData } from "@/hooks/useQueryData";
import Button from "@/ui/Button";
import truncateText from "@/utils/truncateText";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoCalendarClearOutline } from "react-icons/io5";

export default function UserProduct() {
  const { data, isLoading, isError } = useProductForUserData("", 10, 1, "3340");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [open, setOpen] = useState(false);

  const handleProductClick = (data) => {
    setSelectedProduct((prev) => [data, ...prev]);
  };
  console.log("selectedProduct", selectedProduct);
  const handleRemoveProduct = (id) => {
    setSelectedProduct((prev) => prev.filter((item, index) => index !== id));
  };

  const totalPrice = selectedProduct?.reduce(
    (sum, item) => parseInt(sum) + (parseInt(item.sellingPrice) || 0),
    0
  );

  // const handleProductAlreadyClick = (item) => {
  //   setSelectedProduct((prev) => {
  //     const alreadySelected = prev.find((p) => p.id === item.id);
  //     if (alreadySelected) return prev;
  //     return [...prev, item];
  //   });
  // };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="p-4 flex gap-4 ">
      <div className="w-2/3 border h-[84vh] overflow-auto bg-white p-4 rounded-[8px]">
        <div className="grid grid-cols-4 gap-3">
          {data?.data?.map((item) => {
            return (
              <div
                onClick={() => handleProductClick(item)}
                className=" p-2 border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-center items-center border-gray-300 rounded-[6px] text-sm relative"
              >
                <img
                  className="h-28  object-contain "
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

                <p className="bg-green-500 text-[10px] absolute top-[100px] left-0 px-2 font-semibold text-white ">
                  {item?.quantity} in stock{" "}
                </p>
                <p className="font-semibold w-full line-clamp-2 text-gray-600">
                  {truncateText(item?.name, 40)}
                </p>

                <p className="font-semibold w-full text-yellow-600 text-base">
                  ${item?.sellingPrice}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-1/3 border px-3 py-2 h-[84vh]  bg-white rounded-[8px]">
        <p className="font-semibold text-gray-600">Selected Product</p>
        <div className="flex flex-col gap-3 bg-white justify-between h-[77vh]">
          {selectedProduct?.length ? (
            <div className="flex flex-col gap-2 h-full border-b-4 overflow-auto">
              {selectedProduct?.map((selectedItem, index) => {
                return (
                  <div className="border hover:drop-shadow-lg bg-white  rounded-[8px] relative grid grid-cols-3 cursor-pointer items-center gap-1 px-3 py-1">
                    <img
                      className="h-10 "
                      src={
                        selectedItem?.images?.[0] ??
                        "http://localhost:3001/uploads/laptop3.jpg"
                      }
                      alt=""
                    />
                    <RxCross2
                      onClick={() => {
                        handleRemoveProduct(index);
                      }}
                      className="absolute top-0 right-0 bg-gray-300 p-[4px] cursor-pointer font-bold  rounded-tr-[8px] rounded-bl-[8px] text-2xl hover:bg-red-600 hover:text-white"
                    />
                    <div className="absolute top-0 left-0  p-[4px] cursor-pointer font-bold  rounded-br-[8px] rounded-tl-[8px] w-4 text-xs bg-green-600 text-white" >
                      {index +1}
                    </div>
                    <div className="col-span-2 py-2 ">
                      <p className="font-medium w-full line-clamp-1 text-sm text-gray-600">
                        {truncateText(selectedItem?.name, 20)}
                      </p>

                      <p className="font-semibold w-full text-yellow-600 text-base">
                        ${selectedItem?.sellingPrice}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center font-semibold text-sm text-gray-500">
              <div className="flex flex-col gap-1 items-center">
                <IoCalendarClearOutline size={20} />
                No item selected
              </div>
            </div>
          )}

          <Button
            buttonName={`CheckOut ($${totalPrice})`}
            className={"w-full "}
            handleButtonClick={() => setOpen(false)}
            icon={""}
          />
        </div>
      </div>
    </div>
  );
}

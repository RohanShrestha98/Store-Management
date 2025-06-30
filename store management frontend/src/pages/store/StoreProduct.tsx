import { useEffect, useState } from "react";
import { useProductForUserData } from "@/hooks/useQueryData";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import truncateText from "@/utils/truncateText";
import Loading from "@/assets/AllSvg";
import EmptyPage from "@/components/EmptyPage";
import { FaPlus } from "react-icons/fa";
import Button from "@/ui/Button";

export default function StoreProduct() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [stock, setStock] = useState(true);
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  console.log("id", id);
  const { data, isLoading, isError } = useProductForUserData(
    id,
    20,
    false,
    stock,
    searchText,
    pageSize,
    page
  );

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => setStock(true)}
            className={`border px-4 py-1 text-sm font-semibold hover:opacity-75 cursor-pointer ${
              stock ? "bg-black text-white" : "text-black bg-gray-200"
            }`}
          >
            In Stock
          </div>
          <div
            onClick={() => setStock(false)}
            className={`border px-4 py-1  text-sm font-semibold hover:opacity-75 cursor-pointer ${
              stock ? "text-black bg-white" : "bg-black text-gray-200"
            }`}
          >
            Out of Stock
          </div>
        </div>
        <Button
          buttonName={"Add Product"}
          icon={<FaPlus />}
          handleButtonClick={() => navigate("/add-product")}
        />
      </div>
      <div className=" p-4 min-h-[76vh] bg-white border ">
        <div className="grid grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.data?.map((item) => {
            return (
              <div
                key={item.id}
                // onClick={() => handleProductClick(item)}
                className="p-2  border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-between border-gray-300 text-sm relative"
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
                <div className="flex justify-between items-end">
                  <p className="font-semibold text-yellow-600 text-base">
                    ${item?.sellingPrice}
                  </p>
                  <div className="flex flex-col ">
                    <p className="text-green-500 mb-[-6px]  text-[13px] line-clamp-1  px-2 font-semibold">
                      {item?.quantity} in stock
                    </p>
                    <p className="text-red-600 text-end text-[13px] line-clamp-1  px-2 font-semibold">
                      {item?.sold} sold
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isLoading && <Loading />}
        {isError && <p className="flex items-center justify-center">Error</p>}
        {data?.data?.length == 0 && (
          <div className="w-full flex justify-center  pt-16 pb-20">
            <EmptyPage message={"Oops! No product in this store"} />
          </div>
        )}
      </div>
    </div>
  );
}

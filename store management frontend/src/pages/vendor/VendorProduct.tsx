import { useEffect, useState } from "react";
import { useProductData } from "@/hooks/useQueryData";
import { useParams, useSearchParams } from "react-router-dom";
import truncateText from "@/utils/truncateText";
import Loading from "@/assets/AllSvg";
import EmptyPage from "@/components/EmptyPage";
import moment from "moment";

export default function VendorProduct() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useProductData(
    id,
    debouncedSearchText,
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
    <div className="p-4 flex flex-col gap-4">
      <div className=" p-4 h-[84vh] overflow-auto  bg-white border ">
        <div className="grid grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.data?.map((item) => {
            const vendorDetailOptions = [
              {
                label: "CP",
                value: "$" + item?.costPrice,
                className: "text-red-600",
              },
              {
                label: "SP",
                value: "$" + item?.sellingPrice,
                className: "text-green-600",
              },
              {
                label: "Qty",
                value: item?.quantity,
              },
            ];
            return (
              <div
                key={item.id}
                // onClick={() => handleProductClick(item)}
                className="px-2 py-2 border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-between border-gray-300 text-sm relative"
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
                <p className="font-semibold absolute text-xs top-0 right-0 bg-[#e2dbf9] px-2 text-gray-600">
                  {moment(item?.createdAt).format("ddd, MM/DD, YY hh:mm A")}
                </p>
                <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-gray-600">
                  {vendorDetailOptions?.map((option) => {
                    return (
                      <div
                        className={`cursor-pointer border flex flex-col gap-[2px] py-2  items-center justify-center border-gray-300 bg-[#f0edfa] hover:bg-[#e2dbf9] hover:border-gray-400 `}
                      >
                        <p className="font-bold">{option?.label}</p>
                        <p className={option?.className}>{option?.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {isLoading && <Loading />}
        {isError && <p className="flex items-center justify-center">Error</p>}
        {data?.data?.length == 0 && (
          <div className="w-full flex justify-center  pt-16 pb-20">
            <EmptyPage message={"Oops! No product to show"} />
          </div>
        )}
      </div>
    </div>
  );
}

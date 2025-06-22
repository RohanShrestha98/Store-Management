import Loading from "@/assets/AllSvg";
import { useProductData, useProductForUserData } from "@/hooks/useQueryData";
import truncateText from "@/utils/truncateText";

export default function UserProduct() {
  const { data, isLoading, isError } = useProductForUserData("", 10, 1, "3340");
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-3">
        {data?.data?.map((item) => {
          return (
            <div className=" px-4 pb-3 pt-2 border cursor-pointer hover:drop-shadow-lg bg-white flex flex-col gap-[2px] justify-center items-center border-gray-300 rounded-[6px] text-sm relative">
              <img
                className="h-32  object-contain "
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

              <p className="bg-green-500 text-[12px] absolute top-[114px] left-0 px-2 font-semibold text-white">
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
  );
}

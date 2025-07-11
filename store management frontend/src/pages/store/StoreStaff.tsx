import { useEffect, useState } from "react";
import profile from "../../assets/profile.svg";
import { useUserData } from "@/hooks/useQueryData";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import truncateText from "@/utils/truncateText";
import Loading from "@/assets/AllSvg";
import EmptyPage from "@/components/EmptyPage";
import { FaPlus } from "react-icons/fa";
import Button from "@/ui/Button";

export default function StoreStaff() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useUserData(
    id,
    searchText,
    pageSize,
    page
  );

  const [selectedStaff, setSelectedStaff] = useState();

  useEffect(() => {
    if (data?.data?.length) {
      setSelectedStaff(data.data[0]);
    }
  }, [data]);

  const profileData = [
    {
      label: "Phone number",
      value: "+1 " + selectedStaff?.phoneNumber,
    },
    {
      label: "Address",
      value: truncateText(selectedStaff?.address, 25),
    },
    {
      label: "Work at store",
      value: selectedStaff?.storeNumber,
    },
    {
      label: "Pay per hour ($)",
      value: selectedStaff?.payPerHour,
    },
    {
      label: "Shift Time",
      value: `${selectedStaff?.shift?.[0]?.start ?? "None"} - ${
        data?.shift?.[0]?.end ?? "None"
      }`,
    },

    {
      label: "Verified",
      value: selectedStaff?.isVerified ? "Yes" : "No",
    },
  ];

  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      <div className="flex justify-end items-center">
        <Button
          buttonName={"Add Product"}
          icon={<FaPlus />}
          handleButtonClick={() => navigate("/add-product")}
        />
      </div>
      {data?.data?.length && (
        <div className="min-h-[76vh] flex gap-2">
          <div className=" p-4 h-full min-h-[76vh] w-2/3 bg-white border ">
            <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3">
              {data?.data?.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedStaff(item)}
                    className={`p-2 py-4  border cursor-pointer drop-shadow hover:drop-shadow-lg  flex flex-col gap-[2px] justify-center text-gray-600 items-center border-gray-300 text-sm relative ${
                      item?.id === selectedStaff?.id
                        ? "bg-blue-100"
                        : "bg-white "
                    }`}
                  >
                    <div className="w-full justify-center flex items-center ">
                      <img
                        className="h-28 w-28 object-cover"
                        src={profile}
                        alt=""
                      />
                    </div>
                    <p className="absolute top-[10px] right-0 font-semibold px-2 text-xs bg-green-600 text-white">
                      {item?.role}
                    </p>
                    <p className="font-semibold w-full flex gap-1 justify-center line-clamp-2 ">
                      {truncateText(item?.firstName, 30)}
                      {truncateText(item?.lastName, 30)}
                    </p>
                    <p className="font-normal text-xs text-center line-clamp-2 ">
                      {truncateText(item?.email, 30)}
                    </p>
                    <p className="font-normal text-center text-xs line-clamp-2 ">
                      {truncateText(item?.store ?? "The North FaceIn", 30)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-full min-h-[76vh] w-1/3 p-4 flex flex-col items-center justify-center bg-white border">
            <img
              className="w-[140px] h-[140px] object-fill"
              src={profile}
              alt=""
            />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">
                {selectedStaff?.firstName + " " + selectedStaff?.lastName}
              </p>
              <p className="text-sm font-medium text-gray-700">
                {selectedStaff?.email}
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 mt-4 px-2">
              {profileData?.map((item) => {
                return (
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <p className="font-semibold">{item?.label}</p>
                    <p>{item?.value}</p>
                  </div>
                );
              })}
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <p className="font-semibold">Working Days</p>
                <p>{selectedStaff?.days?.map((d) => daysMap[d]).join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && <Loading />}
      {isError && <p className="flex items-center justify-center">Error</p>}
      {data?.data?.length == 0 && (
        <div className="w-full flex justify-center  pt-16 pb-20">
          <EmptyPage message={"Oops! No staff in this store"} />
        </div>
      )}
    </div>
  );
}

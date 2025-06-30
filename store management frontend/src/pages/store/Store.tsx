import { HiOutlineUsers } from "react-icons/hi2";
import { useEffect, useState } from "react";
import TopButton from "@/components/TopButton";
import { useStoreData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddStoreModal from "./AddStoreModal";
import { LuStore } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import truncateText from "@/utils/truncateText";
import Loading from "@/assets/AllSvg";
import EmptyPage from "@/components/EmptyPage";
import InputField from "@/ui/InputField";
import { AiOutlineCopy } from "react-icons/ai";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);
  const { data, isLoading, isError } = useStoreData(
    debouncedSearchText,
    pageSize,
    page
  );

  const storeDetailOptions = [
    {
      id: 1,
      name: "Product",
      icon: <MdOutlineDashboard size={16} />,
      className: "row-span-2 ",
      navigate: "/store-product",
    },
    {
      id: 2,
      name: "Staff",
      icon: <HiOutlineUsers size={16} />,
      className: "col-span-2",
    },
    {
      id: 3,
      name: "Sales",
      icon: <BsGraphUpArrow size={14} />,
      className: "col-span-2",
    },
  ];

  const handleCopyRegsiterLink = (storeId) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/register/?store=${storeId}&userId=${user?.data?.id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the link.");
      });
  };

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
        <InputField
          placeholder={"Search store ..."}
          className={"w-[220px] border text-gray-500 border-gray-300"}
          setSearchText={setSearchText}
        />
        <AddStoreModal asChild>
          <div>
            <TopButton
              buttonName={"Add Store"}
              className={""}
              handleButtonClick={""}
            />
          </div>
        </AddStoreModal>
      </div>
      <div className="py-6 px-4  bg-white border h-[76vh]">
        <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.data?.map((item) => {
            return (
              <div className="border border-gray-300 pt-3 pb-2 bg-[#f0edfa] px-2 mb-2 relative ">
                <div className="absolute px-2 font-medium skew-x-[-12deg] right-0 top-[-14px] bg-black text-xs text-[#C9BCF7]">
                  # {item?.storeNumber}
                </div>
                <p className="text-sm flex justify-between items-center font-semibold text-gray-600">
                  <div className="flex gap-1 items-center line-clamp-1">
                    <LuStore /> {truncateText(item?.name, 30)}
                  </div>
                  <div className="flex gap-1 text-base mb-2">
                    <AiOutlineCopy
                      onClick={() => handleCopyRegsiterLink(item?.id)}
                      size={14}
                      className="text-green-500 cursor-pointer"
                    />
                    <AddStoreModal asChild edit editData={item}>
                      <FiEdit2
                        size={14}
                        className="text-blue-500 cursor-pointer"
                      />
                    </AddStoreModal>
                    {/* <DeleteModal
                      asChild
                      desc={"Are you sure you want to delete this Store"}
                      title={"Delete Store"}
                      id={item?.id}
                    > */}
                    <FaRegTrashCan
                      size={14}
                      className="text-red-600 cursor-not-allowed"
                    />
                    {/* </DeleteModal> */}
                  </div>
                </p>
                <p className="text-xs font-medium text-gray-600 line-clamp-1">
                  {truncateText(item?.address, 40)}
                </p>
                <div className="grid grid-flow-col grid-rows-2 gap-1 mt-2 text-xs font-semibold text-gray-600">
                  {storeDetailOptions?.map((option) => {
                    return (
                      <div
                        onClick={() =>
                          navigate(`${option?.navigate}/${item?.id}`, {
                            state: item,
                          })
                        }
                        className={`${option?.className} cursor-pointer border flex flex-col gap-[2px] py-2  items-center justify-center border-gray-300 bg-white hover:bg-[#e2dbf9] hover:border-gray-400 `}
                      >
                        {option?.icon}
                        {option?.name}
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
            <EmptyPage message={"Oops! No store available right now."} />
          </div>
        )}
      </div>
    </div>
  );
}

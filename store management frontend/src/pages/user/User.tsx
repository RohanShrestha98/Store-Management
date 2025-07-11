import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useStoreData, useUserData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";
import AddUserModal from "./AddUserModal";
import { RxCross2 } from "react-icons/rx";
import CustomSelect from "@/ui/CustomSelect";
import InputField from "@/ui/InputField";
import truncateText from "@/utils/truncateText";
import { useAuthStore } from "@/store/useAuthStore";

export default function User() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedStore, setSelectedStore] = useState(
    searchParams.get("store") ?? user?.data?.storeId ?? ""
  );
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  const { data, isLoading, isError } = useUserData(
    selectedStore,
    debouncedSearchText,
    pageSize,
    page
  );

  const {
    data: storeData,
    isLoading: storeIsLoading,
    isError: storeIsError,
  } = useStoreData();

  const storeOptions = storeData?.data?.map((item) => {
    return { value: item?.id, label: item?.name };
  });

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.firstName,
        id: "firstName",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1 py-1">
              {" "}
              <p className="flex items-center gap-1">
                {info?.row?.original?.firstName === ""
                  ? "-"
                  : info?.row?.original?.firstName + " "}
                {info?.row?.original?.lastName}
              </p>
            </div>
          );
        },
        // info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        cell: (info) => {
          return (
            <p>
              {info?.row?.original?.email === ""
                ? "-"
                : truncateText(info?.row?.original?.email)}
            </p>
          );
        },
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row?.phone,
        id: "phone",
        cell: (info) => {
          return (
            <p>
              {info?.row?.original?.phoneNumber === ""
                ? "-"
                : info?.row?.original?.phoneNumber}
            </p>
          );
        },
        header: () => <span>Phone Number</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.payPerHour,
        id: "pay",
        cell: (info) => {
          return <p>${info?.row?.original?.payPerHour}</p>;
        },
        header: () => <span>Pay</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.isVerified,
        id: "isVerified",
        cell: (info) => {
          return (
            <p
              className={`inline-block text-xs px-4  text-center cursor-default rounded-full py-[2px] font-medium text-white ${
                info?.row?.original?.isVerified
                  ? "bg-[#027A48]"
                  : "bg-yellow-600"
              }
                  `}
            >
              {info?.row?.original?.isVerified ? "Verified" : "Not Verified"}
            </p>
          );
        },
        // info.getValue(),
        header: () => <span>Verified</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.role ?? "Staff",
        id: "role",
        header: () => <span>Role</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddUserModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddUserModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this User"}
                title={"Delete User"}
                id={info?.row?.original?.id}
              >
                <FaRegTrashCan className="text-red-600 cursor-pointer" />
              </DeleteModal>
            </div>
          );
        },
        header: () => <span className="flex justify-center">Action</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );
  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
      store: selectedStore,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText, selectedStore]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2  relative">
          <InputField
            placeholder={"Search users ..."}
            className={"w-[220px] border text-gray-500 border-gray-300"}
            setSearchText={setSearchText}
          />
          {user?.data?.role === "Admin" && (
            <CustomSelect
              options={storeOptions}
              placeholder={"Select Store"}
              className={`w-[160px] text-xs text-gray-500 border-gray-300 focus-visible:border-gray-700`}
              setSelectedField={setSelectedStore}
            />
          )}
          {user?.data?.role === "Admin" && (searchText || selectedStore) && (
            <div
              onClick={() => {
                setSearchText("");
                setSelectedStore("");
                setPage("1");
                setPageSize("10");
                setSearchParams({});
              }}
              className="flex border h-[30px] gap-1 border-red-600 rounded-[6px] bg-red-600 text-white cursor-pointer items-center font-semibold px-2 text-xs"
            >
              <RxCross2 size={14} />
              <p>Clear</p>
            </div>
          )}
        </div>
        <AddUserModal asChild>
          <div>
            <TopButton
              buttonName={"Add Staff"}
              className={""}
              handleButtonClick={""}
            />
          </div>
        </AddUserModal>
      </div>
      <div className="drop-shadow">
        <ReactTable
          isLoading={isLoading}
          isError={isError}
          columns={columns}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
          emptyMessage="Oops! No user to show"
        />
        <SearchPagination
          totalPage={data?.pagenation?.totalPages}
          setPage={setPage}
          page={page}
          disabled
          setSearchText={setSearchText}
          searchText={searchText}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}

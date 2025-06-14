import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import AddInstructorModal from "./AddUserModal";
import TopButton from "@/components/TopButton";
import { useUserData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";
import AddUserModal from "./AddUserModal";

export default function User() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useUserData(searchText, pageSize, page);
  
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
            <div className="flex items-center gap-1">
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
                : info?.row?.original?.email}
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
        accessorFn: (row) => row?.isVerified,
        id: "isVerified",
        cell: (info) => {
          return (
            <p
              className={`inline-block text-xs px-4 cursor-default rounded-full py-[2px] font-medium text-white bg-[#027A48]
                  `}
            >
              {"Verified"}
            </p>
          );
        },
        // info.getValue(),
        header: () => <span>Verified</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.role?.title ?? "Staff",
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
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-end items-center">
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
      <div>
        <SearchPagination
          totalPage={data?.totalPage}
          setPage={setPage}
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        <ReactTable
          isLoading={isLoading}
          isError={isError}
          columns={columns}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
          emptyMessage="Oops! No User available right now."
        />
      </div>
    </div>
  );
}

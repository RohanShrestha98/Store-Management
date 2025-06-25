import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useNotificationData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText";
import AddNotificationModal from "./AddNotificationModal";
import DeleteModal from "@/components/DeleteModal";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function Notification() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const role = user?.data?.role?.id;
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useNotificationData();

  const columns = useMemo(() => {
    const cols = [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row?.title,
        id: "title",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1 line-clamp-1">
              {info?.row?.original?.title ?? "-"}
            </p>
          );
        },
        header: () => <span>Notification</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "description",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {info?.row?.original?.description
                ? ConvertHtmlToPlainText(
                    info?.row?.original?.description?.slice(0, 50)
                  )
                : "-"}
            </p>
          );
        },
        header: () => <span>Description</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.recipient,
        id: "recipient",
        cell: (info) => {
          return (
            <div>
              {info?.row?.original?.recipient == "1"
                ? "Admin"
                : info?.row?.original?.recipient == "2"
                ? "Analyst"
                : info?.row?.original?.recipient == "3"
                ? "Mid Level Analyst"
                : info?.row?.original?.recipient == "4"
                ? "Executive Level Analyst"
                : "ISO"}
            </div>
          );
        },
        header: () => <span>Recipient</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.notificationType,
        id: "notificationType",
        header: () => <span>Type</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.scheduledDate,
        id: "scheduledDate",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {moment(info?.row?.original?.scheduledDate).format(
                "MMM Do YYYY, h:mm:ss a"
              )}
            </p>
          );
        },
        header: () => <span>Schedule Date</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddNotificationModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddNotificationModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this notification"}
                title={"Delete Notification"}
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
    ];
    const showActions = role == 1 || role == 5; // or any condition
    return showActions ? cols : cols.slice(0, -1);
  }, []);

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
      {(role == 1 || role == 5) && (
        <AddNotificationModal asChild>
          <div>
            <TopButton
              buttonName={"Add Notification"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddNotificationModal>
      )}

      <div>
        <SearchPagination
          totalPage={data?.pagenation?.totalPages}
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
          emptyMessage="Oops! No Notification available right now."
        />
      </div>
    </div>
  );
}

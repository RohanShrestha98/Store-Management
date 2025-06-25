import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, useCourseGroupData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddCourseModal from "./AddTaskModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";
import { Switch } from "@/components/ui/switch";
import { useCourseUpdateStatusMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import AddMyActionsModal from "./AddTaskModal";
import AddRiskTableModal from "./AddTaskModal";
import AddTaskModal from "./AddTaskModal";

export default function Task() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useCourseData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: courseGroupData } = useCourseGroupData();
  const courseGroupOptions = convertToSelectOptions(courseGroupData?.data);

  const courseUpdateStatus = useCourseUpdateStatusMutation();

  const handleIsPublic = async (id) => {
    try {
      const response = await courseUpdateStatus.mutateAsync(["patch", id, ""]);
      toast.success("Course availability updated");
    } catch (error) {
      error?.response?.data?.errors?.error &&
        toast.error(error?.response?.data?.errors?.error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.courseID,
        id: "courseGroup",
        cell: (info) => {
          return (
            <p>{info?.row?.original?.courseGroup?.courseGroupID ?? "-"}</p>
          );
        },
        header: () => <span>Course Group</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "course",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1">
              {info?.row?.original?.thumbnail ? (
                <img
                  className="h-8 w-8 object-cover rounded-full"
                  src={info?.row?.original?.thumbnail}
                  alt=""
                />
              ) : (
                <div className="min-h-8 min-w-8 rounded-full bg-gray-100"></div>
              )}
              <p className="flex items-center gap-1 line-clamp-1">
                {truncateText(info?.row?.original?.title, 40)}
              </p>
            </div>
          );
        },
        header: () => <span>Course Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.courseID,
        id: "destination",
        header: () => <span>Course ID</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "description",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {truncateText(info?.row?.original?.description, 40)}
            </p>
          );
        },
        header: () => <span>Description</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <Switch
                isToggle
                onClick={() => handleIsPublic(info?.row?.original?.id)}
                checked={info?.row?.original?.available}
                className="bg-gray-300"
              />
              <AddCourseModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddCourseModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this action"}
                title={"Delete Action"}
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
        <AddTaskModal asChild>
          <div>
            <TopButton
              buttonName={"Add Task"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddTaskModal>
      </div>
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
          emptyMessage="Oops! No Task available right now."
        />
      </div>
    </div>
  );
}

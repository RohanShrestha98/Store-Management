import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useSubjectData, useUnitData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddUnitModal from "./AddUnitModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";
import DragDropTable from "@/components/DragDropTable/DragDropUnitTable";
import { useSortable } from "@dnd-kit/sortable";
import { useUnitPositionUpdateMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import toast from "react-hot-toast";

export default function Units() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useUnitData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: subjectData } = useSubjectData();
  const subjectOptions = convertToSelectOptions(subjectData?.data);
  const positionUpdateMutation = useUnitPositionUpdateMutation();

  const [dragData, setDragData] = useState();
  useEffect(() => {
    setDragData(data?.data);
  }, [data?.data]);

  const columns = useMemo(
    () => [
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
        header: () => <span>Unit Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.subject?.title,
        id: "subjectTitle",
        header: () => <span>Subject</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course?.courseID,
        id: "course",
        header: () => <span>Course</span>,
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
              <AddUnitModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddUnitModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this unit"}
                title={"Delete Unit"}
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

  const handleUpdateUnitPosition = async () => {
    const chapterIDs = [];
    dragData?.map((item) => {
      return chapterIDs?.push(item?.id);
    });
    const postData = {
      chapterIDs: chapterIDs,
    };
    try {
      const response = await positionUpdateMutation.mutateAsync([
        "patch",
        "",
        postData,
      ]);
      toast.success("Unit position update successfully");
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.errors?.error);
    }
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
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <FilterSearch
          searchText={searchText}
          setSelectedField={setSelectedField}
          options={subjectOptions}
          inputPlaceholder={"Search Unit"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Subject"}
        />
        <div className="flex items-center gap-2">
          {selectedField && (
            <Button
              buttonName={"Update Unit Position"}
              handleButtonClick={handleUpdateUnitPosition}
            />
          )}
          <AddUnitModal asChild>
            <div>
              <TopButton
                buttonName={"Add Unit"}
                className={""}
                handleButtonClick={() => {}}
              />
            </div>
          </AddUnitModal>
        </div>
      </div>
      <div>
        <SearchPagination
          totalPage={data?.pagenation?.totalPages}
          setPage={setPage}
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        {selectedField ? (
          <DragDropTable dragData={dragData ?? []} setDragData={setDragData} />
        ) : (
          <ReactTable
            isLoading={isLoading}
            isError={isError}
            columns={columns}
            data={data?.data ?? []}
            currentPage={1}
            totalPage={1}
            emptyMessage="Oops! No Units available right now."
          />
        )}
      </div>
    </div>
  );
}

import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useCategoryData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "@/components/DeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useCategoryData(
    debouncedSearchText,
    pageSize,
    page
  );

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "name",
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.specification?.join(", "),
        id: "specification",
        cell: (info) => <p className="line-clamp-2">{info.getValue()}</p>,
        header: () => <span>Specifications</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.brands?.join(", "),
        id: "brands",
        cell: (info) => <p className="line-clamp-2">{info.getValue()}</p>,
        header: () => <span>Brands</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => new Date(row?.createdAt).toLocaleDateString(),
        id: "createdAt",
        header: () => <span>Added</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          const data = info?.row?.original;
          const navigate = useNavigate(); // make sure this is used in a component
          return (
            <div className="flex gap-2 text-base justify-center">
              <FiEdit2
                onClick={() =>
                  navigate(`/edit-category/${data?.id}`, {
                    state: data,
                  })
                }
                className="text-[#4365a7] cursor-pointer"
              />
              <DeleteModal
                asChild
                desc="Are you sure you want to delete this Category?"
                title="Delete Category"
                id={data?.id}
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
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <InputField
          placeholder={"Search category ..."}
          className={"w-[220px] border text-gray-500 border-gray-300"}
          setSearchText={setSearchText}
        />
        <Button
          buttonName={"Add Category"}
          icon={<FaPlus />}
          handleButtonClick={() => navigate("/add-category")}
        />
      </div>
      <div>
        <SearchPagination
          totalPage={data?.pagenation?.totalPages}
          setPage={setPage}
          disabled
          setSearchText={setSearchText}
          page={page}
          searchText={searchText}
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
          emptyMessage="Oops! No category to show"
        />
      </div>
    </div>
  );
}

import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useProductData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "@/components/DeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Button from "@/ui/Button";
import truncateText from "@/utils/truncateText";

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
    "",
    debouncedSearchText,
    pageSize,
    page
  );

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "sn",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.images?.[0],
        id: "image",
        cell: (info) => (
          <div>
            <img
              src={
                info?.row?.original?.images?.[0] ??
                "http://localhost:3001/uploads/laptop3.jpg"
              }
              alt="product"
              className="h-8 w-8 object-contain rounded"
            />
          </div>
        ),
        header: () => <span>Image</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "name",
        cell: (info) => <p>{truncateText(info?.row?.original?.name, 50)}</p>,
        header: () => <span>Product Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.vendor,
        id: "vendor",
        header: () => <span>Vendor</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.costPrice,
        id: "costPrice",
        cell: (info) => (
          <p className="font-semibold">${info?.row?.original?.costPrice}</p>
        ),
        header: () => <span>Cost Price</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.sellingPrice,
        id: "sellingPrice",
        cell: (info) => (
          <p className="font-semibold">${info?.row?.original?.sellingPrice}</p>
        ),
        header: () => <span>Selling Price</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.quantity,
        id: "quantity",
        header: () => <span>Qty</span>,
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          const data = info?.cell?.row?.original;
          return (
            <div className="flex gap-2 text-base justify-center">
              <FiEdit2
                onClick={() =>
                  navigate(`/edit-product/${data?.id}`, {
                    state: data,
                  })
                }
                className="text-[#4365a7] cursor-pointer"
              />
              <DeleteModal
                asChild
                desc="Are you sure you want to delete this Product?"
                title="Delete Product"
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
        <Button
          buttonName={"Add Product"}
          icon={<FaPlus />}
          handleButtonClick={() => navigate("/add-product")}
        />
      </div>

      <div>
        <SearchPagination
          totalPage={data?.pagenation?.totalPages}
          setPage={setPage}
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
          emptyMessage="Oops! No Product available right now."
        />
      </div>
    </div>
  );
}

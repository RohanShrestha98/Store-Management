import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useSalesData, useStoreData } from "@/hooks/useQueryData";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import truncateText from "@/utils/truncateText";
import InputField from "@/ui/InputField";
import Button from "@/ui/Button";
import { FiDownload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import CustomSelect from "@/ui/CustomSelect";

export default function SalesHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [selectedStore, setSelectedStore] = useState(
    searchParams.get("store") ?? ""
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useSalesData(
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
    return { value: item?.storeNumber, label: item?.name };
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
              className="h-6 w-8 object-fill rounded"
            />
          </div>
        ),
        header: () => <span>Image</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "name",
        cell: (info) => {
          return (
            <p className="max-w-40 line-clamp-1">
              {truncateText(info?.row?.original?.name, 60)}
            </p>
          );
        },
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.createdBy,
        id: "createdBy",
        cell: (info) => {
          return (
            <p className="max-w-40 line-clamp-1 flex">
              {truncateText(info?.row?.original?.createdBy, 20)}(
              {info?.row?.original?.storeNumber})
            </p>
          );
        },
        header: () => <span>Staff</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.createdAt,
        id: "createdAt",
        cell: (info) => {
          return (
            <p>
              {moment(info?.row?.original?.createdAt).format(
                "ddd, MM/DD, YY hh:mm A"
              )}
            </p>
          );
        },
        header: () => <span>Sales Date</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.sellingPrice,
        id: "isVerified",
        cell: (info) => {
          return (
            <p
              className={`inline-block text-xs px-4 cursor-default rounded-full py-[2px] font-semibold
                  `}
            >
              ${info?.row?.original?.sellingPrice}
            </p>
          );
        },
        // info.getValue(),
        header: () => <span>Selling price</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.quantity,
        id: "quantity",
        header: () => <span>Quantity</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.total,
        id: "total",
        cell: (info) => {
          return (
            <p
              className={`inline-block text-xs px-4 cursor-default rounded-full py-[2px] font-semibold
                  `}
            >
              ${info?.row?.original?.total}
            </p>
          );
        },
        header: () => <span className="flex justify-center pr-4">Total</span>,
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
    <div>
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-2  relative">
          <InputField
            placeholder={"Search sales history ..."}
            className={"w-[220px] border text-gray-500 border-gray-300"}
            setSearchText={setSearchText}
          />
          <CustomSelect
            options={storeOptions}
            placeholder={"Select Store"}
            className={`w-[160px] text-xs text-gray-500 border-gray-300 focus-visible:border-gray-700`}
            setSelectedField={setSelectedStore}
          />
        </div>
        <Button
          buttonName={"Download"}
          icon={<FiDownload />}
          handleButtonClick={() => {}}
        />
      </div>
      <div className="px-4 pt-2 flex flex-col gap-4">
        <div>
          <SearchPagination
            totalPage={data?.pagenation?.totalPages}
            setPage={setPage}
            disabled
            page={page}
            setSearchText={setSearchText}
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
            emptyMessage="Oops! No History available right now."
          />
        </div>
      </div>
    </div>
  );
}

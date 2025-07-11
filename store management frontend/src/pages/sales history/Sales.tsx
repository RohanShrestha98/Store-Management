import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useSalesData, useStoreData } from "@/hooks/useQueryData";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import truncateText from "@/utils/truncateText";
import InputField from "@/ui/InputField";
import Button from "@/ui/Button";
import { FiDownload } from "react-icons/fi";
import CustomSelect from "@/ui/CustomSelect";
import { useAuthStore } from "@/store/useAuthStore";
import { RxCross2 } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";

export default function Sales() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const navigate = useNavigate();
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
    searchParams.get("store") ?? user?.data?.storeId ?? ""
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
        accessorFn: (row) => row?.createdBy,
        id: "createdBy",
        cell: (info) => {
          return (
            <p className="max-w-40 line-clamp-1 flex py-1">
              {truncateText(info?.row?.original?.createdBy, 20)}
            </p>
          );
        },
        header: () => <span>Staff</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.store,
        id: "store",
        cell: (info) => {
          return <p className="max-w-40 line-clamp-1 flex">The North FaceIn</p>;
        },
        header: () => <span>Store</span>,
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
        header: () => <span>Sales date</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.quantity,
        id: "quantity",
        header: () => <span>Quantity</span>,
        cell: (info) => {
          const data = info?.cell?.row?.original;
          return <div className="pl-4">{data?.quantity}</div>;
        },
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.subTotal,
        id: "subTotal",
        cell: (info) => {
          return <p>${info?.row?.original?.subTotal}</p>;
        },
        header: () => <span>Sub total</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.salesTax,
        id: "salesTax",
        cell: (info) => {
          return <p>{info?.row?.original?.salesTax}%</p>;
        },
        header: () => <span>Sales tax</span>,
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row?.total,
        id: "total",
        cell: (info) => {
          return <p>${info?.row?.original?.total}</p>;
        },
        header: () => <span>Total</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          const data = info?.cell?.row?.original;
          return (
            <div
              onClick={() => navigate(`/sales-details/${data?.id}`)}
              className="pl-4 text-blue-800 cursor-pointer"
            >
              <TbListDetails size={14} />
            </div>
          );
        },
        header: () => <span>Details</span>,
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
            placeholder={"Search sales ..."}
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

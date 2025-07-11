import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import {
  useCategoryData,
  useProductData,
  useStoreData,
  useVendorData,
} from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteModal from "@/components/DeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Button from "@/ui/Button";
import truncateText from "@/utils/truncateText";
import InputField from "@/ui/InputField";
import { RxCross2 } from "react-icons/rx";
import { useAuthStore } from "@/store/useAuthStore";
import SelectModal from "@/components/SelectModal";
import { LuSquareUser, LuStore } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
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

  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useProductData(
    "",
    debouncedSearchText,
    pageSize,
    page,
    selectedStore
  );
  const {
    data: storeData,
    isLoading: storeIsLoading,
    isError: storeIsError,
  } = useStoreData();

  const {
    data: vendorData,
    isLoading: vendorIsLoading,
    isError: vendorIsError,
  } = useVendorData();

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useCategoryData();

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

  const selectModal = [
    {
      data: storeData?.data,
      setSelectedField: setSelectedStore,
      title: "Store",
      show: user?.data?.role === "Admin",
      icon: <LuStore />,
      className: "",
    },
    {
      data: vendorData?.data,
      setSelectedField: setSelectedStore,
      title: "Vendor",
      icon: <LuSquareUser />,
      show: user?.data?.role === "Admin",
      className: "",
    },
    {
      data: categoryData?.data,
      setSelectedField: setSelectedStore,
      title: "Category",
      icon: <MdOutlineCategory />,
      show: true,
      className: "",
    },
  ];
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
          {selectModal?.map((item) => {
            if (item?.show)
              return (
                <SelectModal
                  data={item?.data}
                  setSelectedField={item?.setSelectedField}
                  asChild
                  title={item?.title}
                >
                  <p
                    className={`border px-3 flex items-center gap-[6px] text-sm justify-center cursor-pointer hover:drop-shadow-lg bg-white h-8 text-center rounded-[6px] border-gray-300 drop-shadow-sm  text-gray-700 focus-visible:border-gray-700 ${item?.className}`}
                  >
                    <div className="text-sm text-gray-600">{item?.icon}</div>
                    Select {item?.title}
                  </p>
                </SelectModal>
              );
          })}
        </div>

        <div className="flex items-center gap-2">
          <InputField
            placeholder={"Search product ..."}
            className={"w-[220px] text-sm border text-gray-500 border-gray-300"}
            setSearchText={setSearchText}
          />
          <Button
            buttonName={"Add Product"}
            icon={<FaPlus />}
            handleButtonClick={() => navigate("/add-product")}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Filter : </p>
        <p className=" flex items-center gap-2 text-xs bg-white px-2 py-1 drop-shadow rounded-[4px]">
          The North FaceIn
          <RxCross2 size={14} />
        </p>
        <p className="flex items-center gap-2 text-xs bg-white px-2 py-1 drop-shadow rounded-[4px]">
          The North FaceIn
          <RxCross2 size={14} />
        </p>
      </div>
      {/* <DashboardTop /> */}
      <div className=" bg-white drop-shadow">
        <ReactTable
          isLoading={isLoading}
          isError={isError}
          columns={columns}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
          emptyMessage="Oops! No Product available right now."
        />
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
      </div>
    </div>
  );
}

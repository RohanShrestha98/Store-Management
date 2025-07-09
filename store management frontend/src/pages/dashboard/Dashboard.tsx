import DashboardTop from "./DashboardTop";
import DashboardNotification from "./DashboardNotification";
import UserTrends from "./UserTrends";
import PaymentGateway from "./PaymentGateway";
import { useSalesData } from "@/hooks/useQueryData";
import { useMemo } from "react";
import truncateText from "@/utils/truncateText";
import { ReactTable } from "@/components/Table";

export default function Dashboard() {
  const { data, isLoading, isError } = useSalesData();

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
              className="h-6 w-8 object-contain rounded"
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
        accessorFn: (row) => row?.sellingPrice,
        id: "sellingPrice",
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
        header: () => <span>Price</span>,
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
        header: () => <span>Total</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );
  return (
    <div className="px-4 py-4">
      <DashboardTop />
      <div className="grid grid-cols-2 gap-2 my-2">
        <div className="bg-white p-2">
          <p className=" font-medium text- mb-2">Sales History</p>
          <ReactTable
            isLoading={isLoading}
            isError={isError}
            columns={columns}
            data={data?.data ?? []}
            currentPage={1}
            totalPage={1}
            emptyMessage="Oops! No Sales to show"
          />
        </div>
        {/* <UserOverview /> */}
        {/* <RecentPayment /> */}
        <DashboardNotification />
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        <UserTrends />
        {/* <DashboardPayment /> */}
        <PaymentGateway />
      </div>
    </div>
  );
}

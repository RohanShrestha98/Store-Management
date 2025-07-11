import DashboardTop from "./DashboardTop";
import DashboardNotification from "./DashboardNotification";
import UserTrends from "./UserTrends";
import PaymentGateway from "./PaymentGateway";
import { useSalesData } from "@/hooks/useQueryData";
import { useMemo } from "react";
import truncateText from "@/utils/truncateText";
import { ReactTable } from "@/components/Table";
import moment from "moment";

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
        accessorFn: (row) => row?.createdBy,
        id: "createdBy",
        cell: (info) => {
          return (
            <p className="max-w-40 line-clamp-1 flex">
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
              {moment(info?.row?.original?.createdAt).format("ddd, MM/DD, YY ")}
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
        accessorFn: (row) => row?.total,
        id: "total",
        cell: (info) => {
          return <p>${info?.row?.original?.total}</p>;
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

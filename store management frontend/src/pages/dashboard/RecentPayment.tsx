import { usePaymentData } from "@/hooks/useQueryData";
import { ReactTable } from "../../components/Table";
import { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import moment from "moment";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useSearchParams } from "react-router-dom";

export default function RecentPayment() {
  const { data, isLoading, isError } = usePaymentData("", "", "5", 1);

  const columns = useMemo(() => [
    {
      accessorFn: (row, index) => index + 1,
      id: "id",
      header: () => <span>S.N.</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row?.user?.name,
      id: "name",
      header: () => <span>User name</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row?.package,
      id: "package",
      header: () => <span>Package</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row?.amount,
      id: "amount",
      cell: (info) => {
        return <p>Rs {info?.row?.original?.amount}</p>;
      },
      header: () => <span>Amount</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row?.status,
      id: "haslimit",
      cell: (info) => {
        return (
          <p
            className={`text-white text-center rounded-full py-1 px-1 font-semibold ${
              info?.row?.original?.status === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {capitalizeFirstLetter(info?.row?.original?.status)}
          </p>
        );
      },
      header: () => <span>Status</span>,
      footer: (props) => props.column.id,
    },
  ]);

  return (
    <div className="py-5 bg-white rounded-xl">
      <div className="px-5 flex justify-between items-center mb-5">
        <h2 className="text-[#4C4C4C] text-lg font-semibold">Recent Task</h2>
        <button className="text-sm font-medium text-[#4365a7] flex items-center gap-1">
          View all <FaArrowRight fontSize={14} />
        </button>
      </div>
      <div>
        <ReactTable
          isLoading={isLoading}
          isError={isError}
          columns={columns}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
        />
      </div>
    </div>
  );
}

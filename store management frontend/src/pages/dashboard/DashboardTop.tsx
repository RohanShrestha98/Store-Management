import { FaUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdSubscriptions } from "react-icons/md";
import { useRiskData, useUserData } from "@/hooks/useQueryData";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardTop() {
  const { data: userData } = useUserData();
  const { data: riskData } = useRiskData();
  const { data: completedRiskData } = useRiskData("", "", "50", "");
  const { user } = useAuthStore();
  const role = user?.data?.role;

  const completedData = completedRiskData?.data?.filter(
    (item) => item?.status == "closed"
  );
  const items = [
    {
      icon: <FaUser color="white" fontSize={14} />,
      title: "Total Users",
      amount: userData?.data?.length ?? 0,
      bgColor: "bg-[#7DA8E8]",
    },
    {
      icon: <FaBook color="white" fontSize={14} />,
      title: "Total Store",
      amount: riskData?.data?.length ?? 0,
      bgColor: "bg-[#7DD3E8]",
    },
    {
      icon: <HiCurrencyDollar color="white" fontSize={18} />,
      title: "Total Product",
      amount: completedData?.length ?? 0,
      // percentage: -2,
      bgColor: "bg-[#7DE888]",
    },
    {
      icon: <MdSubscriptions color="white" fontSize={16} />,
      title: "Total Sales",
      amount: <p className="text-green-500">$10</p>,
      // percentage: -30,
      bgColor: "bg-[#E87D7D]",
    },
  ];

  const staffItems = [
    {
      icon: <FaUser color="white" fontSize={14} />,
      title: "Total Time",
      amount: userData?.data?.length ?? 0,
      bgColor: "bg-[#7DA8E8]",
    },
    {
      icon: <FaBook color="white" fontSize={14} />,
      title: "Store Number",
      amount: user?.data?.storeNumber,
      bgColor: "bg-[#7DD3E8]",
    },
    {
      icon: <HiCurrencyDollar color="white" fontSize={18} />,
      title: "Sold Product",
      amount: completedData?.length ?? 0,
      // percentage: -2,
      bgColor: "bg-[#7DE888]",
    },
    {
      icon: <MdSubscriptions color="white" fontSize={16} />,
      title: "Total Sales",
      amount: <p className="text-green-500">$10</p>,
      // percentage: -30,
      bgColor: "bg-[#E87D7D]",
    },
  ];
  const dashboardTopItems = role == "Staff" ? staffItems : items;
  return (
    <div>
      <div className={`grid grid-cols-4 gap-2 `}>
        {dashboardTopItems?.map((item, index) => (
          <div
            key={index}
            className="bg-white px-4 py-2 drop-shadow flex justify-between items-end gap-10"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span
                  className={`flex justify-center items-center h-8 w-8 ${item.bgColor}`}
                >
                  {item.icon}
                </span>
                <p className="text-[#4C4C4C] text-sm font-medium">
                  {item.title}
                </p>
              </div>
              <h2 className="text-[#4C4C4C] text-2xl font-semibold">
                {item.amount}
              </h2>
            </div>
            <p
              className={`font-medium text-base ${
                item.percentage > 0 ? "text-[#1BCC00]" : "text-[#D92626]"
              }`}
            >
              {item.percentage > 0 ? "+" : ""}
              {item.percentage}
              {item.percentage && "%"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

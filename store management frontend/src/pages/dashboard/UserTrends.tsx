import { useRiskData, useUserData } from "@/hooks/useQueryData";
import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function UserTrends() {
  const { data: userData } = useUserData();

  const admin = userData?.data?.filter((item) => {
    return item?.role?.id == 1;
  });
  const analyst = userData?.data?.filter((item) => item?.role?.id == 2);
  const midLevelAnalyst = userData?.data?.filter((item) => item?.role?.id == 3);
  const executiveLevelAnalyst = userData?.data?.filter(
    (item) => item?.role?.id == 4
  );
  const iso = userData?.data?.filter((item) => item?.role?.id == 5);

  const data = [
    {
      name: "Admin",
      Monthly: admin?.length,
    },
    {
      name: "Analyst",
      Monthly: analyst?.length,
    },
    {
      name: "ML Analyst",
      Monthly: midLevelAnalyst?.length,
    },
    {
      name: "EL Analyst",
      Monthly: executiveLevelAnalyst?.length,
    },
    {
      name: "ISO",
      Monthly: iso?.length,
    },
  ];

  const legends = [{ color: "bg-[#4D8AFF]", name: "Monthly" }];

  const CustomLegend = () => (
    <div className="flex gap-2 items-center">
      {legends.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-2 h-2 ${item.color}`}></div>
          <p className="text-[#667085] text-sm font-normal">{item.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-5 bg-white" style={{ width: "100%", height: "300px" }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#4C4C4C] text-lg font-semibold">User Trends</h2>
        <CustomLegend />
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 30,
            }}
          >
            <XAxis dataKey="name" />
            {/* <Legend/> */}
            {/* <Tooltip /> */}
            <Line
              type="monotone"
              dataKey="Monthly"
              stroke="#4D8AFF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

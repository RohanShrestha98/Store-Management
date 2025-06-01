import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useRiskData } from "@/hooks/useQueryData";

export default function PaymentGateway() {
  const { data: riskData } = useRiskData();
  const low = riskData?.data?.filter((item) => item?.impact == "low");
  const medium = riskData?.data?.filter((item) => item?.impact == "medium");
  const high = riskData?.data?.filter((item) => item?.impact == "high");
  const critical = riskData?.data?.filter((item) => item?.impact == "critical");

  const data = [
    {
      name: "Impact",
      Low: low?.length,
      Medium: medium?.length,
      High: high?.length,
      Critical: critical?.length,
    },
  ];

  const legends = [
    { color: "#2ECC71", name: "Low", amount: low?.length },
    { color: "#F1C40F", name: "Medium", amount: medium?.length },
    { color: "#E67E22", name: "High", amount: high?.length },
    { color: "#E74C3C", name: "Critical", amount: critical?.length },
  ];
  // Custom legend component
  const CustomLegend = () => (
    <div className="flex gap-2 justify-center">
      {legends.map((item, index) => (
        <div
          className="border border-[#F2F2F2] rounded-xl px-2 py-2 cursor-pointer flex flex-col gap-1"
          key={index}
        >
          <div className="flex items-center gap-1">
            <p
              className={`${
                item?.name == "Low"
                  ? "bg-[#2ECC71]"
                  : item?.name == "Medium"
                  ? "bg-[#F1C40F]"
                  : item?.name == "High"
                  ? "bg-[#E67E22]"
                  : "bg-[#E74C3C]"
              } w-6 h-6  min-w-6 rounded-lg min-h-6`}
            ></p>
            <p className="text-[#808080] font-medium text-sm">{item.name}</p>
          </div>
          <p className="text-[#4C4C4C] font-semibold text-base">
            {item.amount}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-5 bg-white rounded-xl">
      <h2 className="text-[#4C4C4C] text-lg font-semibold mb-5">Impact</h2>
      <div className="-ml-14">
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart
            layout="vertical"
            data={data}
            barCategoryGap={10}
            barGap={14}
          >
            <XAxis type="number" axisLine={false} tick={null} />
            <YAxis
              dataKey="name"
              type="category"
              scale="band"
              axisLine={false}
            />
            <Bar
              dataKey="Low"
              barSize={20}
              fill="#2ECC71"
              radius={[0, 6, 6, 0]}
            />
            <Bar
              dataKey="Medium"
              barSize={20}
              fill="#F1C40F"
              radius={[0, 6, 6, 0]}
            />
            <Bar
              dataKey="High"
              barSize={20}
              fill="#E67E22"
              radius={[0, 6, 6, 0]}
            />
            <Bar
              dataKey="Critical"
              barSize={20}
              fill="#E74C3C"
              radius={[0, 6, 6, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </div>
  );
}

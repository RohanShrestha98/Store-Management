import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    amount: 400,
  },
  {
    name: "Feb",
    amount: 300,
  },
  {
    name: "Mar",
    amount: 200,
  },
  {
    name: "Apr",
    amount: 278,
  },
  {
    name: "May",
    amount: 189,
  },
  {
    name: "Jun",
    amount: 239,
  },
  {
    name: "Jul",
    amount: 349,
  },
];

export default function DashboardPayment() {
  return (
    <div
      className="p-5 bg-white rounded-xl"
      style={{ width: "100%", height: "300px" }}
    >
      <h2 className="text-[#4C4C4C] text-lg font-semibold mb-5">Reports</h2>
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={450}
            height={250}
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 30,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" />
            {/* <YAxis /> */}
            {/* <Tooltip /> */}
            {/* <Legend /> */}
            <Bar
              dataKey="amount"
              fill="#7DA1E8"
              radius={[5, 5, 0, 0]}
              width={10}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

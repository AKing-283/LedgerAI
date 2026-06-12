import {
 ResponsiveContainer,
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip
} from "recharts";

const data = [
 {
  month:"Jan",
  amount:12000
 },
 {
  month:"Feb",
  amount:18000
 },
 {
  month:"Mar",
  amount:14000
 },
 {
  month:"Apr",
  amount:24000
 }
];

function ExpenseChart() {
 return (

  <ResponsiveContainer
   width="100%"
   height={300}
  >

   <LineChart data={data}>

    <XAxis dataKey="month" />

    <YAxis />

    <Tooltip />

    <Line
     type="monotone"
     dataKey="amount"
    />

   </LineChart>

  </ResponsiveContainer>

 );
}

export default ExpenseChart;
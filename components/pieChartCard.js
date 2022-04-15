import {Card} from "antd";
import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartCard = ({
  data,
  backgroundColor,
  borderColor,
  labels,
  title,
}) => {
  const chartdata = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  return (
    <Card title={title} className="rounded-lg flex-card">
      <div className="w-8/12 flex items-center justify-center">
        <Pie data={chartdata} />
      </div>
    </Card>
  );
};

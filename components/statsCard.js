import {Card} from "antd";

export const StatsCard = ({size, count, label, color}) => {
  return (
    <Card className="zero-card-padding rounded-lg">
      <div
        style={{backgroundColor: color}}
        className={
          size === "large"
            ? "flex flex-col items-center p-4 rounded-lg"
            : "flex flex-col items-center p-4 rounded-lg"
        }
      >
        <span className={size === "large" ? "text-6xl mb-4" : "text-4xl mb-2"}>
          {count}
        </span>
        <span className={size === "large" ? "text-lg" : "text-lg"}>
          {label}
        </span>
      </div>
    </Card>
  );
};

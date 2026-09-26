import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { ForecastItem } from "../types/weather";
import { formatHour } from "../utils/weatherHelpers";

interface HourlyChartProps {
  items: ForecastItem[];
}

export function HourlyChart({ items }: HourlyChartProps) {
  // Recharts needs data in the form of an array of objects 
  // with keys corresponding to the fields to be read by the axes
  const chartData = items.map((item) => ({
    time: formatHour(item.dt_txt),
    temp: Math.round(item.main.temp),
  }));

  return (
    <div className="hourly-chart">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="time" fontSize={12} />
          <YAxis fontSize={12} unit="°C" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#4a90d9"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="hourly-chart_caption">24-hours Forecast</p>
    </div>
  );
}
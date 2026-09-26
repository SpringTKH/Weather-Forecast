import type { ForecastItem } from "../types/weather";
import { formatHour } from "../utils/weatherHelpers";

interface HourlyChartProps {
  items: ForecastItem[];
  timezone: number;
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export function HourlyChart({ items, timezone }: HourlyChartProps) {
  const svgWidth = 700;
  const svgHeight = 280;
  // Horizontal inset so edge points/labels are never clipped by the viewBox boundary.
  // The info-row items are absolutely positioned using the same x% → perfect alignment.
  const svgPaddingX = 40;
  const paddingTop = 55;
  const paddingBottom = 20;

  const temps = items.map((item) => item.main.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const tempRange = maxTemp - minTemp || 1;

  // Data runs from x=svgPaddingX to x=svgWidth-svgPaddingX (inset from both edges)
  const stepX = (svgWidth - 2 * svgPaddingX) / (items.length - 1);

  const points = items.map((item, index) => {
    const x = svgPaddingX + index * stepX;
    const normalizedTemp = (item.main.temp - minTemp) / tempRange;
    const y = paddingTop + (1 - normalizedTemp) * (svgHeight - paddingTop - paddingBottom);
    return { x, y, temp: item.main.temp };
  });

  const pathData = buildSmoothPath(points);

  return (
    <div className="hourly-chart">
      <p className="hourly-chart_title">24-hours Forecast</p>

      <div className="hourly-chart_scroll">
        <div className="hourly-chart_chart-area">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="hourly-chart_svg"
          >
            {/* Temp labels inside SVG — scale correctly with viewBox */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={paddingTop - 12}
                textAnchor="middle"
                fontSize="22"
                fontWeight="bold"
                fill="#333"
              >
                {Math.round(p.temp)}°
              </text>
            ))}

            <path
              d={pathData}
              fill="none"
              stroke="#e08a3e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="6" fill="#e08a3e" />
            ))}
          </svg>
        </div>

        {/* Info row: each item is absolutely positioned at the exact x% of its SVG point */}
        <div className="hourly-chart_info-row">
          {items.map((item, i) => (
            <div
              key={i}
              className="hourly-chart_info-item"
              style={{ left: `${(points[i].x / svgWidth) * 100}%` }}
            >
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                className="hourly-chart_icon"
              />
              <span className="hourly-chart_time">{formatHour(item.dt, timezone)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

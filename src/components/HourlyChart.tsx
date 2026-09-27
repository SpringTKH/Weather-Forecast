import type { ForecastItem } from "../types/weather";
import { formatHour } from "../utils/weatherHelpers";

interface HourlyChartProps {
  items: ForecastItem[];
  timezone: number;
}

// Convert a set of (x, y) coordinate points into a smooth Bézier curve SVG path string
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
  const svgHeight = 140;
  const paddingTop = 36;
  const paddingBottom = 16;
  const paddingX = 30; // Horizontal inset so the first/last label is never clipped by the SVG viewBox boundary

  const temps = items.map((item) => item.main.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const usableWidth = svgWidth - paddingX * 2; // The actual width used to distribute data points
  const stepX = usableWidth / (items.length - 1);

  const points = items.map((item, index) => {
    const x = paddingX + index * stepX; // Shift each point right by paddingX so it no longer touches the left edge
    const normalizedTemp = (item.main.temp - minTemp) / tempRange;
    const y = paddingTop + (1 - normalizedTemp) * (svgHeight - paddingTop - paddingBottom);
    return { x, y, temp: item.main.temp };
  });

  const pathData = buildSmoothPath(points);

  // Generate y-coordinates for a few evenly-spaced horizontal grid lines within the drawable area
  const gridLineCount = 4;
  const drawableTop = paddingTop;
  const drawableBottom = svgHeight - paddingBottom;
  const gridLines = Array.from({ length: gridLineCount }, (_, i) => {
    return drawableTop + (i / (gridLineCount - 1)) * (drawableBottom - drawableTop);
  });

  return (
    <div className="hourly-chart">
      <p className="hourly-chart_title">24-hours Forecast</p>

      <div className="hourly-chart_scroll">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="hourly-chart_svg"
        >
          {/* Background grid lines, drawn at the bottom layer, spanning the full width (including paddingX on both sides) */}
          {gridLines.map((y, i) => (
            <line
              key={`grid-${i}`}
              x1={0}
              y1={y}
              x2={svgWidth}
              y2={y}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
          ))}

          <path
            d={pathData}
            fill="none"
            stroke="#e08a3e"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#e08a3e" />
              {/* Temperature labels are drawn directly inside the SVG, so they always follow the dot's position and can never be misaligned or clipped by external CSS */}
              <text
                x={p.x}
                y={p.y - 14} // Fixed 14px above the dot, maintaining this relative distance regardless of dot position
                textAnchor="middle" // Center the text horizontally around the x-coordinate of the dot
                fontSize="18"
                fontWeight="bold"
                fill="#333"
              >
                {Math.round(p.temp)}°C
              </text>
            </g>
          ))}
        </svg>

        {/* Info row below: weather icon + time, laid out horizontally */}
        <div className="hourly-chart_info-row">
          {items.map((item, i) => (
            <div key={i} className="hourly-chart_info-item">
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                className="hourly-chart_icon"
              />
              <span className="hourly-chart_time">{formatHour(item.dt, timezone)}</span>
              <span className="hourly-chart_wind">{item.wind.speed.toFixed(1)} m/s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
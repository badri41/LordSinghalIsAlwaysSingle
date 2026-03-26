import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiBarChart2 } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './TrendChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function TrendChart({ data, metric = 'aqi', granularity = 'daily' }) {
  if (!data || data.length === 0) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = isLight ? '#4b5563' : '#6b7280';
  const tooltipBg = isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30,34,48,0.95)';
  const tooltipTitle = isLight ? '#1a1d26' : '#e8eaed';
  const tooltipBody = isLight ? '#4b5563' : '#9aa0b0';
  const legendColor = isLight ? '#4b5563' : '#9aa0b0';

  const metricLabel = metric === 'aqi' ? 'AQI' : metric === 'pm25' ? 'PM2.5' : 'PM10';
  const avgKey = metric === 'aqi' ? 'avgAqi' : metric === 'pm25' ? 'avgPm25' : 'avgPm10';
  const maxKey = metric === 'aqi' ? 'maxAqi' : metric === 'pm25' ? 'maxPm25' : 'maxPm10';
  const minKey = metric === 'aqi' ? 'minAqi' : metric === 'pm25' ? 'minPm25' : 'minPm10';

  const labels = data.map(d => {
    if (d.label) return d.label;
    const parts = d.date.split('-');
    return `${parseInt(parts[2])}/${parseInt(parts[1])}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: `Avg ${metricLabel}`,
        data: data.map(d => d.daily[avgKey]),
        borderColor: '#3b82f6',
        backgroundColor: isLight ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: granularity === 'monthly' ? 4 : granularity === 'weekly' ? 3 : 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
      {
        label: `Max ${metricLabel}`,
        data: data.map(d => d.daily[maxKey]),
        borderColor: 'rgba(239, 68, 68, 0.6)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: `Min ${metricLabel}`,
        data: data.map(d => d.daily[minKey]),
        borderColor: 'rgba(34, 197, 94, 0.6)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: legendColor,
          font: { size: 11, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'line',
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { size: 10 },
          maxTicksLimit: granularity === 'daily' ? 15 : 12,
          maxRotation: 45,
        },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 11 } },
        title: {
          display: true,
          text: metricLabel,
          color: tickColor,
          font: { size: 12, weight: '500' },
        },
      },
    },
  };

  const granLabel = granularity.charAt(0).toUpperCase() + granularity.slice(1);

  return (
    <div className="trend-chart">
      <div className="trend-header">
        <div className="trend-title">
          <FiBarChart2 className="icon" />
          {granLabel} {metricLabel} Trend
        </div>
      </div>
      <div className="trend-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

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
import { FiSun, FiMoon, FiTrendingUp } from 'react-icons/fi';
import { formatHour } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import './AqiLineChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function AqiLineChart({ dayData, metric = 'aqi' }) {
  if (!dayData || !dayData.hourly) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = isLight ? '#4b5563' : '#6b7280';
  const tooltipBg = isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30,34,48,0.95)';
  const tooltipTitle = isLight ? '#1a1d26' : '#e8eaed';
  const tooltipBody = isLight ? '#4b5563' : '#9aa0b0';

  const labels = dayData.hourly.map(h => formatHour(h.hour));
  const values = dayData.hourly.map(h => h[metric]);

  const metricLabel = metric === 'aqi' ? 'AQI' : metric === 'pm25' ? 'PM2.5' : 'PM10';

  const data = {
    labels,
    datasets: [
      {
        label: `${metricLabel} (Day)`,
        data: values.map((v, i) => (dayData.hourly[i].isDay ? v : null)),
        borderColor: '#f59e0b',
        backgroundColor: isLight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#f59e0b',
        pointHoverBorderColor: isLight ? '#fff' : '#fff',
        pointHoverBorderWidth: 2,
        spanGaps: false,
      },
      {
        label: `${metricLabel} (Night)`,
        data: values.map((v, i) => (!dayData.hourly[i].isDay ? v : null)),
        borderColor: '#e93f33',
        backgroundColor: isLight ? 'rgba(233, 63, 51, 0.12)' : 'rgba(233, 63, 51, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#e93f33',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        spanGaps: false,
      },
      {
        label: `${metricLabel} (Transition)`,
        data: values,
        borderColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(150,150,150,0.3)',
        borderWidth: 1,
        borderDash: [4, 4],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { weight: '600' },
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (item) => {
            if (item.dataset.label.includes('Transition')) return null;
            return `${item.dataset.label}: ${item.raw}`;
          },
        },
        filter: (item) => !item.dataset.label.includes('Transition'),
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawTicks: false },
        ticks: { color: tickColor, font: { size: 11 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: gridColor, drawTicks: false },
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

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <FiTrendingUp className="icon" />
          24-Hour {metricLabel} Trend
        </div>
        <div className="day-night-labels">
          <span className="day-label"><FiSun className="icon" /> Day</span>
          <span className="night-label"><FiMoon className="icon" /> Night</span>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

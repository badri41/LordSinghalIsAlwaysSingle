import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchHistoricalAqi } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import './HistoricalChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const yearColors = {
  2022: { bg: 'rgba(34,197,94,0.7)', border: '#22c55e' },
  2023: { bg: 'rgba(59,130,246,0.7)', border: '#3b82f6' },
  2024: { bg: 'rgba(139,92,246,0.7)', border: '#8b5cf6' },
  2025: { bg: 'rgba(6,182,212,0.7)', border: '#06b6d4' },
  2026: { bg: 'rgba(239,68,68,0.7)', border: '#ef4444' },
};

export default function HistoricalChart({ locationId, month, metric = 'aqi', locationName }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [historical, setHistorical] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadHistorical() {
      if (!locationId) {
        setHistorical([]);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await fetchHistoricalAqi({ cityId: locationId, month });
        if (!ignore) {
          setHistorical(response);
        }
      } catch (loadError) {
        if (!ignore) {
          setHistorical([]);
          setError(loadError.message || 'Failed to load historical data.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadHistorical();

    return () => {
      ignore = true;
    };
  }, [locationId, month]);

  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = isLight ? '#4b5563' : '#6b7280';
  const tooltipBg = isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30,34,48,0.95)';
  const tooltipTitle = isLight ? '#1a1d26' : '#e8eaed';
  const tooltipBody = isLight ? '#4b5563' : '#9aa0b0';
  const legendColor = isLight ? '#4b5563' : '#9aa0b0';

  const metricLabel = metric === 'aqi' ? 'AQI' : metric === 'pm25' ? 'PM2.5' : 'PM10';
  const metricKey = metric === 'aqi' ? 'avgAqi' : metric === 'pm25' ? 'avgPm25' : 'avgPm10';

  if (isLoading) {
    return (
      <div className="historical-chart">
        <div className="historical-header">
          <div className="historical-title">{months[month]} Air Quality Analysis</div>
          <div className="historical-subtitle">{locationName || 'All Regions'}, India</div>
        </div>
        <div className="historical-empty">Loading historical data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historical-chart">
        <div className="historical-header">
          <div className="historical-title">{months[month]} Air Quality Analysis</div>
          <div className="historical-subtitle">{locationName || 'All Regions'}, India</div>
        </div>
        <div className="historical-empty">{error}</div>
      </div>
    );
  }

  if (historical.length === 0) {
    return (
      <div className="historical-chart">
        <div className="historical-header">
          <div className="historical-title">{months[month]} Air Quality Analysis</div>
          <div className="historical-subtitle">{locationName || 'All Regions'}, India</div>
        </div>
        <div className="historical-empty">No historical data available.</div>
      </div>
    );
  }

  const data = {
    labels: historical.map(h => h.year.toString()),
    datasets: [
      {
        label: `Avg ${metricLabel}`,
        data: historical.map(h => h[metricKey]),
        backgroundColor: historical.map(h => yearColors[h.year]?.bg || 'rgba(150,150,150,0.7)'),
        borderColor: historical.map(h => yearColors[h.year]?.border || '#999'),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: legendColor,
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: () =>
            historical.map(h => ({
              text: h.year.toString(),
              fillStyle: yearColors[h.year]?.bg || '#999',
              strokeStyle: yearColors[h.year]?.border || '#999',
              lineWidth: 2,
              pointStyle: 'circle',
            })),
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
        ticks: { color: tickColor, font: { size: 12, family: 'Inter' } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 11 } },
        title: {
          display: true,
          text: `Average ${metricLabel}`,
          color: tickColor,
          font: { size: 12, weight: '500' },
        },
      },
    },
  };

  return (
    <div className="historical-chart">
      <div className="historical-header">
        <div className="historical-title">{months[month]} Air Quality Analysis</div>
        <div className="historical-subtitle">{locationName || 'All Regions'}, India</div>
      </div>
      <div className="historical-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

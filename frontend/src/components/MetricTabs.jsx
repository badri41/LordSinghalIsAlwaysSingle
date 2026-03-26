import { FiClock, FiWind, FiCloud, FiActivity } from 'react-icons/fi';
import './MetricTabs.css';

const tabs = [
  { id: 'aqi', label: 'AQI', icon: <FiWind className="tab-icon" /> },
  { id: 'pm25', label: 'PM2.5', icon: <FiCloud className="tab-icon" /> },
  { id: 'pm10', label: 'PM10', icon: <FiActivity className="tab-icon" /> },
];

export default function MetricTabs({ activeMetric, onMetricChange }) {
  return (
    <div className="metric-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`metric-tab ${activeMetric === tab.id ? 'active' : ''}`}
          onClick={() => onMetricChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import { getAqiCategory } from '../data/mockData';
import './AqiScale.css';

const segments = [
  { label: 'Good', range: '0–50', color: '#55a84f', width: 50 / 500 * 100 },
  { label: 'Moderate', range: '51–100', color: '#a3c853', width: 50 / 500 * 100 },
  { label: 'Poor', range: '101–150', color: '#fff833', width: 50 / 500 * 100 },
  { label: 'Unhealthy', range: '151–200', color: '#f29c33', width: 50 / 500 * 100 },
  { label: 'Severe', range: '201–300', color: '#e93f33', width: 100 / 500 * 100 },
  { label: 'Hazardous', range: '301+', color: '#af2d24', width: 200 / 500 * 100 },
];

export default function AqiScale({ currentAqi }) {
  const markerPos = Math.min(currentAqi / 500 * 100, 100);
  const cat = getAqiCategory(currentAqi);

  return (
    <div className="aqi-scale-container">
      <div className="aqi-scale-title">Air Quality Index Scale</div>
      <div className="aqi-scale-bar">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="aqi-scale-segment"
            style={{ width: `${seg.width}%`, background: seg.color }}
            title={`${seg.label}: ${seg.range}`}
          />
        ))}
        <div
          className="aqi-marker"
          style={{ left: `${markerPos}%`, background: cat.color }}
        />
        <div
          className="aqi-marker-value"
          style={{ left: `${markerPos}%` }}
        >
          AQI: {currentAqi} — {cat.label}
        </div>
      </div>
      <div className="aqi-scale-labels">
        {segments.map((seg, i) => (
          <div key={i} className="aqi-scale-label" style={{ width: `${seg.width}%` }}>
            <span className="label-name">{seg.label}</span>
            <span className="label-range">{seg.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

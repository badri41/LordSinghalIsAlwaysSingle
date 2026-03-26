import { formatHour, formatDate } from '../data/mockData';
import './SummaryPanel.css';

export default function SummaryPanel({ dayData, cityName }) {
  if (!dayData || !cityName) return null;

  const { dayTime, nightTime, date } = dayData;
  const fmtDate = formatDate(date);
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const fmtNextDate = formatDate(nextDate.toISOString().split('T')[0]);

  return (
    <div className="summary-panel">
      <div className="summary-label">24-Hour Summary</div>
      <p className="summary-text">
        In the last <strong>24 hours</strong>,{' '}
        <span className="highlight-city">{cityName}'s</span> AQI reached its{' '}
        <strong>highest</strong> point of{' '}
        <span className="highlight-high">{dayTime.maxAqi}</span> at{' '}
        <strong>{formatHour(dayTime.maxHour)}</strong> during the{' '}
        <strong>Day</strong>, while the <strong>lowest</strong> point,{' '}
        <span className="highlight-low">{dayTime.minAqi}</span>, was recorded at{' '}
        <strong>{formatHour(dayTime.minHour)}</strong> during the{' '}
        <strong>Day</strong> between {fmtDate} and {fmtNextDate}.
      </p>
    </div>
  );
}

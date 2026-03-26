import { FiSun, FiMoon, FiClock } from 'react-icons/fi';
import { formatHour, formatDate } from '../data/mockData';
import './DayNightCards.css';

export default function DayNightCards({ dayData }) {
  if (!dayData) return null;

  const { dayTime, nightTime, date } = dayData;
  const formattedDate = formatDate(date);

  return (
    <div className="daynight-cards">
      {/* Day Card */}
      <div className="daynight-card day">
        <div className="daynight-card-label">Day time</div>
        <div className="daynight-card-icon"><FiSun /></div>
        <div className="card-row">
          <div className="daynight-stat">
            <div className="daynight-stat-title">Avg. Highest Time</div>
            <div className="daynight-stat-row">
              <span className="daynight-time"><FiClock /> {formatHour(dayTime.maxHour)}</span>
              <span className="daynight-badge high">{dayTime.maxAqi}<small style={{fontSize:'0.6rem',marginLeft:2}}>AQI</small></span>
            </div>
            <div className="daynight-date">{formattedDate}</div>
          </div>
          <div className="daynight-stat">
            <div className="daynight-stat-title">Avg. Lowest Time</div>
            <div className="daynight-stat-row">
              <span className="daynight-time"><FiClock /> {formatHour(dayTime.minHour)}</span>
              <span className="daynight-badge low">{dayTime.minAqi}<small style={{fontSize:'0.6rem',marginLeft:2}}>AQI</small></span>
            </div>
            <div className="daynight-date">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Night Card */}
      <div className="daynight-card night">
        <div className="daynight-card-label">Night time</div>
        <div className="daynight-card-icon"><FiMoon /></div>
        <div className="card-row">
          <div className="daynight-stat">
            <div className="daynight-stat-title">Avg. Highest Time</div>
            <div className="daynight-stat-row">
              <span className="daynight-time"><FiClock /> {formatHour(nightTime.maxHour)}</span>
              <span className="daynight-badge high">{nightTime.maxAqi}<small style={{fontSize:'0.6rem',marginLeft:2}}>AQI</small></span>
            </div>
            <div className="daynight-date">{formattedDate}</div>
          </div>
          <div className="daynight-stat">
            <div className="daynight-stat-title">Avg. Lowest Time</div>
            <div className="daynight-stat-row">
              <span className="daynight-time"><FiClock /> {formatHour(nightTime.minHour)}</span>
              <span className="daynight-badge low">{nightTime.minAqi}<small style={{fontSize:'0.6rem',marginLeft:2}}>AQI</small></span>
            </div>
            <div className="daynight-date">{formattedDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

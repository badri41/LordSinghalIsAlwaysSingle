import { useEffect, useMemo, useState } from 'react';
import { FiMapPin, FiWind, FiTrendingDown } from 'react-icons/fi';
import { getAqiCategory } from '../data/mockData';
import { fetchOverviewStats } from '../services/api';
import './StatsOverview.css';

export default function StatsOverview({ onSelectCity }) {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOverview() {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetchOverviewStats();
        if (!ignore) {
          setStats(response);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || 'Failed to load overview data.');
          setStats([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      ignore = true;
    };
  }, []);

  const { avgAqi, worst, best } = useMemo(() => {
    if (stats.length === 0) {
      return { avgAqi: 0, worst: null, best: null };
    }

    return {
      avgAqi: Math.round(stats.reduce((sum, city) => sum + city.currentAqi, 0) / stats.length),
      worst: stats.reduce((prev, current) => (prev.currentAqi > current.currentAqi ? prev : current)),
      best: stats.reduce((prev, current) => (prev.currentAqi < current.currentAqi ? prev : current)),
    };
  }, [stats]);

  function getAqiClass(aqi) {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-poor';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-severe';
    return 'aqi-hazardous';
  }

  if (isLoading) {
    return (
      <div className="stats-overview-empty">Loading overview data...</div>
    );
  }

  if (error) {
    return (
      <div className="stats-overview-empty">{error}</div>
    );
  }

  if (stats.length === 0 || !worst || !best) {
    return (
      <div className="stats-overview-empty">No overview data available.</div>
    );
  }

  return (
    <>
      <div className="overview-summary">
        <div className="overview-summary-card gradient-1">
          <div className="overview-summary-icon"><FiWind /></div>
          <div className="overview-summary-value">{avgAqi}</div>
          <div className="overview-summary-label">Avg AQI Across {stats.length} Cities</div>
        </div>
        <div className="overview-summary-card gradient-2">
          <div className="overview-summary-icon"><FiTrendingDown style={{ transform: 'rotate(180deg)' }} /></div>
          <div className="overview-summary-value">{worst.currentAqi}</div>
          <div className="overview-summary-label">Worst: {worst.name}</div>
        </div>
        <div className="overview-summary-card gradient-3">
          <div className="overview-summary-icon"><FiTrendingDown /></div>
          <div className="overview-summary-value">{best.currentAqi}</div>
          <div className="overview-summary-label">Best: {best.name}</div>
        </div>
      </div>

      <div className="section-title"><FiMapPin className="icon" /> Regional Air Quality</div>
      <div className="stats-overview">
        {stats.map((city, i) => {
          const cat = getAqiCategory(city.currentAqi);
          return (
            <div
              key={city.id}
              className={`stat-card ${getAqiClass(city.currentAqi)}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => onSelectCity(city.id)}
            >
              <div className="stat-card-header">
                <div>
                  <div className="stat-city-name">{city.name}</div>
                  <div className="stat-city-state">{city.state}</div>
                </div>
                <div className="stat-aqi-badge" style={{ background: cat.color }}>
                  {city.currentAqi}
                  <small>AQI</small>
                </div>
              </div>
              <div className="stat-metrics">
                <div className="stat-metric">
                  <div className="stat-metric-label">PM2.5</div>
                  <div className="stat-metric-value">{city.currentPm25} <span className="stat-metric-unit">µg/m³</span></div>
                </div>
                <div className="stat-metric">
                  <div className="stat-metric-label">PM10</div>
                  <div className="stat-metric-value">{city.currentPm10} <span className="stat-metric-unit">µg/m³</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

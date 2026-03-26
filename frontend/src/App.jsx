import { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import MetricTabs from './components/MetricTabs';
import AqiScale from './components/AqiScale';
import AqiLineChart from './components/AqiLineChart';
import DayNightCards from './components/DayNightCards';
import TrendChart from './components/TrendChart';
import HistoricalChart from './components/HistoricalChart';
import SummaryPanel from './components/SummaryPanel';
import StatsOverview from './components/StatsOverview';
import { locations, getDailyData, aggregateWeekly, aggregateMonthly } from './data/mockData';
import './App.css';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(2); // March
  const [selectedYear, setSelectedYear] = useState(2026);
  const [granularity, setGranularity] = useState('daily');
  const [activeMetric, setActiveMetric] = useState('aqi');

  const location = useMemo(
    () => locations.find(l => l.id === selectedLocation),
    [selectedLocation]
  );

  // Build the date range for selected month/year
  const dateRange = useMemo(() => {
    const daysInMonth = selectedYear === 2026 && selectedMonth === 2
      ? 26
      : new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const start = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
    const end = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    return { start, end };
  }, [selectedMonth, selectedYear]);

  // Get data for current selection
  const dailyData = useMemo(() => {
    if (!selectedLocation) return [];
    return getDailyData(selectedLocation, dateRange.start, dateRange.end);
  }, [selectedLocation, dateRange]);

  const aggregatedData = useMemo(() => {
    if (granularity === 'weekly') return aggregateWeekly(dailyData);
    if (granularity === 'monthly') return aggregateMonthly(dailyData);
    return dailyData;
  }, [dailyData, granularity]);

  // Latest day data for 24-hour chart
  const latestDayData = useMemo(() => {
    if (dailyData.length === 0) return null;
    return dailyData[dailyData.length - 1];
  }, [dailyData]);

  // Current AQI for scale
  const currentAqi = latestDayData?.daily?.avgAqi || 0;

  function handleSelectCity(cityId) {
    setSelectedLocation(cityId);
  }

  function handleYearChange(year) {
    setSelectedYear(year);
    // Clamp month if 2026
    if (year === 2026 && selectedMonth > 2) {
      setSelectedMonth(2);
    }
  }

  return (
    <div className="app">
      <Header location={location} />
      <main className="app-content">
        <FilterBar
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          granularity={granularity}
          onGranularityChange={setGranularity}
        />

        {!selectedLocation ? (
          /* Landing: Overview of all regions */
          <StatsOverview onSelectCity={handleSelectCity} />
        ) : (
          /* City detail view */
          <div className="city-detail fade-in">
            <div className="city-detail-header">
              <h2 className="city-title">
                <span className="city-name-highlight">{location?.name}, {location?.state}</span>
                {' '}Historical Air Quality Analysis
              </h2>
              <p className="city-subtitle">
                Dive into detailed Air Quality Insights with historical data, monthly patterns, and yearly trends at your fingertips!
              </p>
            </div>

            <AqiScale currentAqi={currentAqi} />

            <MetricTabs activeMetric={activeMetric} onMetricChange={setActiveMetric} />

            {/* 24-hour chart + Day/Night cards */}
            <div className="chart-daynight-grid">
              <div className="chart-col">
                <AqiLineChart dayData={latestDayData} metric={activeMetric} />
              </div>
              <div className="cards-col">
                <DayNightCards dayData={latestDayData} />
              </div>
            </div>

            <SummaryPanel dayData={latestDayData} cityName={location?.name} />

            {/* Trend chart based on granularity */}
            <TrendChart
              data={aggregatedData}
              metric={activeMetric}
              granularity={granularity}
            />

            {/* Historical multi-year comparison */}
            <HistoricalChart
              locationId={selectedLocation}
              month={selectedMonth}
              metric={activeMetric}
              locationName={`${location?.name}, ${location?.state}`}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span>© 2026 AirPulse — Pollution Monitoring Dashboard</span>
          <span className="footer-links">
            Data is simulated for demonstration purposes
          </span>
        </div>
      </footer>
    </div>
  );
}

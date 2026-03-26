// 8 Indian cities with baseline pollution profiles
export const locations = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi', baseline: { aqi: 180, pm25: 90, pm10: 160 } },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', baseline: { aqi: 120, pm25: 55, pm10: 100 } },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', baseline: { aqi: 140, pm25: 70, pm10: 130 } },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', baseline: { aqi: 85, pm25: 35, pm10: 70 } },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', baseline: { aqi: 95, pm25: 40, pm10: 80 } },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', baseline: { aqi: 110, pm25: 50, pm10: 95 } },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', baseline: { aqi: 130, pm25: 60, pm10: 110 } },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', baseline: { aqi: 170, pm25: 85, pm10: 150 } },
];

// Seeded random for reproducibility
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Seasonal multiplier (winter = worse, monsoon = better)
function seasonalMultiplier(month) {
  const multipliers = [1.4, 1.3, 1.1, 0.9, 0.85, 0.7, 0.6, 0.65, 0.75, 0.95, 1.2, 1.45];
  return multipliers[month];
}

// Generate hourly data for a single day
function generateHourlyData(baseline, date, rand) {
  const month = date.getMonth();
  const seasonal = seasonalMultiplier(month);
  const hours = [];

  for (let h = 0; h < 24; h++) {
    // Diurnal pattern: worse in morning rush (7-10) and evening (18-21)
    let diurnal = 1.0;
    if (h >= 7 && h <= 10) diurnal = 1.25;
    else if (h >= 18 && h <= 21) diurnal = 1.2;
    else if (h >= 1 && h <= 5) diurnal = 0.8;
    else if (h >= 12 && h <= 15) diurnal = 0.9;

    const noise = 0.8 + rand() * 0.4;
    const aqi = Math.round(baseline.aqi * seasonal * diurnal * noise);
    const pm25 = Math.round(baseline.pm25 * seasonal * diurnal * noise);
    const pm10 = Math.round(baseline.pm10 * seasonal * diurnal * noise);

    hours.push({
      hour: h,
      aqi: Math.max(10, Math.min(500, aqi)),
      pm25: Math.max(5, Math.min(500, pm25)),
      pm10: Math.max(10, Math.min(600, pm10)),
      isDay: h >= 6 && h < 18,
    });
  }
  return hours;
}

// Generate all daily data for a location
function generateLocationData(location) {
  const rand = seededRandom(location.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const data = {};
  const startYear = 2022;
  const endYear = 2026;

  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = year === 2026 ? 2 : 11; // Up to March 2026
    for (let month = 0; month <= maxMonth; month++) {
      const maxDay = year === 2026 && month === 2 ? 26 : new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= maxDay; day++) {
        const date = new Date(year, month, day);
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Yearly trend: slight improvement each year
        const yearFactor = 1 - (year - startYear) * 0.03;
        const adjustedBaseline = {
          aqi: Math.round(location.baseline.aqi * yearFactor),
          pm25: Math.round(location.baseline.pm25 * yearFactor),
          pm10: Math.round(location.baseline.pm10 * yearFactor),
        };

        const hourly = generateHourlyData(adjustedBaseline, date, rand);
        const dayHours = hourly.filter(h => h.isDay);
        const nightHours = hourly.filter(h => !h.isDay);

        data[key] = {
          date: key,
          hourly,
          daily: {
            avgAqi: Math.round(hourly.reduce((s, h) => s + h.aqi, 0) / 24),
            avgPm25: Math.round(hourly.reduce((s, h) => s + h.pm25, 0) / 24),
            avgPm10: Math.round(hourly.reduce((s, h) => s + h.pm10, 0) / 24),
            maxAqi: Math.max(...hourly.map(h => h.aqi)),
            minAqi: Math.min(...hourly.map(h => h.aqi)),
            maxPm25: Math.max(...hourly.map(h => h.pm25)),
            minPm25: Math.min(...hourly.map(h => h.pm25)),
            maxPm10: Math.max(...hourly.map(h => h.pm10)),
            minPm10: Math.min(...hourly.map(h => h.pm10)),
          },
          dayTime: {
            avgAqi: Math.round(dayHours.reduce((s, h) => s + h.aqi, 0) / dayHours.length),
            maxAqi: Math.max(...dayHours.map(h => h.aqi)),
            minAqi: Math.min(...dayHours.map(h => h.aqi)),
            maxHour: dayHours.reduce((a, b) => a.aqi > b.aqi ? a : b).hour,
            minHour: dayHours.reduce((a, b) => a.aqi < b.aqi ? a : b).hour,
          },
          nightTime: {
            avgAqi: Math.round(nightHours.reduce((s, h) => s + h.aqi, 0) / nightHours.length),
            maxAqi: Math.max(...nightHours.map(h => h.aqi)),
            minAqi: Math.min(...nightHours.map(h => h.aqi)),
            maxHour: nightHours.reduce((a, b) => a.aqi > b.aqi ? a : b).hour,
            minHour: nightHours.reduce((a, b) => a.aqi < b.aqi ? a : b).hour,
          },
        };
      }
    }
  }
  return data;
}

// Cache
const cache = {};
function getLocationData(locationId) {
  if (!cache[locationId]) {
    const loc = locations.find(l => l.id === locationId);
    if (loc) cache[locationId] = generateLocationData(loc);
  }
  return cache[locationId] || {};
}

// Get daily data for a date range
export function getDailyData(locationId, startDate, endDate) {
  const data = getLocationData(locationId);
  const result = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    if (data[key]) result.push(data[key]);
    current.setDate(current.getDate() + 1);
  }
  return result;
}

// Aggregate weekly
export function aggregateWeekly(dailyData) {
  const weeks = [];
  for (let i = 0; i < dailyData.length; i += 7) {
    const chunk = dailyData.slice(i, i + 7);
    if (chunk.length === 0) continue;
    weeks.push({
      date: chunk[0].date,
      dateEnd: chunk[chunk.length - 1].date,
      label: `${chunk[0].date} – ${chunk[chunk.length - 1].date}`,
      daily: {
        avgAqi: Math.round(chunk.reduce((s, d) => s + d.daily.avgAqi, 0) / chunk.length),
        avgPm25: Math.round(chunk.reduce((s, d) => s + d.daily.avgPm25, 0) / chunk.length),
        avgPm10: Math.round(chunk.reduce((s, d) => s + d.daily.avgPm10, 0) / chunk.length),
        maxAqi: Math.max(...chunk.map(d => d.daily.maxAqi)),
        minAqi: Math.min(...chunk.map(d => d.daily.minAqi)),
        maxPm25: Math.max(...chunk.map(d => d.daily.maxPm25)),
        minPm25: Math.min(...chunk.map(d => d.daily.minPm25)),
        maxPm10: Math.max(...chunk.map(d => d.daily.maxPm10)),
        minPm10: Math.min(...chunk.map(d => d.daily.minPm10)),
      },
    });
  }
  return weeks;
}

// Aggregate monthly
export function aggregateMonthly(dailyData) {
  const months = {};
  dailyData.forEach(d => {
    const key = d.date.substring(0, 7);
    if (!months[key]) months[key] = [];
    months[key].push(d);
  });

  return Object.entries(months).map(([key, chunk]) => ({
    date: key + '-01',
    label: key,
    daily: {
      avgAqi: Math.round(chunk.reduce((s, d) => s + d.daily.avgAqi, 0) / chunk.length),
      avgPm25: Math.round(chunk.reduce((s, d) => s + d.daily.avgPm25, 0) / chunk.length),
      avgPm10: Math.round(chunk.reduce((s, d) => s + d.daily.avgPm10, 0) / chunk.length),
      maxAqi: Math.max(...chunk.map(d => d.daily.maxAqi)),
      minAqi: Math.min(...chunk.map(d => d.daily.minAqi)),
      maxPm25: Math.max(...chunk.map(d => d.daily.maxPm25)),
      minPm25: Math.min(...chunk.map(d => d.daily.minPm25)),
      maxPm10: Math.max(...chunk.map(d => d.daily.maxPm10)),
      minPm10: Math.min(...chunk.map(d => d.daily.minPm10)),
    },
  }));
}

// Get historical monthly averages for multi-year comparison
export function getHistoricalMonthly(locationId, month) {
  const data = getLocationData(locationId);
  const years = [2022, 2023, 2024, 2025, 2026];
  return years.map(year => {
    const daysInMonth = year === 2026 && month > 2 ? 0 : new Date(year, month + 1, 0).getDate();
    const maxDay = year === 2026 && month === 2 ? 26 : daysInMonth;
    let totalAqi = 0, totalPm25 = 0, totalPm10 = 0, count = 0;

    for (let d = 1; d <= maxDay; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (data[key]) {
        totalAqi += data[key].daily.avgAqi;
        totalPm25 += data[key].daily.avgPm25;
        totalPm10 += data[key].daily.avgPm10;
        count++;
      }
    }
    return {
      year,
      avgAqi: count ? Math.round(totalAqi / count) : null,
      avgPm25: count ? Math.round(totalPm25 / count) : null,
      avgPm10: count ? Math.round(totalPm10 / count) : null,
    };
  }).filter(d => d.avgAqi !== null);
}

// Overview stats for all regions
export function getOverviewStats() {
  return locations.map(loc => {
    const data = getLocationData(loc.id);
    // Use latest available date (March 26, 2026)
    const latestKey = '2026-03-26';
    const latest = data[latestKey] || data['2026-03-25'] || Object.values(data).pop();

    // Monthly average for current month
    const currentMonthKeys = Object.keys(data).filter(k => k.startsWith('2026-03'));
    const monthAvg = {
      aqi: Math.round(currentMonthKeys.reduce((s, k) => s + data[k].daily.avgAqi, 0) / currentMonthKeys.length),
      pm25: Math.round(currentMonthKeys.reduce((s, k) => s + data[k].daily.avgPm25, 0) / currentMonthKeys.length),
      pm10: Math.round(currentMonthKeys.reduce((s, k) => s + data[k].daily.avgPm10, 0) / currentMonthKeys.length),
    };

    return {
      ...loc,
      currentAqi: latest?.daily.avgAqi || 0,
      currentPm25: latest?.daily.avgPm25 || 0,
      currentPm10: latest?.daily.avgPm10 || 0,
      monthAvg,
    };
  });
}

// AQI category helpers
export function getAqiCategory(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#55a84f', bg: 'rgba(85,168,79,0.15)' };
  if (aqi <= 100) return { label: 'Moderate', color: '#a3c853', bg: 'rgba(163,200,83,0.15)' };
  if (aqi <= 150) return { label: 'Poor', color: '#fff833', bg: 'rgba(255,248,51,0.15)' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#f29c33', bg: 'rgba(242,156,51,0.15)' };
  if (aqi <= 300) return { label: 'Severe', color: '#e93f33', bg: 'rgba(233,63,51,0.15)' };
  return { label: 'Hazardous', color: '#af2d24', bg: 'rgba(175,45,36,0.15)' };
}

export function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function aggregateWeekly(dailyData) {
  const weeks = [];

  for (let index = 0; index < dailyData.length; index += 7) {
    const chunk = dailyData.slice(index, index + 7);
    if (chunk.length === 0) continue;

    weeks.push({
      date: chunk[0].date,
      dateEnd: chunk[chunk.length - 1].date,
      label: `${chunk[0].date} - ${chunk[chunk.length - 1].date}`,
      daily: {
        avgAqi: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgAqi, 0) / chunk.length),
        avgPm25: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgPm25, 0) / chunk.length),
        avgPm10: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgPm10, 0) / chunk.length),
        maxAqi: Math.max(...chunk.map(day => day.daily.maxAqi)),
        minAqi: Math.min(...chunk.map(day => day.daily.minAqi)),
        maxPm25: Math.max(...chunk.map(day => day.daily.maxPm25)),
        minPm25: Math.min(...chunk.map(day => day.daily.minPm25)),
        maxPm10: Math.max(...chunk.map(day => day.daily.maxPm10)),
        minPm10: Math.min(...chunk.map(day => day.daily.minPm10)),
      },
    });
  }

  return weeks;
}

export function aggregateMonthly(dailyData) {
  const months = {};

  dailyData.forEach(day => {
    const monthKey = day.date.substring(0, 7);
    if (!months[monthKey]) {
      months[monthKey] = [];
    }
    months[monthKey].push(day);
  });

  return Object.entries(months).map(([monthKey, chunk]) => ({
    date: `${monthKey}-01`,
    label: monthKey,
    daily: {
      avgAqi: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgAqi, 0) / chunk.length),
      avgPm25: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgPm25, 0) / chunk.length),
      avgPm10: Math.round(chunk.reduce((sum, day) => sum + day.daily.avgPm10, 0) / chunk.length),
      maxAqi: Math.max(...chunk.map(day => day.daily.maxAqi)),
      minAqi: Math.min(...chunk.map(day => day.daily.minAqi)),
      maxPm25: Math.max(...chunk.map(day => day.daily.maxPm25)),
      minPm25: Math.min(...chunk.map(day => day.daily.minPm25)),
      maxPm10: Math.max(...chunk.map(day => day.daily.maxPm10)),
      minPm10: Math.min(...chunk.map(day => day.daily.minPm10)),
    },
  }));
}

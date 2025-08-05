import { SoilDataPoint, TrendIndicator, WeeklyReport } from "@/types/soil";

export const generateMockSoilData = (days: number = 90): SoilDataPoint[] => {
  const data: SoilDataPoint[] = [];
  const now = new Date();
  
  // Base values
  let moisture = 65;
  let ph = 6.8;
  let temperature = 22;
  let nutrients = 75;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Add some realistic variation and trends
    moisture += (Math.random() - 0.5) * 10;
    moisture = Math.max(20, Math.min(100, moisture));
    
    ph += (Math.random() - 0.5) * 0.3;
    ph = Math.max(5.0, Math.min(8.0, ph));
    
    temperature += (Math.random() - 0.5) * 4;
    temperature = Math.max(10, Math.min(35, temperature));
    
    nutrients += (Math.random() - 0.5) * 8;
    nutrients = Math.max(30, Math.min(100, nutrients));
    
    // Seasonal trends
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI);
    
    temperature += seasonalFactor * 5;
    moisture -= seasonalFactor * 10;
    
    data.push({
      date: date.toISOString().split('T')[0],
      moisture: Math.round(moisture * 10) / 10,
      ph: Math.round(ph * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      nutrients: Math.round(nutrients * 10) / 10,
    });
  }
  
  return data;
};

export const calculateTrends = (data: SoilDataPoint[]): {
  moisture: TrendIndicator;
  ph: TrendIndicator;
  temperature: TrendIndicator;
  nutrients: TrendIndicator;
} => {
  if (data.length < 2) {
    return {
      moisture: { type: 'stable', value: 0, percentage: 0 },
      ph: { type: 'stable', value: 0, percentage: 0 },
      temperature: { type: 'stable', value: 0, percentage: 0 },
      nutrients: { type: 'stable', value: 0, percentage: 0 },
    };
  }
  
  const calculateTrend = (values: number[]): TrendIndicator => {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = secondAvg - firstAvg;
    const percentage = (change / firstAvg) * 100;
    
    let type: 'improving' | 'stable' | 'declining';
    if (Math.abs(percentage) < 2) {
      type = 'stable';
    } else if (percentage > 0) {
      type = 'improving';
    } else {
      type = 'declining';
    }
    
    return {
      type,
      value: change,
      percentage: Math.round(percentage * 10) / 10,
    };
  };
  
  return {
    moisture: calculateTrend(data.map(d => d.moisture)),
    ph: calculateTrend(data.map(d => d.ph)),
    temperature: calculateTrend(data.map(d => d.temperature)),
    nutrients: calculateTrend(data.map(d => d.nutrients)),
  };
};

export const generateMockAlerts = (soilData?: { moisture: number; ph: number; temperature: number; nutrients: number }) => {
  const alerts = [];
  const now = new Date();

  // Generate alerts based on current soil conditions
  if (soilData) {
    // Low moisture alert
    if (soilData.moisture < 50) {
      alerts.push({
        id: 'alert-moisture',
        type: 'lowMoisture' as const,
        severity: soilData.moisture < 30 ? 'high' as const : 'medium' as const,
        title: 'Low Moisture Alert',
        message: 'Soil moisture is below optimal levels',
        action: 'Water Garden',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,
      });
    }

    // pH imbalance alert
    if (soilData.ph < 6.0 || soilData.ph > 7.5) {
      alerts.push({
        id: 'alert-ph',
        type: 'phImbalance' as const,
        severity: (soilData.ph < 5.5 || soilData.ph > 8.0) ? 'high' as const : 'medium' as const,
        title: 'pH Imbalance',
        message: 'Soil pH is outside optimal range',
        action: 'Adjust pH',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
      });
    }

    // Temperature extreme alert
    if (soilData.temperature < 15 || soilData.temperature > 30) {
      alerts.push({
        id: 'alert-temp',
        type: 'tempExtreme' as const,
        severity: (soilData.temperature < 10 || soilData.temperature > 35) ? 'high' as const : 'medium' as const,
        title: 'Temperature Alert',
        message: 'Soil temperature is outside optimal range',
        action: 'Monitor Temperature',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
      });
    }

    // Low nutrients alert
    if (soilData.nutrients < 60) {
      alerts.push({
        id: 'alert-nutrients',
        type: 'lowNutrients' as const,
        severity: soilData.nutrients < 40 ? 'high' as const : 'low' as const,
        title: 'Low Nutrients',
        message: 'Nutrient levels are below recommended values',
        action: 'Apply Fertilizer',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: soilData.nutrients > 50, // Mark as read if not too critical
      });
    }
  } else {
    // Generate some random sample alerts for demo
    if (Math.random() > 0.6) {
      alerts.push({
        id: 'alert-demo-1',
        type: 'lowMoisture' as const,
        severity: 'high' as const,
        title: 'Low Moisture Alert',
        message: 'Soil moisture is below optimal levels',
        action: 'Water Garden',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        isRead: false,
      });
    }

    if (Math.random() > 0.8) {
      alerts.push({
        id: 'alert-demo-2',
        type: 'phImbalance' as const,
        severity: 'medium' as const,
        title: 'pH Imbalance',
        message: 'Soil pH is outside optimal range',
        action: 'Adjust pH',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        isRead: false,
      });
    }
  }

  return alerts;
};

export const generateMockWeeklyReport = (historicalData: SoilDataPoint[]): WeeklyReport => {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekEnd = now;

  // Get last week's data
  const weekData = historicalData.filter(point => {
    const date = new Date(point.date);
    return date >= weekStart && date <= weekEnd;
  });

  // Calculate averages (with fallback for empty data)
  const summary = weekData.length > 0 ? {
    averageMoisture: weekData.reduce((sum, d) => sum + d.moisture, 0) / weekData.length,
    averagePh: weekData.reduce((sum, d) => sum + d.ph, 0) / weekData.length,
    averageTemperature: weekData.reduce((sum, d) => sum + d.temperature, 0) / weekData.length,
    averageNutrients: weekData.reduce((sum, d) => sum + d.nutrients, 0) / weekData.length,
  } : {
    averageMoisture: 65,
    averagePh: 6.8,
    averageTemperature: 22,
    averageNutrients: 75,
  };

  // Calculate trends
  const trends = calculateTrends(weekData);

  // Generate achievements based on performance
  const achievements = [];
  if (summary.averageMoisture > 70) achievements.push("Water Master - Kept soil perfectly moist!");
  if (summary.averagePh >= 6.0 && summary.averagePh <= 7.0) achievements.push("pH Perfect - Balanced soil chemistry!");
  if (summary.averageTemperature >= 18 && summary.averageTemperature <= 25) achievements.push("Temperature Keeper - Ideal growing conditions!");
  if (summary.averageNutrients > 75) achievements.push("Plant Feeder - Well-nourished garden!");
  if (trends.moisture.type === 'improving') achievements.push("Improvement Expert - Moisture levels getting better!");

  // Generate recommendations
  const recommendations = [];
  if (summary.averageMoisture < 50) {
    recommendations.push("Increase watering frequency to maintain optimal soil moisture levels.");
  }
  if (summary.averagePh < 6.0) {
    recommendations.push("Consider adding lime to raise soil pH to optimal range (6.0-7.0).");
  } else if (summary.averagePh > 7.5) {
    recommendations.push("Consider adding organic matter to lower soil pH to optimal range.");
  }
  if (summary.averageNutrients < 60) {
    recommendations.push("Apply balanced organic fertilizer to boost nutrient levels.");
  }
  if (summary.averageTemperature < 15) {
    recommendations.push("Consider using mulch to help regulate soil temperature.");
  }

  // Generate upcoming tasks
  const upcomingTasks = [
    "Check soil moisture levels daily",
    "Apply organic compost to improve soil structure",
    "Monitor plant growth and health indicators",
    "Test soil pH levels mid-week",
    "Inspect for pest activity and plant diseases"
  ];

  return {
    id: `report-${Date.now()}`,
    weekStart,
    weekEnd,
    summary,
    trends,
    achievements: achievements.length > 0 ? achievements : ["Garden Explorer - Learning every day!"],
    recommendations: recommendations.length > 0 ? recommendations : ["Your garden is performing well! Keep up the great work."],
    upcomingTasks: upcomingTasks.slice(0, 3) // Limit to 3 tasks
  };
};

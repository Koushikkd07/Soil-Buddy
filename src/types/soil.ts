export interface SoilData {
  moisture: number;
  ph: number;
  temperature: number;
  nutrients: number;
  timestamp: Date;
}

export interface SoilDataPoint {
  date: string;
  moisture: number;
  ph: number;
  temperature: number;
  nutrients: number;
}

export interface TrendIndicator {
  type: 'improving' | 'stable' | 'declining';
  value: number;
  percentage: number;
}

export interface Alert {
  id: string;
  type: 'lowMoisture' | 'phImbalance' | 'tempExtreme' | 'lowNutrients';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action: string;
  timestamp: Date;
  isRead: boolean;
}

export interface WeeklyReport {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  summary: {
    averageMoisture: number;
    averagePh: number;
    averageTemperature: number;
    averageNutrients: number;
  };
  trends: {
    moisture: TrendIndicator;
    ph: TrendIndicator;
    temperature: TrendIndicator;
    nutrients: TrendIndicator;
  };
  achievements: string[];
  recommendations: string[];
  upcomingTasks: string[];
}

export type TimePeriod = '7days' | '30days' | '90days';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

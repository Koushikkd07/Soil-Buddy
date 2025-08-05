import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Info } from "lucide-react";
import { SoilDataPoint, TimePeriod, TrendIndicator, ChartTooltipProps } from "@/types/soil";

interface ElderTrendChartProps {
  data: SoilDataPoint[];
  trends: {
    moisture: TrendIndicator;
    ph: TrendIndicator;
    temperature: TrendIndicator;
    nutrients: TrendIndicator;
  };
}

const ElderTrendChart = ({ data, trends }: ElderTrendChartProps) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7days');
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  const getFilteredData = () => {
    const now = new Date();
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  };

  const getTrendIcon = (trend: TrendIndicator) => {
    switch (trend.type) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-warning" />;
    }
  };

  const getTrendColor = (trend: TrendIndicator) => {
    switch (trend.type) {
      case 'improving':
        return "success";
      case 'declining':
        return "destructive";
      default:
        return "warning";
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'moisture':
        return "#2563EB"; // blue-600
      case 'ph':
        return "#7C3AED"; // violet-600
      case 'temperature':
        return "#DC2626"; // red-600
      case 'nutrients':
        return "#059669"; // emerald-600
      default:
        return "#6B7280";
    }
  };

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      const date = new Date(label || '').toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      return (
        <div className="bg-white p-4 border border-border rounded-lg shadow-lg">
          <p className="font-semibold text-lg mb-2">{date}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {t(`elderDashboard.trends.tooltips.${entry.dataKey}`, { 
                  value: entry.value, 
                  date 
                })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const filteredData = getFilteredData();

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <BarChart3 className="h-8 w-8 text-elder-primary" />
          <span>{t('elderDashboard.trends.title')}</span>
        </CardTitle>
        <p className="text-lg text-muted-foreground">{t('elderDashboard.trends.subtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {(['7days', '30days', '90days'] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "elder" : "outline"}
                size="lg"
                onClick={() => setSelectedPeriod(period)}
                className="text-base"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t(`elderDashboard.trends.periods.${period}`)}
              </Button>
            ))}
          </div>
          <Button
            variant={showAllMetrics ? "elder" : "outline"}
            size="lg"
            onClick={() => setShowAllMetrics(!showAllMetrics)}
            className="text-base"
          >
            <Info className="h-5 w-5 mr-2" />
            {showAllMetrics ? "Single Metric" : "All Metrics"}
          </Button>
        </div>

        <Separator />

        {/* Trend Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(trends).map(([metric, trend]) => (
            <div key={metric} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">
                  {t(`elderDashboard.metrics.${metric}`)}
                </span>
                {getTrendIcon(trend)}
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={getTrendColor(trend) as any}
                  className="text-sm px-3 py-1"
                >
                  {t(`elderDashboard.trends.indicators.${trend.type}`)}
                </Badge>
                <span className="text-lg font-bold">
                  {trend.percentage > 0 ? '+' : ''}{trend.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 14 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip content={<CustomTooltip />} />
              {showAllMetrics && <Legend />}
              
              {showAllMetrics ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke={getMetricColor('moisture')}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Moisture (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke={getMetricColor('ph')}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="pH Level"
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={getMetricColor('temperature')}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="nutrients"
                    stroke={getMetricColor('nutrients')}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Nutrients (%)"
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke={getMetricColor('moisture')}
                  strokeWidth={3}
                  dot={{ fill: getMetricColor('moisture'), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getMetricColor('moisture'), strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">Data Summary ({selectedPeriod})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Avg Moisture:</span>
              <span className="ml-2 font-semibold">
                {(filteredData.reduce((sum, d) => sum + d.moisture, 0) / filteredData.length).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg pH:</span>
              <span className="ml-2 font-semibold">
                {(filteredData.reduce((sum, d) => sum + d.ph, 0) / filteredData.length).toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Temp:</span>
              <span className="ml-2 font-semibold">
                {(filteredData.reduce((sum, d) => sum + d.temperature, 0) / filteredData.length).toFixed(1)}°C
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Nutrients:</span>
              <span className="ml-2 font-semibold">
                {(filteredData.reduce((sum, d) => sum + d.nutrients, 0) / filteredData.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElderTrendChart;

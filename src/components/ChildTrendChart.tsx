import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { SoilDataPoint, TimePeriod, TrendIndicator, ChartTooltipProps } from "@/types/soil";

interface ChildTrendChartProps {
  data: SoilDataPoint[];
  trends: {
    moisture: TrendIndicator;
    ph: TrendIndicator;
    temperature: TrendIndicator;
    nutrients: TrendIndicator;
  };
}

const ChildTrendChart = ({ data, trends }: ChildTrendChartProps) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7days');
  const [selectedMetric, setSelectedMetric] = useState<'moisture' | 'ph' | 'temperature' | 'nutrients'>('moisture');

  const getFilteredData = () => {
    const now = new Date();
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  };

  const getTrendIcon = (trend: TrendIndicator) => {
    switch (trend.type) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendEmoji = (trend: TrendIndicator) => {
    switch (trend.type) {
      case 'improving':
        return "📈";
      case 'declining':
        return "📉";
      default:
        return "➡️";
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'moisture':
        return "#3B82F6"; // blue
      case 'ph':
        return "#8B5CF6"; // purple
      case 'temperature':
        return "#F97316"; // orange
      case 'nutrients':
        return "#10B981"; // green
      default:
        return "#6B7280";
    }
  };

  const getMetricEmoji = (metric: string) => {
    switch (metric) {
      case 'moisture':
        return "💧";
      case 'ph':
        return "🧪";
      case 'temperature':
        return "🌡️";
      case 'nutrients':
        return "🍎";
      default:
        return "📊";
    }
  };

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const date = new Date(label || '').toLocaleDateString();
      
      return (
        <div className="bg-white p-3 border-2 border-child-primary rounded-lg shadow-lg">
          <p className="text-sm font-bold text-child-primary">
            {getMetricEmoji(selectedMetric)} {t(`childDashboard.trends.tooltips.${selectedMetric}`, { value, date })}
          </p>
        </div>
      );
    }
    return null;
  };

  const filteredData = getFilteredData();

  return (
    <Card className="shadow-soft border-2 border-child-primary/20">
      <CardHeader className="bg-gradient-child text-white">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <div className="text-2xl animate-bounce-gentle">🕰️</div>
          <span>{t('childDashboard.trends.title')}</span>
        </CardTitle>
        <p className="text-child-secondary">{t('childDashboard.trends.subtitle')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Period Selection */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['7days', '30days', '90days'] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "child" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-sm"
              >
                <Calendar className="h-4 w-4 mr-1" />
                {t(`childDashboard.trends.periods.${period}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Metric Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['moisture', 'ph', 'temperature', 'nutrients'] as const).map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? "child" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
                className="flex items-center space-x-2"
              >
                <span className="text-lg">{getMetricEmoji(metric)}</span>
                <span className="text-xs">{t(`childDashboard.metrics.${metric}`)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="mb-6 p-4 bg-child-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getTrendEmoji(trends[selectedMetric])}</span>
              <span className="font-bold text-child-primary">
                {t(`childDashboard.trends.indicators.${trends[selectedMetric].type}`)}
              </span>
            </div>
            <Badge variant="child" className="text-lg px-3 py-1">
              {trends[selectedMetric].percentage > 0 ? '+' : ''}{trends[selectedMetric].percentage.toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={3}
                dot={{ fill: getMetricColor(selectedMetric), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getMetricColor(selectedMetric), strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fun Facts */}
        <div className="mt-6 p-4 bg-gradient-to-r from-child-primary/10 to-child-accent/10 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-child-primary mb-2">
              🌟 Fun Garden Fact! 🌟
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedMetric === 'moisture' && "Plants drink water through their roots just like you drink through a straw! 🥤"}
              {selectedMetric === 'ph' && "Soil pH is like checking if your soil is happy or grumpy! 😊😠"}
              {selectedMetric === 'temperature' && "Plants like their soil just right - not too hot, not too cold! 🌡️"}
              {selectedMetric === 'nutrients' && "Plant food helps flowers grow big and strong, just like your food helps you! 💪"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildTrendChart;

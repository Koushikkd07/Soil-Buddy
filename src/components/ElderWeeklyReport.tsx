import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Mail, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Settings
} from "lucide-react";
import { WeeklyReport } from "@/types/soil";

interface ElderWeeklyReportProps {
  report: WeeklyReport;
  onExport: (format: 'pdf' | 'email') => void;
  onSchedule: () => void;
}

const ElderWeeklyReport = ({ report, onExport, onSchedule }: ElderWeeklyReportProps) => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<'summary' | 'trends' | 'recommendations' | 'schedule'>('summary');

  const getTrendIcon = (trend: any) => {
    switch (trend.type) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-warning" />;
    }
  };

  const getTrendColor = (trend: any) => {
    switch (trend.type) {
      case 'improving':
        return "success";
      case 'declining':
        return "destructive";
      default:
        return "warning";
    }
  };

  const getOverallHealth = () => {
    const scores = [
      report.summary.averageMoisture,
      report.summary.averagePh * 10, // Scale pH to 0-100
      report.summary.averageTemperature * 3, // Scale temp to 0-100
      report.summary.averageNutrients
    ];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (average >= 80) return { status: "Excellent", color: "success", icon: CheckCircle };
    if (average >= 60) return { status: "Good", color: "warning", icon: Info };
    return { status: "Needs Attention", color: "destructive", icon: AlertTriangle };
  };

  const overallHealth = getOverallHealth();

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <FileText className="h-8 w-8 text-elder-primary" />
            <span>{t('elderDashboard.reports.title')}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Week {Math.ceil((report.weekEnd.getTime() - new Date(report.weekEnd.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}
            </Badge>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{t('elderDashboard.reports.subtitle')}</p>
        <div className="flex items-center space-x-4 text-base">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {report.weekStart.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {report.weekEnd.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'summary', label: t('elderDashboard.reports.summary'), icon: BarChart3 },
            { key: 'trends', label: t('elderDashboard.reports.trends'), icon: TrendingUp },
            { key: 'recommendations', label: t('elderDashboard.reports.recommendations'), icon: CheckCircle },
            { key: 'schedule', label: t('elderDashboard.reports.schedule'), icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedSection === key ? "elder" : "outline"}
              size="lg"
              onClick={() => setSelectedSection(key as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        <Separator />

        {/* Overall Health Status */}
        <Card className={`border-2 border-${overallHealth.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <overallHealth.icon className={`h-12 w-12 text-${overallHealth.color}`} />
              <div>
                <h3 className="text-2xl font-bold">Overall Garden Health</h3>
                <p className="text-xl">
                  Status: <span className={`font-bold text-${overallHealth.color}`}>
                    {overallHealth.status}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        {selectedSection === 'summary' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Weekly Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-lg mb-2">Soil Moisture</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {report.summary.averageMoisture.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(report.trends.moisture)}
                    <span className="text-sm">
                      {report.trends.moisture.percentage > 0 ? '+' : ''}{report.trends.moisture.percentage.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-lg mb-2">pH Level</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {report.summary.averagePh.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(report.trends.ph)}
                    <span className="text-sm">
                      {report.trends.ph.percentage > 0 ? '+' : ''}{report.trends.ph.percentage.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-lg mb-2">Temperature</h4>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {report.summary.averageTemperature.toFixed(1)}°C
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(report.trends.temperature)}
                    <span className="text-sm">
                      {report.trends.temperature.percentage > 0 ? '+' : ''}{report.trends.temperature.percentage.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-lg mb-2">Nutrients</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {report.summary.averageNutrients.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(report.trends.nutrients)}
                    <span className="text-sm">
                      {report.trends.nutrients.percentage > 0 ? '+' : ''}{report.trends.nutrients.percentage.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedSection === 'trends' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Trend Analysis</h3>
            <div className="space-y-4">
              {Object.entries(report.trends).map(([metric, trend]) => (
                <Card key={metric}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(trend)}
                        <div>
                          <h4 className="font-semibold capitalize">{metric}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t(`elderDashboard.trends.indicators.${trend.type}`)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getTrendColor(trend) as any} className="text-lg px-3 py-1">
                        {trend.percentage > 0 ? '+' : ''}{trend.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'recommendations' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-success mt-1" />
                      <div className="flex-1">
                        <p className="text-lg">{rec}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'schedule' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Upcoming Care Schedule</h3>
            <div className="space-y-4">
              {report.upcomingTasks.map((task, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-elder-primary" />
                      <div className="flex-1">
                        <p className="text-lg">{task}</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Export and Schedule Options */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="elder"
            size="lg"
            onClick={() => onExport('pdf')}
            className="flex-1"
          >
            <Download className="h-5 w-5 mr-2" />
            {t('elderDashboard.reports.export.pdf')}
          </Button>
          <Button
            variant="elder"
            size="lg"
            onClick={() => onExport('email')}
            className="flex-1"
          >
            <Mail className="h-5 w-5 mr-2" />
            {t('elderDashboard.reports.export.email')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onSchedule}
            className="flex-1"
          >
            <Settings className="h-5 w-5 mr-2" />
            Schedule Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElderWeeklyReport;

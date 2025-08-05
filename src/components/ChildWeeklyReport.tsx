import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Trophy, 
  Star, 
  Gift, 
  Calendar,
  Download,
  Share,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import { WeeklyReport } from "@/types/soil";

interface ChildWeeklyReportProps {
  report: WeeklyReport;
  onExport: (format: 'share' | 'download') => void;
}

const ChildWeeklyReport = ({ report, onExport }: ChildWeeklyReportProps) => {
  const { t } = useTranslation();
  const [showFullReport, setShowFullReport] = useState(false);

  const getProgressEmoji = (percentage: number) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 70) return "😊";
    if (percentage >= 50) return "🙂";
    return "😐";
  };

  const getTrendEmoji = (trend: any) => {
    switch (trend.type) {
      case 'improving':
        return "📈";
      case 'declining':
        return "📉";
      default:
        return "➡️";
    }
  };

  const weekProgress = Math.round(
    (report.summary.averageMoisture + 
     report.summary.averageNutrients + 
     (report.summary.averagePh * 10) + 
     report.summary.averageTemperature) / 4
  );

  return (
    <Card className="shadow-soft border-2 border-child-primary/20">
      <CardHeader className="bg-gradient-child text-white">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <div className="text-2xl animate-bounce-gentle">📖</div>
          <span>{t('childDashboard.reports.title')}</span>
        </CardTitle>
        <p className="text-child-secondary">{t('childDashboard.reports.subtitle')}</p>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {report.weekStart.toLocaleDateString()} - {report.weekEnd.toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Story Header */}
        <div className="text-center p-6 bg-gradient-to-r from-child-primary/10 to-child-accent/10 rounded-lg">
          <div className="text-6xl mb-4">{getProgressEmoji(weekProgress)}</div>
          <h3 className="text-2xl font-bold text-child-primary mb-2">
            Your Garden Adventure This Week!
          </h3>
          <p className="text-lg text-muted-foreground">
            {weekProgress >= 80 
              ? "🎉 Amazing work, Little Gardener! Your plants are super happy!"
              : weekProgress >= 60
              ? "🌱 Good job! Your garden is growing nicely!"
              : "🌿 Keep trying! Every gardener learns something new!"}
          </p>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="flex items-center space-x-2 text-lg font-bold mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>{t('childDashboard.reports.achievements')}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.achievements.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 bg-child-primary/10 rounded-lg border-2 border-child-primary/20"
              >
                <div className="text-3xl">🏆</div>
                <div>
                  <div className="font-bold text-child-primary">{achievement}</div>
                  <div className="text-sm text-muted-foreground">Earned this week!</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garden Progress */}
        <div>
          <h4 className="flex items-center space-x-2 text-lg font-bold mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>{t('childDashboard.reports.progress')}</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">💧</span>
                <span className="font-bold">Water Level</span>
                <span className="text-lg">{getTrendEmoji(report.trends.moisture)}</span>
              </div>
              <Progress value={report.summary.averageMoisture} className="h-3 mb-2" />
              <div className="text-sm text-muted-foreground">
                Average: {report.summary.averageMoisture.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🧪</span>
                <span className="font-bold">Soil Happiness</span>
                <span className="text-lg">{getTrendEmoji(report.trends.ph)}</span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {report.summary.averagePh.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {report.summary.averagePh >= 6.0 && report.summary.averagePh <= 7.0 
                  ? "Super happy! 😊" 
                  : "Needs some love 🤗"}
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🌡️</span>
                <span className="font-bold">Temperature</span>
                <span className="text-lg">{getTrendEmoji(report.trends.temperature)}</span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                {report.summary.averageTemperature.toFixed(1)}°C
              </div>
              <div className="text-sm text-muted-foreground">
                Just right for plants!
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🍎</span>
                <span className="font-bold">Plant Food</span>
                <span className="text-lg">{getTrendEmoji(report.trends.nutrients)}</span>
              </div>
              <Progress value={report.summary.averageNutrients} className="h-3 mb-2" />
              <div className="text-sm text-muted-foreground">
                Average: {report.summary.averageNutrients.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Next Week's Missions */}
        <div>
          <h4 className="flex items-center space-x-2 text-lg font-bold mb-4">
            <Target className="h-5 w-5 text-child-accent" />
            <span>{t('childDashboard.reports.nextWeek')}</span>
          </h4>
          <div className="space-y-3">
            {report.upcomingTasks.map((task, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 bg-child-accent/10 rounded-lg"
              >
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="font-medium">{task}</div>
                </div>
                <Badge variant="child" className="text-xs">
                  New Mission!
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="child"
            size="lg"
            onClick={() => onExport('share')}
            className="flex-1"
          >
            <Share className="h-5 w-5 mr-2" />
            {t('childDashboard.reports.export')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowFullReport(!showFullReport)}
            className="flex-1"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {showFullReport ? "Hide Details" : "Show More Fun Facts!"}
          </Button>
        </div>

        {/* Extended Details */}
        {showFullReport && (
          <div className="mt-6 p-6 bg-gradient-to-r from-child-primary/5 to-child-accent/5 rounded-lg border-2 border-child-primary/20">
            <h5 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-child-accent" />
              <span>Fun Garden Facts This Week!</span>
            </h5>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-lg">🌱</span>
                <span>Your plants drank about {(report.summary.averageMoisture * 0.1).toFixed(1)} cups of water this week!</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg">🌡️</span>
                <span>The soil temperature was perfect for {Math.round(report.summary.averageTemperature / 25 * 7)} days this week!</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg">🍎</span>
                <span>Your plants got enough food to grow {Math.round(report.summary.averageNutrients / 10)} new leaves!</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildWeeklyReport;

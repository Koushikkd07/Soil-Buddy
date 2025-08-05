import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Droplets,
  Thermometer,
  Zap,
  TrendingUp,
  Volume2,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  LogOut,
  Bot
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ElderTrendChart from "@/components/ElderTrendChart";
import ElderAlerts from "@/components/ElderAlerts";
import ElderWeeklyReport from "@/components/ElderWeeklyReport";
import ElderChatbot from "@/components/ElderChatbot";
import { generateMockSoilData, calculateTrends, generateMockAlerts, generateMockWeeklyReport } from "@/utils/mockData";
import { SoilDataPoint, Alert, WeeklyReport } from "@/types/soil";

const ElderDashboard = () => {
  const { t } = useTranslation();
  const [soilData, setSoilData] = useState({
    moisture: 65,
    ph: 6.8,
    temperature: 22,
    nutrients: 75,
    lastUpdated: new Date()
  });

  const [weeklyTrends, setWeeklyTrends] = useState({
    moisture: +5,
    ph: -0.1,
    temperature: +2,
    nutrients: -3
  });

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [historicalData, setHistoricalData] = useState<SoilDataPoint[]>([]);
  const [trends, setTrends] = useState({
    moisture: { type: 'stable' as const, value: 0, percentage: 0 },
    ph: { type: 'stable' as const, value: 0, percentage: 0 },
    temperature: { type: 'stable' as const, value: 0, percentage: 0 },
    nutrients: { type: 'stable' as const, value: 0, percentage: 0 },
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);

  // Generate mock historical data and alerts on component mount
  useEffect(() => {
    const mockData = generateMockSoilData(90);
    setHistoricalData(mockData);
    setTrends(calculateTrends(mockData));
    setAlerts(generateMockAlerts(soilData));
    setWeeklyReport(generateMockWeeklyReport(mockData));
  }, []);

  // Update alerts when soil data changes
  useEffect(() => {
    setAlerts(generateMockAlerts(soilData));
  }, [soilData]);

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleAlertAction = (alert: Alert) => {
    console.log("Taking action for alert:", alert.type);
    // Here you would implement the actual action logic
    handleDismissAlert(alert.id);
  };

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleReportExport = (format: 'pdf' | 'email') => {
    console.log("Exporting report in format:", format);
    // Here you would implement the actual export logic
    if (format === 'pdf') {
      alert("Generating PDF report...");
    } else {
      alert("Sending report via email...");
    }
  };

  const handleScheduleReports = () => {
    console.log("Opening report scheduling");
    alert("Report scheduling options will open here.");
  };

  const getHealthStatus = (value: number, type: string) => {
    if (type === "ph") {
      if (value >= 6.0 && value <= 7.0) return { status: "Excellent", color: "success" };
      if (value >= 5.5 && value <= 7.5) return { status: "Good", color: "warning" };
      return { status: "Needs Attention", color: "destructive" };
    }
    if (value >= 70) return { status: "Excellent", color: "success" };
    if (value >= 50) return { status: "Good", color: "warning" };
    return { status: "Needs Attention", color: "destructive" };
  };

  const speakAlert = (text: string) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const recommendations = [
    {
      priority: "high",
      title: "Water Your Garden",
      description: "Soil moisture is at 65%. Consider watering to reach optimal 75-80% range.",
      action: "Water for 10-15 minutes"
    },
    {
      priority: "medium", 
      title: "Check Nutrient Levels",
      description: "Nutrients are good but could be boosted with organic compost.",
      action: "Add compost this weekend"
    },
    {
      priority: "low",
      title: "Monitor pH",
      description: "pH levels are excellent. Continue current care routine.",
      action: "No action needed"
    }
  ];

  useEffect(() => {
    // Audio alert for critical conditions
    if (soilData.moisture < 40) {
      speakAlert("Attention: Soil moisture is critically low. Please water your garden.");
    }
  }, [soilData.moisture, audioEnabled]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-elder-primary mb-2">
                {t('elderDashboard.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('elderDashboard.greeting')} • Last updated: {soilData.lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-4">
              <LanguageSwitcher />
              <Button
                variant={audioEnabled ? "elder" : "outline"}
                size="lg"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Audio {audioEnabled ? "On" : "Off"}
              </Button>
              <Button variant="elder" size="lg">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Report
              </Button>
              <Button variant="outline" size="lg">
                <LogOut className="h-5 w-5 mr-2" />
                {t('common.logout')}
              </Button>
            </div>
          </div>

          {/* Quick Access Chatbot Button */}
          <div className="mb-6 p-4 bg-elder-primary/10 rounded-lg border-2 border-elder-primary/20 hover:bg-elder-primary/15 transition-colors duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bot className="h-8 w-8 text-elder-primary" />
                <div>
                  <h3 className="text-xl font-bold text-elder-primary">{t('elderDashboard.chatbot.quickAccess')}</h3>
                  <p className="text-lg text-muted-foreground">{t('elderDashboard.chatbot.quickAccessDesc')}</p>
                </div>
              </div>
              <Button
                variant="elder"
                size="xl"
                className="px-8 shadow-soft hover:shadow-lg transition-shadow duration-300"
              >
                <MessageCircle className="h-6 w-6 mr-2" />
                {t('elderDashboard.chatbot.askAssistant')}
              </Button>
            </div>
          </div>

          <Separator />
        </div>

        {/* Critical Alerts */}
        {soilData.moisture < 50 && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="text-xl font-bold text-destructive">Low Moisture Alert</h3>
                  <p className="text-lg">Your soil moisture is below optimal levels. Please water your garden.</p>
                </div>
                <Button variant="destructive" size="xl">
                  Water Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Moisture */}
          <Card className="shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Droplets className="h-8 w-8 text-blue-600" />
                <span>Soil Moisture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {soilData.moisture}%
                </div>
                <Badge 
                  variant={getHealthStatus(soilData.moisture, "moisture").color as any}
                  className="text-lg px-4 py-2"
                >
                  {getHealthStatus(soilData.moisture, "moisture").status}
                </Badge>
              </div>
              <Progress value={soilData.moisture} className="h-6" />
              <div className="flex items-center justify-between text-lg">
                <span>Weekly Change:</span>
                <span className={`font-bold ${weeklyTrends.moisture > 0 ? "text-success" : "text-destructive"}`}>
                  {weeklyTrends.moisture > 0 ? "+" : ""}{weeklyTrends.moisture}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* pH Level */}
          <Card className="shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Zap className="h-8 w-8 text-purple-600" />
                <span>Soil pH</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {soilData.ph}
                </div>
                <Badge 
                  variant={getHealthStatus(soilData.ph, "ph").color as any}
                  className="text-lg px-4 py-2"
                >
                  {getHealthStatus(soilData.ph, "ph").status}
                </Badge>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-center text-lg">
                  Optimal Range: 6.0 - 7.0
                </div>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>Weekly Change:</span>
                <span className={`font-bold ${weeklyTrends.ph > 0 ? "text-success" : "text-destructive"}`}>
                  {weeklyTrends.ph > 0 ? "+" : ""}{weeklyTrends.ph}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Thermometer className="h-8 w-8 text-orange-600" />
                <span>Temperature</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">
                  {soilData.temperature}°C
                </div>
                <Badge 
                  variant={getHealthStatus(soilData.temperature, "temperature").color as any}
                  className="text-lg px-4 py-2"
                >
                  {getHealthStatus(soilData.temperature, "temperature").status}
                </Badge>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-center text-lg">
                  Optimal Range: 18 - 25°C
                </div>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span>Weekly Change:</span>
                <span className={`font-bold ${weeklyTrends.temperature > 0 ? "text-success" : "text-destructive"}`}>
                  {weeklyTrends.temperature > 0 ? "+" : ""}{weeklyTrends.temperature}°C
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Nutrients */}
          <Card className="shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <span>Nutrients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {soilData.nutrients}%
                </div>
                <Badge 
                  variant={getHealthStatus(soilData.nutrients, "nutrients").color as any}
                  className="text-lg px-4 py-2"
                >
                  {getHealthStatus(soilData.nutrients, "nutrients").status}
                </Badge>
              </div>
              <Progress value={soilData.nutrients} className="h-6" />
              <div className="flex items-center justify-between text-lg">
                <span>Weekly Change:</span>
                <span className={`font-bold ${weeklyTrends.nutrients > 0 ? "text-success" : "text-destructive"}`}>
                  {weeklyTrends.nutrients > 0 ? "+" : ""}{weeklyTrends.nutrients}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <ElderAlerts
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
            onActionClick={handleAlertAction}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
          />
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <ElderTrendChart data={historicalData} trends={trends} />
        </div>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Garden Care Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    rec.priority === "high" 
                      ? "bg-destructive/5 border-destructive" 
                      : rec.priority === "medium"
                      ? "bg-warning/5 border-warning"
                      : "bg-success/5 border-success"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {rec.priority === "high" && <AlertTriangle className="h-6 w-6 text-destructive" />}
                        {rec.priority === "medium" && <Info className="h-6 w-6 text-warning" />}
                        {rec.priority === "low" && <CheckCircle className="h-6 w-6 text-success" />}
                        <h3 className="text-xl font-bold">{rec.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">{rec.description}</p>
                      <p className="text-lg font-medium">Action: {rec.action}</p>
                    </div>
                    <Button
                      variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "warning" : "success"}
                      size="xl"
                    >
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Report */}
        {weeklyReport && (
          <div className="mb-8">
            <ElderWeeklyReport
              report={weeklyReport}
              onExport={handleReportExport}
              onSchedule={handleScheduleReports}
            />
          </div>
        )}

      </div>

      {/* Floating Chatbot */}
      <ElderChatbot
        soilData={soilData}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
      />
    </div>
  );
};

export default ElderDashboard;
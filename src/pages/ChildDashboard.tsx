import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Thermometer,
  Zap,
  Trophy,
  Star,
  MessageCircle,
  Volume2,
  Play,
  Gift,
  LogOut,
  BookOpen
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ChildTrendChart from "@/components/ChildTrendChart";
import ChildAlerts from "@/components/ChildAlerts";
import ChildWeeklyReport from "@/components/ChildWeeklyReport";
import ChildChatbot from "@/components/ChildChatbot";
import LearningDashboard from "@/components/LearningDashboard";
import { generateMockSoilData, calculateTrends, generateMockAlerts, generateMockWeeklyReport } from "@/utils/mockData";
import { SoilDataPoint, Alert, WeeklyReport } from "@/types/soil";
import { testApiConnection } from "@/services/chatService";

const ChildDashboard = () => {
  const { t } = useTranslation();
  const [soilData, setSoilData] = useState({
    moisture: 65,
    ph: 6.8,
    temperature: 22,
    nutrients: 75
  });

  const [badges, setBadges] = useState([
    { name: "First Garden Check", emoji: "🌱", earned: true },
    { name: "Water Helper", emoji: "💧", earned: true },
    { name: "pH Detective", emoji: "🕵️", earned: false },
    { name: "Super Gardener", emoji: "🏆", earned: false }
  ]);

  const [historicalData, setHistoricalData] = useState<SoilDataPoint[]>([]);
  const [trends, setTrends] = useState<{
    moisture: { type: 'stable' | 'improving' | 'declining', value: number, percentage: number };
    ph: { type: 'stable' | 'improving' | 'declining', value: number, percentage: number };
    temperature: { type: 'stable' | 'improving' | 'declining', value: number, percentage: number };
    nutrients: { type: 'stable' | 'improving' | 'declining', value: number, percentage: number };
  }>({
    moisture: { type: 'stable', value: 0, percentage: 0 },
    ph: { type: 'stable', value: 0, percentage: 0 },
    temperature: { type: 'stable', value: 0, percentage: 0 },
    nutrients: { type: 'stable', value: 0, percentage: 0 },
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);

  // Generate mock historical data on component mount
  useEffect(() => {
    try {
      const mockData = generateMockSoilData(90);
      setHistoricalData(mockData);
      setTrends(calculateTrends(mockData));
      setWeeklyReport(generateMockWeeklyReport(mockData));
    } catch (error) {
      console.error("Error generating mock data:", error);
      // Set fallback data
      setHistoricalData([]);
      setTrends({
        moisture: { type: 'stable', value: 0, percentage: 0 },
        ph: { type: 'stable', value: 0, percentage: 0 },
        temperature: { type: 'stable', value: 0, percentage: 0 },
        nutrients: { type: 'stable', value: 0, percentage: 0 },
      });
      setWeeklyReport(null);
    }
  }, []);

  // Generate alerts when soil data changes
  useEffect(() => {
    try {
      setAlerts(generateMockAlerts(soilData));
    } catch (error) {
      console.error("Error generating alerts:", error);
      setAlerts([]);
    }
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

  const handleReportExport = (format: 'share' | 'download') => {
    console.log("Exporting report in format:", format);
    // Here you would implement the actual export logic
    if (format === 'share') {
      // Share functionality
      alert("Sharing your garden story! 📖✨");
    } else {
      // Download functionality
      alert("Downloading your garden adventure! 📥");
    }
  };

  const getHealthEmoji = (value: number, type: string) => {
    if (type === "ph") {
      if (value >= 6.0 && value <= 7.0) return "😊";
      if (value >= 5.5 && value <= 7.5) return "🙂";
      return "😟";
    }
    if (value >= 70) return "😊";
    if (value >= 50) return "🙂";
    return "😟";
  };

  const getHealthColor = (value: number, type: string): "success" | "warning" | "destructive" => {
    if (type === "ph") {
      if (value >= 6.0 && value <= 7.0) return "success";
      if (value >= 5.5 && value <= 7.5) return "warning";
      return "destructive";
    }
    if (value >= 70) return "success";
    if (value >= 50) return "warning";
    return "destructive";
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTestAPI = async () => {
    console.log('Testing API connection...');
    const isConnected = await testApiConnection();
    console.log('API connection test result:', isConnected);
    alert(isConnected ? 'API connection successful!' : 'API connection failed. Using fallback responses.');
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Controls */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1 animate-fade-in">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="animate-bounce-gentle text-4xl">🌱</div>
              <h1 className="text-4xl font-bold text-child-primary">
                {t('childDashboard.title')}
              </h1>
              <div className="animate-wiggle text-4xl">🐛</div>
            </div>
            <p className="text-xl text-muted-foreground">
              {t('childDashboard.greeting')}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleTestAPI}>
              🤖 Test AI
            </Button>
            <LanguageSwitcher />
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="mb-6 space-y-4">
          {/* Chatbot Quick Access */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-child text-white px-6 py-3 rounded-full shadow-glow animate-pulse-glow cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="text-2xl animate-wiggle">🪱</div>
              <span className="text-lg font-bold">{t('childDashboard.chatbot.quickAccess')}</span>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-child-primary hover:bg-white/90 animate-bounce-gentle"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('childDashboard.chatbot.chatNow')}
              </Button>
            </div>
          </div>

          {/* Learning Quick Access */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-glow cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="text-2xl animate-bounce-gentle">📚</div>
              <span className="text-lg font-bold">Ready to learn cool garden secrets?</span>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-purple-600 hover:bg-white/90 animate-bounce-gentle"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning!
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden">
          {/* This div closes the original header div */}
        </div>

        {/* Mascot Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-child-primary/20 to-child-secondary/20 border-2 border-child-primary/30">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="text-6xl animate-bounce-gentle">💧</div>
                <div>
                  <h3 className="text-2xl font-bold text-child-primary">{t('childDashboard.mascots.dewey')}</h3>
                  <p className="text-lg">{t('childDashboard.mascots.soily')}</p>
                </div>
              </div>
              <Button
                variant="child"
                size="lg"
                onClick={() => speakText("Your soil looks pretty good! Let's make it even better!")}
              >
                <Volume2 className="h-6 w-6" />
                Hear Dewey!
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Soil Health Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Moisture */}
          <Card className="hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center items-center space-x-2 mb-2">
                <div className="text-4xl animate-bounce-gentle">💧</div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-lg">{t('childDashboard.metrics.moisture')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">
                {getHealthEmoji(soilData.moisture, "moisture")}
              </div>
              <Progress value={soilData.moisture} className="h-4" />
              <div className="text-2xl font-bold text-blue-600">
                {soilData.moisture}%
              </div>
              <Badge variant={getHealthColor(soilData.moisture, "moisture")}>
                {soilData.moisture >= 70 ? "Perfect! 🎉" : soilData.moisture >= 50 ? "Pretty Good 👍" : "Needs Water 💧"}
              </Badge>
            </CardContent>
          </Card>

          {/* pH Level */}
          <Card className="hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center items-center space-x-2 mb-2">
                <div className="text-4xl animate-wiggle">🧪</div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="text-lg">{t('childDashboard.metrics.ph')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">
                {getHealthEmoji(soilData.ph, "ph")}
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {soilData.ph}
              </div>
              <Badge variant={getHealthColor(soilData.ph, "ph")}>
                {soilData.ph >= 6.0 && soilData.ph <= 7.0 ? "Perfect Power! ⚡" : "Need Balance 🔄"}
              </Badge>
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center items-center space-x-2 mb-2">
                <div className="text-4xl animate-pulse">🌡️</div>
                <Thermometer className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-lg">{t('childDashboard.metrics.temperature')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">
                {getHealthEmoji(soilData.temperature, "temperature")}
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {soilData.temperature}°C
              </div>
              <Badge variant={getHealthColor(soilData.temperature, "temperature")}>
                {soilData.temperature >= 20 ? "Cozy Warm! 🔥" : "A bit Cool 🧊"}
              </Badge>
            </CardContent>
          </Card>

          {/* Nutrients */}
          <Card className="hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center items-center space-x-2 mb-2">
                <div className="text-4xl animate-bounce-gentle">🍎</div>
                <Gift className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-lg">{t('childDashboard.metrics.nutrients')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">
                {getHealthEmoji(soilData.nutrients, "nutrients")}
              </div>
              <Progress value={soilData.nutrients} className="h-4" />
              <div className="text-2xl font-bold text-green-600">
                {soilData.nutrients}%
              </div>
              <Badge variant={getHealthColor(soilData.nutrients, "nutrients")}>
                {soilData.nutrients >= 70 ? "Yummy Food! 🍎" : "Needs Snacks 🥕"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <ChildAlerts
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
            onActionClick={handleAlertAction}
          />
        </div>

        {/* Learning Section */}
        <div className="mb-8">
          {historicalData.length > 0 ? (
            <LearningDashboard soilData={soilData} />
          ) : (
            <Card className="shadow-soft border-2 border-child-primary/20">
              <CardHeader className="bg-gradient-child text-white">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <div className="text-3xl animate-bounce-gentle">📚</div>
                  <span>Garden Learning Adventure!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🌱</div>
                <p className="text-lg">Loading your learning adventure...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          {historicalData.length > 0 ? (
            <ChildTrendChart data={historicalData} trends={trends} />
          ) : (
            <Card className="shadow-soft border-2 border-child-primary/20">
              <CardHeader className="bg-gradient-child text-white">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <div className="text-2xl animate-bounce-gentle">📊</div>
                  <span>Garden Time Machine!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-lg">Loading your garden's history...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mission Center */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Today's Mission */}
          <Card className="bg-gradient-to-br from-child-accent/20 to-child-primary/20 border-2 border-child-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-child-accent animate-pulse" />
                <span className="text-child-primary">{t('childDashboard.missions.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg">
                🎯 <strong>Mission:</strong> Help your soil drink more water!
              </div>
              <div className="text-sm text-muted-foreground">
                Your soil is a little thirsty. Give it some water and watch it smile! 💧😊
              </div>
              <Button variant="child" size="lg" className="w-full">
                <Play className="h-5 w-5 mr-2" />
                Start Mission! 🚀
              </Button>
            </CardContent>
          </Card>

          {/* Badge Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>{t('childDashboard.achievements.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border-2 transition-all duration-300 ${
                      badge.earned 
                        ? "bg-child-primary/10 border-child-primary animate-pulse-glow" 
                        : "bg-gray-100 border-gray-300 opacity-50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <div className="text-sm font-medium">{badge.name}</div>
                    {badge.earned && (
                      <div className="text-xs text-child-primary font-bold mt-1">✨ Earned!</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Report */}
        <div className="mb-8">
          {weeklyReport ? (
            <ChildWeeklyReport
              report={weeklyReport}
              onExport={handleReportExport}
            />
          ) : (
            <Card className="shadow-soft border-2 border-child-primary/20">
              <CardHeader className="bg-gradient-child text-white">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <div className="text-2xl animate-bounce-gentle">📖</div>
                  <span>Weekly Garden Story!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg">Preparing your garden story...</p>
              </CardContent>
            </Card>
          )}
        </div>

      </div>

      {/* Floating Chatbot */}
      <ChildChatbot soilData={soilData} />
    </div>
  );
};

export default ChildDashboard;
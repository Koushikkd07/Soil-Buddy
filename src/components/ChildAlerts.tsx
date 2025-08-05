import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, 
  Droplets, 
  Thermometer, 
  Zap, 
  Gift,
  X,
  Volume2,
  Play
} from "lucide-react";
import { Alert as AlertType } from "@/types/soil";

interface ChildAlertsProps {
  alerts: AlertType[];
  onDismissAlert: (alertId: string) => void;
  onActionClick: (alert: AlertType) => void;
}

const ChildAlerts = ({ alerts, onDismissAlert, onActionClick }: ChildAlertsProps) => {
  const { t } = useTranslation();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<AlertType | null>(null);

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  const getAlertMascot = (type: AlertType['type']) => {
    switch (type) {
      case 'lowMoisture':
        return { emoji: "💧", name: "Dewey", animation: "animate-bounce-gentle" };
      case 'phImbalance':
        return { emoji: "🪱", name: "Soily", animation: "animate-wiggle" };
      case 'tempExtreme':
        return { emoji: "🌡️", name: "Temp", animation: "animate-pulse" };
      case 'lowNutrients':
        return { emoji: "🍎", name: "Nutri", animation: "animate-bounce-gentle" };
      default:
        return { emoji: "🌱", name: "Garden", animation: "animate-pulse" };
    }
  };

  const getAlertColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high':
        return "destructive";
      case 'medium':
        return "warning";
      case 'low':
        return "success";
      default:
        return "default";
    }
  };

  const playAlertSound = (alertId: string) => {
    setPlayingSound(alertId);
    // Simulate sound playing
    setTimeout(() => setPlayingSound(null), 2000);
  };

  // Show notification for new high-priority alerts
  useEffect(() => {
    const highPriorityAlert = alerts.find(alert => 
      !alert.isRead && alert.severity === 'high'
    );
    
    if (highPriorityAlert && !showNotification) {
      setShowNotification(highPriorityAlert);
      playAlertSound(highPriorityAlert.id);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(null);
      }, 5000);
    }
  }, [alerts, showNotification]);

  return (
    <div className="space-y-4">
      {/* Alert Badge Counter */}
      {unreadAlerts.length > 0 && (
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-child-primary animate-wiggle" />
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
            >
              {unreadAlerts.length}
            </Badge>
          </div>
        </div>
      )}

      {/* Floating Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-in">
          <Card className="border-4 border-child-primary shadow-glow bg-gradient-child text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`text-3xl ${getAlertMascot(showNotification.type).animation}`}>
                    {getAlertMascot(showNotification.type).emoji}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">
                      {t(`childDashboard.alerts.${showNotification.type}.title`)}
                    </CardTitle>
                    <div className="text-sm text-child-secondary">
                      {getAlertMascot(showNotification.type).name} says:
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotification(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm mb-3">
                {t(`childDashboard.alerts.${showNotification.type}.message`)}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onActionClick(showNotification)}
                  className="flex-1"
                >
                  {t(`childDashboard.alerts.${showNotification.type}.action`)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAlertSound(showNotification.id)}
                  className="text-white hover:bg-white/20"
                >
                  <Volume2 className={`h-4 w-4 ${playingSound === showNotification.id ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <div className="text-2xl animate-wiggle">🚨</div>
            <span>{t('childDashboard.alerts.title')}</span>
            {unreadAlerts.length > 0 && (
              <Badge variant="child" className="ml-2">
                {unreadAlerts.length} new!
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌟</div>
              <div className="text-lg font-bold text-child-primary mb-2">
                All Good, Little Gardener!
              </div>
              <div className="text-muted-foreground">
                Your garden is happy and healthy! Keep up the great work! 🌱
              </div>
            </div>
          ) : (
            alerts.map((alert) => {
              const mascot = getAlertMascot(alert.type);
              return (
                <Alert 
                  key={alert.id}
                  className={`border-2 ${
                    alert.isRead 
                      ? 'border-gray-200 bg-gray-50' 
                      : `border-${getAlertColor(alert.severity)} bg-${getAlertColor(alert.severity)}/5`
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`text-4xl ${!alert.isRead ? mascot.animation : ''}`}>
                      {mascot.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-lg">
                          {t(`childDashboard.alerts.${alert.type}.title`)}
                        </h4>
                        {!alert.isRead && (
                          <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                            New!
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="text-base mb-3">
                        <strong>{mascot.name} says:</strong> {t(`childDashboard.alerts.${alert.type}.message`)}
                      </AlertDescription>
                      <div className="flex space-x-2">
                        <Button
                          variant="child"
                          size="sm"
                          onClick={() => onActionClick(alert)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {t(`childDashboard.alerts.${alert.type}.action`)}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAlertSound(alert.id)}
                        >
                          <Volume2 className={`h-4 w-4 ${playingSound === alert.id ? 'animate-pulse' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Alert>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildAlerts;

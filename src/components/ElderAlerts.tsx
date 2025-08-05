import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Volume2,
  X,
  Clock,
  Settings
} from "lucide-react";
import { Alert as AlertType } from "@/types/soil";

interface ElderAlertsProps {
  alerts: AlertType[];
  onDismissAlert: (alertId: string) => void;
  onActionClick: (alert: AlertType) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const ElderAlerts = ({ 
  alerts, 
  onDismissAlert, 
  onActionClick, 
  audioEnabled, 
  onToggleAudio 
}: ElderAlertsProps) => {
  const { t } = useTranslation();
  const [speakingAlert, setSpeakingAlert] = useState<string | null>(null);

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const highPriorityAlerts = alerts.filter(alert => alert.severity === 'high' && !alert.isRead);

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'lowMoisture':
        return <AlertTriangle className="h-6 w-6 text-blue-600" />;
      case 'phImbalance':
        return <AlertTriangle className="h-6 w-6 text-purple-600" />;
      case 'tempExtreme':
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case 'lowNutrients':
        return <Info className="h-6 w-6 text-green-600" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const getSeverityIcon = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Info className="h-5 w-5 text-warning" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: AlertType['severity']) => {
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

  const speakAlert = (alert: AlertType) => {
    if (!audioEnabled) return;
    
    setSpeakingAlert(alert.id);
    
    // Simulate text-to-speech
    const text = `${t(`elderDashboard.alerts.${alert.type}.title`)}. ${t(`elderDashboard.alerts.${alert.type}.message`)}`;
    
    // In a real implementation, you would use the Web Speech API:
    // const utterance = new SpeechSynthesisUtterance(text);
    // speechSynthesis.speak(utterance);
    
    console.log("Speaking:", text);
    
    // Simulate speaking duration
    setTimeout(() => {
      setSpeakingAlert(null);
    }, 3000);
  };

  // Auto-announce high priority alerts
  useEffect(() => {
    if (audioEnabled && highPriorityAlerts.length > 0) {
      const latestAlert = highPriorityAlerts[0];
      speakAlert(latestAlert);
    }
  }, [highPriorityAlerts.length, audioEnabled]);

  return (
    <div className="space-y-6">
      {/* Alert Summary Header */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Bell className="h-8 w-8 text-elder-primary" />
              <span>{t('elderDashboard.alerts.title')}</span>
              {unreadAlerts.length > 0 && (
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {unreadAlerts.length} Active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={audioEnabled ? "elder" : "outline"}
                size="lg"
                onClick={onToggleAudio}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Audio {audioEnabled ? "On" : "Off"}
              </Button>
              <Button variant="outline" size="lg">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {unreadAlerts.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-3xl font-bold text-destructive">
                  {alerts.filter(a => a.severity === 'high' && !a.isRead).length}
                </div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-3xl font-bold text-warning">
                  {alerts.filter(a => a.severity === 'medium' && !a.isRead).length}
                </div>
                <div className="text-sm text-muted-foreground">Medium Priority</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-3xl font-bold text-success">
                  {alerts.filter(a => a.severity === 'low' && !a.isRead).length}
                </div>
                <div className="text-sm text-muted-foreground">Low Priority</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-success mb-2">
                All Systems Normal
              </h3>
              <p className="text-lg text-muted-foreground">
                Your garden is operating within optimal parameters. No alerts at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Alert 
              key={alert.id}
              className={`border-2 ${
                alert.isRead 
                  ? 'border-border bg-muted/30' 
                  : `border-${getSeverityColor(alert.severity)} bg-${getSeverityColor(alert.severity)}/5`
              } p-6`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-bold">
                      {t(`elderDashboard.alerts.${alert.type}.title`)}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(alert.severity)}
                      <Badge 
                        variant={getSeverityColor(alert.severity) as any}
                        className="text-sm px-3 py-1"
                      >
                        {alert.severity.toUpperCase()} PRIORITY
                      </Badge>
                      {!alert.isRead && (
                        <Badge variant="outline" className="text-sm">
                          NEW
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <AlertDescription className="text-lg mb-4">
                    {t(`elderDashboard.alerts.${alert.type}.message`)}
                  </AlertDescription>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {alert.timestamp.toLocaleString()}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="elder"
                      size="lg"
                      onClick={() => onActionClick(alert)}
                    >
                      {t(`elderDashboard.alerts.${alert.type}.action`)}
                    </Button>
                    
                    {audioEnabled && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => speakAlert(alert)}
                        disabled={speakingAlert === alert.id}
                      >
                        <Volume2 className={`h-5 w-5 mr-2 ${speakingAlert === alert.id ? 'animate-pulse' : ''}`} />
                        {speakingAlert === alert.id ? "Speaking..." : "Read Aloud"}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onDismissAlert(alert.id)}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          ))
        )}
      </div>
    </div>
  );
};

export default ElderAlerts;

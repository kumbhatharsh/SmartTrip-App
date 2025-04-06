
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { weatherAlerts } from "@/lib/mockData";
import { CloudSun, CloudRain, AlertTriangle } from "lucide-react";

const WeatherAlerts = () => {
  // Function to get the appropriate icon based on the alert type
  const getAlertIcon = (alertText: string) => {
    if (alertText.includes("rain")) return <CloudRain className="h-5 w-5" />;
    if (alertText.includes("heat")) return <CloudSun className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  // Function to get the appropriate color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "moderate":
        return "yellow";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CloudSun className="h-5 w-5 mr-2 text-sunset-500" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherAlerts.map((alert) => (
          <Alert key={alert.id} variant="outline" className="border-l-4 border-l-sunset-500">
            <div className="flex items-start">
              {getAlertIcon(alert.alert)}
              <div className="ml-3 flex-1">
                <AlertTitle className="flex items-center justify-between">
                  {alert.location}
                  <Badge
                    variant={getSeverityColor(alert.severity) as any}
                    className={`ml-2 ${
                      alert.severity === "high" ? "bg-red-500" : 
                      alert.severity === "moderate" ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                  {alert.alert} on {new Date(alert.date).toLocaleDateString()}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;

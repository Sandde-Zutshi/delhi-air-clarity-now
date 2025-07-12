import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  icon: typeof AlertTriangle;
  text: string;
  priority: "high" | "medium" | "low";
  category: "public" | "industrial" | "transport" | "health";
}

interface RecommendationsCardProps {
  aqi: number;
}

const getRecommendations = (aqi: number): Recommendation[] => {
  if (aqi <= 50) {
    return [
      { icon: Shield, text: "Air quality is satisfactory. Normal outdoor activities recommended.", priority: "low", category: "public" },
      { icon: Users, text: "Vulnerable groups can enjoy outdoor activities.", priority: "low", category: "health" }
    ];
  }
  
  if (aqi <= 100) {
    return [
      { icon: Users, text: "Sensitive individuals should limit prolonged outdoor exertion.", priority: "medium", category: "health" },
      { icon: Shield, text: "General public can continue normal activities.", priority: "low", category: "public" }
    ];
  }
  
  if (aqi <= 150) {
    return [
      { icon: AlertTriangle, text: "Advise public to limit outdoor activities, especially for children and elderly.", priority: "high", category: "public" },
      { icon: Building2, text: "Consider temporary restrictions on industrial emissions.", priority: "medium", category: "industrial" },
      { icon: Users, text: "Issue health advisory for sensitive groups.", priority: "high", category: "health" }
    ];
  }
  
  if (aqi <= 200) {
    return [
      { icon: AlertTriangle, text: "Public health warning: Everyone should avoid outdoor activities.", priority: "high", category: "public" },
      { icon: Building2, text: "Implement emergency industrial emission controls.", priority: "high", category: "industrial" },
      { icon: Shield, text: "Close schools and non-essential outdoor facilities.", priority: "high", category: "public" }
    ];
  }
  
  return [
    { icon: AlertTriangle, text: "Health emergency: Everyone should avoid all outdoor activities.", priority: "high", category: "public" },
    { icon: Building2, text: "Immediate shutdown of major industrial operations.", priority: "high", category: "industrial" },
    { icon: Shield, text: "Implement emergency response protocols.", priority: "high", category: "public" },
    { icon: Users, text: "Issue immediate health warnings to all residents.", priority: "high", category: "health" }
  ];
};

const priorityConfig = {
  high: { color: "status-critical", bgColor: "bg-red-50", textColor: "text-red-700" },
  medium: { color: "aqi-unhealthy-sensitive", bgColor: "bg-orange-50", textColor: "text-orange-700" },
  low: { color: "status-success", bgColor: "bg-green-50", textColor: "text-green-700" }
};

export function RecommendationsCard({ aqi }: RecommendationsCardProps) {
  const recommendations = getRecommendations(aqi);
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Government Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const Icon = rec.icon;
          
          return (
            <div 
              key={index}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                config.bgColor
              )}
            >
              <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.textColor)} />
              <div className="space-y-2 flex-1">
                <p className={cn("text-sm font-medium", config.textColor)}>
                  {rec.text}
                </p>
                <div className="flex gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      `border-${config.color}`,
                      config.textColor
                    )}
                  >
                    {rec.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {rec.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
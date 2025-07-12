import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AQICardProps {
  aqi: number;
  location?: string;
  className?: string;
}

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: "Good", color: "aqi-good", textColor: "aqi-good-foreground" };
  if (aqi <= 100) return { level: "Moderate", color: "aqi-moderate", textColor: "aqi-moderate-foreground" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "aqi-unhealthy-sensitive", textColor: "aqi-unhealthy-sensitive-foreground" };
  if (aqi <= 200) return { level: "Unhealthy", color: "aqi-unhealthy", textColor: "aqi-unhealthy-foreground" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "aqi-very-unhealthy", textColor: "aqi-very-unhealthy-foreground" };
  return { level: "Hazardous", color: "aqi-hazardous", textColor: "aqi-hazardous-foreground" };
};

export function AQICard({ aqi, location = "Delhi", className }: AQICardProps) {
  const { level, color, textColor } = getAQILevel(aqi);

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-muted-foreground">
          Air Quality Index - {location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={cn(
            "rounded-xl p-6 text-center transition-colors",
            `bg-${color}`,
            `text-${textColor}`
          )}
        >
          <div className="text-5xl font-bold mb-2">{aqi}</div>
          <div className="text-lg font-medium">{level}</div>
        </div>
        
        <div className="flex justify-center">
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm font-medium border-2",
              `border-${color}`,
              `text-${color}`
            )}
          >
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
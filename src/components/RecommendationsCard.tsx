import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AlertTriangle, Shield, Users, Building2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  icon: typeof AlertTriangle;
  text: string;
  priority: "high" | "medium" | "low";
  category: "public" | "industrial" | "transport" | "health";
  details?: string;
}

interface RecommendationsCardProps {
  aqi: number;
  onLearnMore?: (recommendation: any) => void;
}

const getRecommendations = (aqi: number): Recommendation[] => {
  if (aqi <= 50) {
    return [
      { 
        icon: Shield, 
        text: "Air quality is satisfactory. Normal outdoor activities recommended.", 
        priority: "low", 
        category: "public",
        details: "Current air quality poses minimal risk. Continue normal activities while maintaining awareness."
      },
      { 
        icon: Users, 
        text: "Vulnerable groups can enjoy outdoor activities.", 
        priority: "low", 
        category: "health",
        details: "Children, elderly, and those with respiratory conditions can safely engage in outdoor activities."
      }
    ];
  }
  
  if (aqi <= 100) {
    return [
      { 
        icon: Users, 
        text: "Sensitive individuals should limit prolonged outdoor exertion.", 
        priority: "medium", 
        category: "health",
        details: "People with heart or lung disease, children, and older adults should reduce prolonged outdoor activities."
      },
      { 
        icon: Shield, 
        text: "General public can continue normal activities.", 
        priority: "low", 
        category: "public",
        details: "Most people can continue normal outdoor activities, but be aware of air quality changes."
      }
    ];
  }
  
  if (aqi <= 150) {
    return [
      { 
        icon: AlertTriangle, 
        text: "Advise public to limit outdoor activities, especially for children and elderly.", 
        priority: "high", 
        category: "public",
        details: "Everyone should reduce outdoor activities. Sensitive groups should avoid outdoor exertion."
      },
      { 
        icon: Building2, 
        text: "Consider temporary restrictions on industrial emissions.", 
        priority: "medium", 
        category: "industrial",
        details: "Industries should reduce emissions where possible. Consider voluntary emission reduction measures."
      },
      { 
        icon: Users, 
        text: "Issue health advisory for sensitive groups.", 
        priority: "high", 
        category: "health",
        details: "People with respiratory or heart conditions should avoid outdoor activities and follow medical advice."
      }
    ];
  }
  
  if (aqi <= 200) {
    return [
      { 
        icon: AlertTriangle, 
        text: "Public health warning: Everyone should avoid outdoor activities.", 
        priority: "high", 
        category: "public",
        details: "All individuals should avoid outdoor activities. Stay indoors with windows closed."
      },
      { 
        icon: Building2, 
        text: "Implement emergency industrial emission controls.", 
        priority: "high", 
        category: "industrial",
        details: "Industries must implement emergency emission controls. Non-essential operations should be suspended."
      },
      { 
        icon: Shield, 
        text: "Close schools and non-essential outdoor facilities.", 
        priority: "high", 
        category: "public",
        details: "Schools, parks, and outdoor recreational facilities should be closed until air quality improves."
      }
    ];
  }
  
  return [
    { 
      icon: AlertTriangle, 
      text: "Health emergency: Everyone should avoid all outdoor activities.", 
      priority: "high", 
      category: "public",
      details: "This is a health emergency. Everyone should remain indoors and avoid all outdoor activities."
    },
    { 
      icon: Building2, 
      text: "Immediate shutdown of major industrial operations.", 
      priority: "high", 
      category: "industrial",
      details: "All major industrial operations must be shut down immediately to reduce emissions."
    },
    { 
      icon: Shield, 
      text: "Implement emergency response protocols.", 
      priority: "high", 
      category: "public",
      details: "Emergency response protocols should be activated. Public transportation may be affected."
    },
    { 
      icon: Users, 
      text: "Issue immediate health warnings to all residents.", 
      priority: "high", 
      category: "health",
      details: "Immediate health warnings should be issued to all residents. Medical facilities should prepare for increased cases."
    }
  ];
};

const priorityConfig = {
  high: { 
    color: "#EF4444", 
    bgColor: "bg-red-50", 
    textColor: "text-red-700",
    gradient: ["#EF4444", "#DC2626"]
  },
  medium: { 
    color: "#F97316", 
    bgColor: "bg-orange-50", 
    textColor: "text-orange-700",
    gradient: ["#F97316", "#EA580C"]
  },
  low: { 
    color: "#10B981", 
    bgColor: "bg-green-50", 
    textColor: "text-green-700",
    gradient: ["#10B981", "#059669"]
  }
};

export function RecommendationsCard({ aqi, onLearnMore }: RecommendationsCardProps) {
  const recommendations = getRecommendations(aqi);
  
  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!recommendations || recommendations.length === 0) ? (
            <div className="text-center text-muted-foreground py-8">No recommendations available for this AQI value.</div>
          ) : recommendations.map((rec, index) => {
            const config = priorityConfig[rec.priority];
            const Icon = rec.icon;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                  config.bgColor
                )}
              >
                <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.textColor)} aria-hidden="true" />
                <div className="space-y-3 flex-1">
                  <p className={cn("text-sm font-medium", config.textColor)}>
                    {rec.text}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <StatusButton 
                            color={config.color}
                            aria-label={`Recommendation priority: ${rec.priority}`}
                          >
                            {rec.priority.toUpperCase()} PRIORITY
                          </StatusButton>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} priority
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <StatusButton 
                            variant="secondary"
                            aria-label={`Recommendation category: ${rec.category}`}
                          >
                            {rec.category.toUpperCase()}
                          </StatusButton>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)} category
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {onLearnMore && rec.details && (
                    <Button
                      onClick={() => onLearnMore({ 
                        title: rec.text,
                        details: rec.details,
                        priority: rec.priority,
                        category: rec.category,
                        icon: Icon,
                        gradient: config.gradient
                      })}
                      variant="outline"
                      size="sm"
                      aria-label={`Learn more about recommendation: ${rec.text}`}
                      className="text-xs font-medium border px-3 py-1 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                      style={{
                        borderColor: config.color,
                        color: config.color
                      }}
                    >
                      <Info className="w-3 h-3 mr-1" aria-hidden="true" />
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
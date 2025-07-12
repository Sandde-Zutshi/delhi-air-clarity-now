export interface AQILevel {
  name: string;
  range: [number, number];
  gradient: [string, string];
  icon: string;
  description: string;
  protectionLevel: string;
}

export const AQI_LEVELS: AQILevel[] = [
  {
    name: "Good",
    range: [0, 50],
    gradient: ["#10B981", "#059669"],
    icon: "🌱",
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    protectionLevel: "No protection needed"
  },
  {
    name: "Moderate",
    range: [51, 100],
    gradient: ["#F59E0B", "#D97706"],
    icon: "😷",
    description: "Air quality is acceptable; however, some pollutants may be a concern for a small number of people.",
    protectionLevel: "Basic protection recommended"
  },
  {
    name: "Unhealthy for Sensitive",
    range: [101, 150],
    gradient: ["#F97316", "#EA580C"],
    icon: "🚶‍♂️",
    description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    protectionLevel: "Sensitive groups should limit outdoor activity"
  },
  {
    name: "Unhealthy",
    range: [151, 200],
    gradient: ["#EF4444", "#DC2626"],
    icon: "🏠",
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
    protectionLevel: "Limit outdoor activity, wear masks"
  },
  {
    name: "Very Unhealthy",
    range: [201, 300],
    gradient: ["#8B5CF6", "#7C3AED"],
    icon: "🚫",
    description: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    protectionLevel: "Avoid outdoor activity, stay indoors"
  },
  {
    name: "Hazardous",
    range: [301, 500],
    gradient: ["#991B1B", "#7F1D1D"],
    icon: "⚠️",
    description: "Health alert: everyone may experience more serious health effects.",
    protectionLevel: "Emergency conditions - avoid all outdoor activity"
  }
];

export const getAQILevel = (aqi: number): AQILevel => {
  return AQI_LEVELS.find(level => aqi >= level.range[0] && aqi <= level.range[1]) || AQI_LEVELS[AQI_LEVELS.length - 1];
};

export const getAQIColorClass = (aqi: number): string => {
  const level = getAQILevel(aqi);
  switch (level.name) {
    case "Good": return "aqi-good";
    case "Moderate": return "aqi-moderate";
    case "Unhealthy for Sensitive": return "aqi-unhealthy-sensitive";
    case "Unhealthy": return "aqi-unhealthy";
    case "Very Unhealthy": return "aqi-very-unhealthy";
    case "Hazardous": return "aqi-hazardous";
    default: return "aqi-moderate";
  }
};

export const getAQITextColorClass = (aqi: number): string => {
  const level = getAQILevel(aqi);
  switch (level.name) {
    case "Good": return "aqi-good-foreground";
    case "Moderate": return "aqi-moderate-foreground";
    case "Unhealthy for Sensitive": return "aqi-unhealthy-sensitive-foreground";
    case "Unhealthy": return "aqi-unhealthy-foreground";
    case "Very Unhealthy": return "aqi-very-unhealthy-foreground";
    case "Hazardous": return "aqi-hazardous-foreground";
    default: return "aqi-moderate-foreground";
  }
}; 
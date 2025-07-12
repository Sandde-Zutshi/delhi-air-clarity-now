// AQI Color System - Government Standard
// Based on the provided color scheme with specific hex codes and ranges

export interface AQIColorInfo {
  hex: string;
  description: string;
  gradient: [string, string];
  textColor: string;
  borderColor: string;
}

export const AQI_COLORS: Record<string, AQIColorInfo> = {
  "0-25": {
    hex: "#00E400",
    description: "Good",
    gradient: ["#00E400", "#00C400"],
    textColor: "#FFFFFF",
    borderColor: "#00E400"
  },
  "26-50": {
    hex: "#7CFC00",
    description: "Good – Moderate",
    gradient: ["#7CFC00", "#6BDB00"],
    textColor: "#000000",
    borderColor: "#7CFC00"
  },
  "51-75": {
    hex: "#ADFF2F",
    description: "Moderate",
    gradient: ["#ADFF2F", "#9CEE1E"],
    textColor: "#000000",
    borderColor: "#ADFF2F"
  },
  "76-100": {
    hex: "#FFFF00",
    description: "Moderate",
    gradient: ["#FFFF00", "#EEEE00"],
    textColor: "#000000",
    borderColor: "#FFFF00"
  },
  "101-125": {
    hex: "#FFA500",
    description: "Unhealthy for Sensitive Groups",
    gradient: ["#FFA500", "#EE9400"],
    textColor: "#FFFFFF",
    borderColor: "#FFA500"
  },
  "126-150": {
    hex: "#FF8C00",
    description: "Unhealthy for Sensitive Groups",
    gradient: ["#FF8C00", "#EE7B00"],
    textColor: "#FFFFFF",
    borderColor: "#FF8C00"
  },
  "151-175": {
    hex: "#FF0000",
    description: "Unhealthy",
    gradient: ["#FF0000", "#EE0000"],
    textColor: "#FFFFFF",
    borderColor: "#FF0000"
  },
  "176-200": {
    hex: "#B22222",
    description: "Very Unhealthy",
    gradient: ["#B22222", "#A11111"],
    textColor: "#FFFFFF",
    borderColor: "#B22222"
  },
  "201-225": {
    hex: "#8A2BE2",
    description: "Very Unhealthy",
    gradient: ["#8A2BE2", "#791AD1"],
    textColor: "#FFFFFF",
    borderColor: "#8A2BE2"
  },
  "226-250": {
    hex: "#800080",
    description: "Very Unhealthy – Severe",
    gradient: ["#800080", "#6F006F"],
    textColor: "#FFFFFF",
    borderColor: "#800080"
  },
  "251-275": {
    hex: "#800000",
    description: "Hazardous",
    gradient: ["#800000", "#6F0000"],
    textColor: "#FFFFFF",
    borderColor: "#800000"
  },
  "276-300": {
    hex: "#A52A2A",
    description: "Hazardous",
    gradient: ["#A52A2A", "#941919"],
    textColor: "#FFFFFF",
    borderColor: "#A52A2A"
  },
  "301-325": {
    hex: "#4B0000",
    description: "Extremely Hazardous",
    gradient: ["#4B0000", "#3A0000"],
    textColor: "#FFFFFF",
    borderColor: "#4B0000"
  },
  "326-350": {
    hex: "#2F1B1B",
    description: "Toxic",
    gradient: ["#2F1B1B", "#1E0A0A"],
    textColor: "#FFFFFF",
    borderColor: "#2F1B1B"
  },
  "351-375": {
    hex: "#1C1C1C",
    description: "Severe",
    gradient: ["#1C1C1C", "#0B0B0B"],
    textColor: "#FFFFFF",
    borderColor: "#1C1C1C"
  },
  "376-400+": {
    hex: "#000000",
    description: "Emergency",
    gradient: ["#000000", "#000000"],
    textColor: "#FFFFFF",
    borderColor: "#FF0000"
  }
};

export function getAQIColorInfo(aqi: number): AQIColorInfo {
  if (aqi <= 25) return AQI_COLORS["0-25"];
  if (aqi <= 50) return AQI_COLORS["26-50"];
  if (aqi <= 75) return AQI_COLORS["51-75"];
  if (aqi <= 100) return AQI_COLORS["76-100"];
  if (aqi <= 125) return AQI_COLORS["101-125"];
  if (aqi <= 150) return AQI_COLORS["126-150"];
  if (aqi <= 175) return AQI_COLORS["151-175"];
  if (aqi <= 200) return AQI_COLORS["176-200"];
  if (aqi <= 225) return AQI_COLORS["201-225"];
  if (aqi <= 250) return AQI_COLORS["226-250"];
  if (aqi <= 275) return AQI_COLORS["251-275"];
  if (aqi <= 300) return AQI_COLORS["276-300"];
  if (aqi <= 325) return AQI_COLORS["301-325"];
  if (aqi <= 350) return AQI_COLORS["326-350"];
  if (aqi <= 375) return AQI_COLORS["351-375"];
  return AQI_COLORS["376-400+"];
}

export function getAQILevel(aqi: number): string {
  const colorInfo = getAQIColorInfo(aqi);
  return colorInfo.description;
}

export function getAQIGradient(aqi: number): [string, string] {
  const colorInfo = getAQIColorInfo(aqi);
  return colorInfo.gradient;
}

export function getAQIHex(aqi: number): string {
  const colorInfo = getAQIColorInfo(aqi);
  return colorInfo.hex;
}

export function getAQITextColor(aqi: number): string {
  const colorInfo = getAQIColorInfo(aqi);
  return colorInfo.textColor;
}

export function getAQIBorderColor(aqi: number): string {
  const colorInfo = getAQIColorInfo(aqi);
  return colorInfo.borderColor;
}

// Helper function to get health implications based on AQI
export function getHealthImplications(aqi: number): string {
  if (aqi <= 50) return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
  if (aqi <= 100) return "Air quality is acceptable; some pollutants may be a concern for a very small number of people.";
  if (aqi <= 150) return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
  if (aqi <= 200) return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
  if (aqi <= 300) return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
  return "Health alert: everyone may experience more serious health effects.";
}

// Helper function to get caution statement based on AQI
export function getCautionStatement(aqi: number): string {
  if (aqi <= 50) return "No caution needed.";
  if (aqi <= 100) return "Unusually sensitive people should consider limiting prolonged outdoor exertion.";
  if (aqi <= 150) return "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
  if (aqi <= 200) return "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.";
  if (aqi <= 300) return "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";
  return "Everyone should avoid all outdoor exertion.";
} 
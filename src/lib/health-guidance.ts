// Health-Based Guidance and Risk Communication System
// Based on CPCB standards and WHO guidelines for Indian context

export interface HealthGuidance {
  aqiLevel: string;
  color: string;
  description: string;
  healthEffects: string[];
  recommendations: {
    general: string[];
    sensitive: string[];
    children: string[];
    elderly: string[];
    respiratory: string[];
  };
  activities: {
    outdoor: string[];
    indoor: string[];
    exercise: string[];
    work: string[];
  };
  protectiveMeasures: string[];
  emergencyActions: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high' | 'severe';
}

export interface PersonalizedAdvice {
  userType: 'general' | 'sensitive' | 'children' | 'elderly' | 'respiratory' | 'pregnant';
  location: string;
  currentAQI: number;
  advice: string[];
  precautions: string[];
  activities: string[];
  emergencyContacts?: string[];
}

// CPCB AQI Categories with Indian context
export const AQI_HEALTH_GUIDANCE: { [key: string]: HealthGuidance } = {
  "Good": {
    aqiLevel: "Good",
    color: "#00E400",
    description: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    healthEffects: [
      "No health impacts expected",
      "Normal breathing conditions",
      "Safe for all age groups"
    ],
    recommendations: {
      general: [
        "Continue normal activities",
        "Enjoy outdoor activities",
        "No special precautions needed"
      ],
      sensitive: [
        "Monitor for any unusual symptoms",
        "Keep rescue medications handy if prescribed"
      ],
      children: [
        "Safe for outdoor play and sports",
        "No restrictions on activities"
      ],
      elderly: [
        "Safe for regular activities",
        "Continue daily exercise routines"
      ],
      respiratory: [
        "Monitor breathing patterns",
        "Keep medications accessible"
      ]
    },
    activities: {
      outdoor: ["All outdoor activities safe", "Sports and exercise recommended", "Walking and cycling encouraged"],
      indoor: ["Normal indoor activities", "Natural ventilation safe"],
      exercise: ["All exercise levels safe", "Outdoor workouts recommended"],
      work: ["Normal work activities", "Outdoor work safe"]
    },
    protectiveMeasures: [
      "No special protection needed",
      "Maintain normal lifestyle"
    ],
    emergencyActions: [],
    riskLevel: 'low'
  },

  "Moderate": {
    aqiLevel: "Moderate",
    color: "#FFFF00",
    description: "Air quality is acceptable; however, some pollutants may be a concern for a small number of people.",
    healthEffects: [
      "Minor breathing discomfort for sensitive individuals",
      "Possible irritation in eyes, nose, and throat",
      "Generally safe for healthy individuals"
    ],
    recommendations: {
      general: [
        "Consider reducing prolonged outdoor activities",
        "Monitor air quality updates",
        "Stay hydrated"
      ],
      sensitive: [
        "Reduce outdoor activities",
        "Keep rescue medications nearby",
        "Monitor symptoms closely"
      ],
      children: [
        "Limit prolonged outdoor play",
        "Take breaks during outdoor activities",
        "Stay hydrated"
      ],
      elderly: [
        "Reduce strenuous outdoor activities",
        "Monitor for breathing difficulties",
        "Stay in well-ventilated areas"
      ],
      respiratory: [
        "Reduce outdoor exposure",
        "Use prescribed medications as needed",
        "Monitor breathing patterns"
      ]
    },
    activities: {
      outdoor: ["Limit prolonged activities", "Take frequent breaks", "Avoid heavy exercise"],
      indoor: ["Normal indoor activities", "Use air purifiers if available"],
      exercise: ["Light to moderate exercise only", "Indoor workouts preferred"],
      work: ["Normal work with breaks", "Monitor for symptoms"]
    },
    protectiveMeasures: [
      "Stay hydrated",
      "Use air purifiers if available",
      "Monitor symptoms"
    ],
    emergencyActions: [],
    riskLevel: 'moderate'
  },

  "Unhealthy for Sensitive Groups": {
    aqiLevel: "Unhealthy for Sensitive Groups",
    color: "#FF7E00",
    description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    healthEffects: [
      "Breathing discomfort for sensitive groups",
      "Increased respiratory symptoms",
      "Possible aggravation of heart/lung disease"
    ],
    recommendations: {
      general: [
        "Reduce outdoor activities",
        "Stay indoors when possible",
        "Monitor air quality closely"
      ],
      sensitive: [
        "Minimize outdoor activities",
        "Use air purifiers",
        "Keep medications readily available",
        "Consider wearing N95 masks outdoors"
      ],
      children: [
        "Limit outdoor play",
        "Indoor activities preferred",
        "Monitor for breathing difficulties"
      ],
      elderly: [
        "Stay indoors as much as possible",
        "Avoid strenuous activities",
        "Monitor health closely"
      ],
      respiratory: [
        "Stay indoors",
        "Use prescribed medications",
        "Consider wearing masks",
        "Monitor symptoms closely"
      ]
    },
    activities: {
      outdoor: ["Minimize outdoor activities", "Use masks if going out", "Short trips only"],
      indoor: ["Stay indoors", "Use air purifiers", "Keep windows closed"],
      exercise: ["Indoor exercise only", "Light activities preferred"],
      work: ["Work from home if possible", "Minimize outdoor work"]
    },
    protectiveMeasures: [
      "Use N95 masks outdoors",
      "Use air purifiers",
      "Keep windows closed",
      "Stay hydrated"
    ],
    emergencyActions: [
      "Seek medical attention if symptoms worsen",
      "Call emergency services if severe breathing difficulty"
    ],
    riskLevel: 'high'
  },

  "Unhealthy": {
    aqiLevel: "Unhealthy",
    color: "#FF0000",
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
    healthEffects: [
      "Breathing discomfort for everyone",
      "Serious health effects for sensitive groups",
      "Increased respiratory and cardiovascular symptoms"
    ],
    recommendations: {
      general: [
        "Avoid outdoor activities",
        "Stay indoors with air purifiers",
        "Monitor health closely"
      ],
      sensitive: [
        "Stay indoors completely",
        "Use air purifiers continuously",
        "Wear masks if going out",
        "Keep emergency contacts ready"
      ],
      children: [
        "No outdoor activities",
        "Indoor play only",
        "Monitor for symptoms"
      ],
      elderly: [
        "Stay indoors",
        "Avoid all strenuous activities",
        "Monitor health closely"
      ],
      respiratory: [
        "Stay indoors completely",
        "Use medications as prescribed",
        "Wear masks if necessary",
        "Monitor symptoms continuously"
      ]
    },
    activities: {
      outdoor: ["Avoid all outdoor activities", "Essential trips only with masks"],
      indoor: ["Stay indoors", "Use air purifiers", "Keep windows closed"],
      exercise: ["No outdoor exercise", "Light indoor activities only"],
      work: ["Work from home", "Essential work only with protection"]
    },
    protectiveMeasures: [
      "Use N95 masks",
      "Use air purifiers",
      "Keep windows closed",
      "Stay hydrated",
      "Monitor symptoms"
    ],
    emergencyActions: [
      "Seek immediate medical attention for severe symptoms",
      "Call emergency services for breathing difficulties",
      "Use rescue medications as prescribed"
    ],
    riskLevel: 'very-high'
  },

  "Very Unhealthy": {
    aqiLevel: "Very Unhealthy",
    color: "#8F3F97",
    description: "Health alert: everyone may experience more serious health effects.",
    healthEffects: [
      "Serious health effects for everyone",
      "Significant breathing difficulties",
      "Increased risk of heart attacks and strokes"
    ],
    recommendations: {
      general: [
        "Stay indoors completely",
        "Use air purifiers continuously",
        "Avoid all outdoor activities",
        "Monitor health closely"
      ],
      sensitive: [
        "Stay indoors completely",
        "Use air purifiers 24/7",
        "Wear masks even indoors",
        "Keep emergency contacts ready"
      ],
      children: [
        "No outdoor activities",
        "Indoor activities only",
        "Monitor closely for symptoms"
      ],
      elderly: [
        "Stay indoors completely",
        "Avoid all physical activities",
        "Monitor health continuously"
      ],
      respiratory: [
        "Stay indoors completely",
        "Use medications as prescribed",
        "Wear masks continuously",
        "Monitor symptoms constantly"
      ]
    },
    activities: {
      outdoor: ["No outdoor activities", "Emergency trips only"],
      indoor: ["Stay indoors", "Use air purifiers", "Keep windows closed"],
      exercise: ["No exercise", "Rest only"],
      work: ["Work from home only", "No outdoor work"]
    },
    protectiveMeasures: [
      "Use N95 masks continuously",
      "Use air purifiers 24/7",
      "Keep windows closed",
      "Stay hydrated",
      "Monitor symptoms constantly"
    ],
    emergencyActions: [
      "Seek immediate medical attention",
      "Call emergency services",
      "Use rescue medications",
      "Move to cleaner air if possible"
    ],
    riskLevel: 'very-high'
  },

  "Hazardous": {
    aqiLevel: "Hazardous",
    color: "#7E0023",
    description: "Health warning of emergency conditions: everyone is more likely to be affected.",
    healthEffects: [
      "Emergency conditions",
      "Serious health effects for everyone",
      "High risk of respiratory and cardiovascular problems"
    ],
    recommendations: {
      general: [
        "Stay indoors completely",
        "Use air purifiers continuously",
        "Avoid all outdoor activities",
        "Monitor health constantly"
      ],
      sensitive: [
        "Stay indoors completely",
        "Use air purifiers 24/7",
        "Wear masks continuously",
        "Keep emergency contacts ready"
      ],
      children: [
        "No outdoor activities",
        "Indoor activities only",
        "Monitor closely for symptoms"
      ],
      elderly: [
        "Stay indoors completely",
        "Avoid all physical activities",
        "Monitor health continuously"
      ],
      respiratory: [
        "Stay indoors completely",
        "Use medications as prescribed",
        "Wear masks continuously",
        "Monitor symptoms constantly"
      ]
    },
    activities: {
      outdoor: ["No outdoor activities", "Emergency only"],
      indoor: ["Stay indoors", "Use air purifiers", "Keep windows closed"],
      exercise: ["No exercise", "Rest only"],
      work: ["Work from home only", "No outdoor work"]
    },
    protectiveMeasures: [
      "Use N95 masks continuously",
      "Use air purifiers 24/7",
      "Keep windows closed",
      "Stay hydrated",
      "Monitor symptoms constantly"
    ],
    emergencyActions: [
      "Seek immediate medical attention",
      "Call emergency services",
      "Use rescue medications",
      "Move to cleaner air if possible",
      "Consider evacuation if necessary"
    ],
    riskLevel: 'severe'
  }
};

// Get AQI level from value
export function getAQILevel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

// Get health guidance for AQI value
export function getHealthGuidance(aqi: number): HealthGuidance {
  const level = getAQILevel(aqi);
  return AQI_HEALTH_GUIDANCE[level] || AQI_HEALTH_GUIDANCE["Good"];
}

// Generate personalized advice
export function generatePersonalizedAdvice(
  aqi: number,
  userType: PersonalizedAdvice['userType'],
  location: string
): PersonalizedAdvice {
  const guidance = getHealthGuidance(aqi);
  
  let advice: string[] = [];
  let precautions: string[] = [];
  let activities: string[] = [];

  switch (userType) {
    case 'sensitive':
      advice = guidance.recommendations.sensitive;
      precautions = guidance.protectiveMeasures;
      activities = guidance.activities.indoor;
      break;
    case 'children':
      advice = guidance.recommendations.children;
      precautions = guidance.protectiveMeasures;
      activities = guidance.activities.indoor;
      break;
    case 'elderly':
      advice = guidance.recommendations.elderly;
      precautions = guidance.protectiveMeasures;
      activities = guidance.activities.indoor;
      break;
    case 'respiratory':
      advice = guidance.recommendations.respiratory;
      precautions = [...guidance.protectiveMeasures, "Keep rescue inhaler ready"];
      activities = guidance.activities.indoor;
      break;
    case 'pregnant':
      advice = [
        "Stay indoors as much as possible",
        "Avoid outdoor activities",
        "Monitor for any unusual symptoms",
        "Consult doctor if concerned"
      ];
      precautions = guidance.protectiveMeasures;
      activities = guidance.activities.indoor;
      break;
    default:
      advice = guidance.recommendations.general;
      precautions = guidance.protectiveMeasures;
      activities = guidance.activities.indoor;
  }

  return {
    userType,
    location,
    currentAQI: aqi,
    advice,
    precautions,
    activities,
    emergencyContacts: guidance.riskLevel === 'severe' ? [
      "Emergency: 112",
      "Ambulance: 102",
      "Police: 100"
    ] : undefined
  };
}

// Emergency contact information for Delhi
export const DELHI_EMERGENCY_CONTACTS = {
  emergency: "112",
  ambulance: "102",
  police: "100",
  fire: "101",
  womenHelpline: "1091",
  childHelpline: "1098",
  seniorCitizenHelpline: "14567",
  mentalHealthHelpline: "1800-599-0019"
};

// Health tips based on time of day
export function getTimeBasedHealthTips(hour: number, aqi: number): string[] {
  const tips: string[] = [];
  
  if (hour >= 6 && hour <= 10) {
    tips.push("Morning hours often have higher pollution levels");
    tips.push("Consider indoor exercise instead of morning walks");
  } else if (hour >= 17 && hour <= 21) {
    tips.push("Evening traffic can increase pollution levels");
    tips.push("Avoid outdoor activities during peak traffic hours");
  }
  
  if (aqi > 150) {
    tips.push("High pollution levels - stay indoors");
    tips.push("Use air purifiers if available");
  }
  
  return tips;
} 
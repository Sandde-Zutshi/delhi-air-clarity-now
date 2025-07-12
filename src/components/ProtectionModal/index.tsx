import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Shield, Users, Clock, MapPin, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AQILevel } from '../AQICard/constants';
import questionsData from './questions.json';

type QA = { q: string; a: string };
const questions: Record<string, QA[]> = questionsData;

// Function to generate dynamic questions based on pollutant values
const generateDynamicQuestions = (pollutant?: any, aqiValue?: number): QA[] => {
  if (!pollutant && !aqiValue) return [];

  const dynamicQuestions: QA[] = [];

  if (pollutant) {
    const { name, value, unit, status } = pollutant;
    
    // PM2.5 specific questions
    if (name === "PM2.5") {
      if (value > 35.4) {
        dynamicQuestions.push({
          q: `PM2.5 is ${value} ${unit} - what does this mean?`,
          a: `PM2.5 levels above 35.4 μg/m³ are unhealthy. These fine particles can penetrate deep into lungs and cause respiratory issues.`
        });
        dynamicQuestions.push({
          q: "How can I protect myself from high PM2.5?",
          a: "Use N95 masks, stay indoors, use air purifiers with HEPA filters, and avoid outdoor exercise."
        });
      } else if (value > 12) {
        dynamicQuestions.push({
          q: `PM2.5 is ${value} ${unit} - is this concerning?`,
          a: `PM2.5 levels between 12-35.4 μg/m³ are moderate. Sensitive groups should limit outdoor activities.`
        });
      }
    }

    // PM10 specific questions
    if (name === "PM10") {
      if (value > 154) {
        dynamicQuestions.push({
          q: `PM10 is ${value} ${unit} - what precautions should I take?`,
          a: `PM10 levels above 154 μg/m³ are unhealthy. Avoid outdoor activities, keep windows closed, and use air purifiers.`
        });
      }
    }

    // NO2 specific questions
    if (name === "NO2") {
      if (value > 100) {
        dynamicQuestions.push({
          q: `NO2 is ${value} ${unit} - what are the health risks?`,
          a: `High NO2 levels can cause respiratory inflammation, reduced lung function, and increased asthma attacks.`
        });
      }
    }

    // O3 specific questions
    if (name === "O3") {
      if (value > 70) {
        dynamicQuestions.push({
          q: `Ozone is ${value} ${unit} - when is it worst?`,
          a: `Ozone levels are typically highest in the afternoon. Plan outdoor activities for early morning or evening.`
        });
      }
    }

    // CO specific questions
    if (name === "CO") {
      if (value > 9.4) {
        dynamicQuestions.push({
          q: `CO is ${value} ${unit} - what are the symptoms?`,
          a: `High CO levels can cause headaches, dizziness, nausea, and confusion. Seek fresh air immediately.`
        });
      }
    }

    // SO2 specific questions
    if (name === "SO2") {
      if (value > 75) {
        dynamicQuestions.push({
          q: `SO2 is ${value} ${unit} - what should I do?`,
          a: `High SO2 levels can irritate eyes, nose, and throat. Stay indoors and use air conditioning if available.`
        });
      }
    }
  }

  // AQI level specific questions
  if (aqiValue) {
    if (aqiValue >= 4) {
      dynamicQuestions.push({
        q: `AQI is ${aqiValue}/5 - what does this mean for Delhi?`,
        a: `AQI level ${aqiValue} indicates poor air quality. Follow government advisories and limit outdoor activities.`
      });
    } else if (aqiValue >= 3) {
      dynamicQuestions.push({
        q: `AQI is ${aqiValue}/5 - should I be concerned?`,
        a: `AQI level ${aqiValue} indicates moderate air quality. Sensitive groups should take precautions.`
      });
    }
  }

  return dynamicQuestions;
};

interface ProtectionModalProps {
  open: boolean;
  aqiLevel: AQILevel | null;
  aqiValue?: number;
  pollutant?: any;
  recommendation?: any;
  onClose: () => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut" as const,
    },
  }),
};

export function ProtectionModal({ open, aqiLevel, aqiValue, pollutant, recommendation, onClose }: ProtectionModalProps) {
  if (!aqiLevel && !pollutant && !recommendation) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-label="Protection information modal">
          <span className="text-2xl font-bold mb-2">No Details Available</span>
          <span className="text-sm text-muted-foreground">No protection or recommendation details are available for this selection.</span>
          <Button onClick={onClose} className="mt-4" aria-label="Close protection modal">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  const isPollutant = pollutant && !aqiLevel && !recommendation;
  const isRecommendation = recommendation && !aqiLevel && !pollutant;
  const isAQILevel = aqiLevel && !pollutant && !recommendation;

  if (!open) return null;

  // Handle Pollutant Modal
  if (isPollutant) {
    const PollutantIcon = pollutant.icon;
    // Generate dynamic questions based on pollutant values
    const dynamicQuestions = generateDynamicQuestions(pollutant, aqiValue);
    
    // Map pollutant status to AQI level for questions.json
    const statusToAQI = {
      good: "Good",
      moderate: "Moderate",
      unhealthy: "Unhealthy",
      critical: "Hazardous"
    };
    const staticQuestions: QA[] = questions[statusToAQI[pollutant.status]] || [];
    
    // Combine static and dynamic questions, prioritizing dynamic ones
    const allQuestions = [...dynamicQuestions, ...staticQuestions].slice(0, 5);
    
    return (
      <AnimatePresence>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <PollutantIcon className="w-6 h-6" style={{ color: pollutant.gradient[0] }} />
                    {pollutant.name} - Air Pollutant
                  </DialogTitle>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className="text-sm font-medium border-2 px-3 py-1"
                    style={{
                      borderColor: pollutant.gradient[0],
                      color: pollutant.gradient[0]
                    }}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {pollutant.status.toUpperCase()}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Delhi, India</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Current Reading */}
                <Card className="border-l-4" style={{ borderLeftColor: pollutant.gradient[0] }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5" style={{ color: pollutant.gradient[0] }} />
                      Current Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2" style={{ color: pollutant.gradient[0] }}>
                      {pollutant.value} {pollutant.unit}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {pollutant.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Health Effects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      Health Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pollutant.status === "critical" && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-sm text-red-700 font-medium">Serious health risk - Avoid outdoor activities</p>
                        </div>
                      )}
                      {pollutant.status === "unhealthy" && (
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <p className="text-sm text-orange-700 font-medium">Health effects possible - Limit outdoor activities</p>
                        </div>
                      )}
                      {pollutant.status === "moderate" && (
                        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <p className="text-sm text-yellow-700 font-medium">Moderate concern - Sensitive groups should be cautious</p>
                        </div>
                      )}
                      {pollutant.status === "good" && (
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-sm text-green-700 font-medium">Safe levels - Normal activities can continue</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dynamic Questions */}
                {allQuestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Top 5 Questions for {pollutant.name} ({pollutant.value} {pollutant.unit})
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Essential information based on current {pollutant.name} levels
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allQuestions.map((item, index) => (
                          <motion.div
                            key={index}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-1">{item.q}</div>
                              <div className="text-xs text-muted-foreground leading-normal">{item.a}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={onClose}
                    className="flex-1"
                    variant="outline"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    );
  }

  // Handle Recommendation Modal
  if (isRecommendation) {
    const RecIcon = recommendation.icon;
    // Map recommendation priority/category to AQI status for questions.json
    const statusToAQI = {
      low: "Good",
      medium: "Moderate",
      high: "Unhealthy",
      critical: "Hazardous"
    };
    // Try to use recommendation.status if available, else fallback to priority
    const recStatus = recommendation.status || recommendation.priority || "medium";
    const qList: QA[] = questions[statusToAQI[recStatus]] || [];
    return (
      <AnimatePresence>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <RecIcon className="w-6 h-6" style={{ color: recommendation.gradient[0] }} />
                    Government Recommendation
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className="text-sm font-medium border-2 px-3 py-1"
                    style={{
                      borderColor: recommendation.gradient[0],
                      color: recommendation.gradient[0]
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {recommendation.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {recommendation.category.toUpperCase()}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Recommendation Details */}
                <Card className="border-l-4" style={{ borderLeftColor: recommendation.gradient[0] }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5" style={{ color: recommendation.gradient[0] }} />
                      Detailed Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {recommendation.details}
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">{recommendation.title}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions/Questions for Recommendation Status */}
                {qList.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Top 5 Questions for {statusToAQI[recStatus]} Air Quality
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Essential information to protect yourself and your family
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {qList.map((item, index) => (
                          <motion.div
                            key={index}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-1">{item.q}</div>
                              <div className="text-xs text-muted-foreground leading-normal">{item.a}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Implementation Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Implementation Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          1
                        </div>
                        <p className="text-sm leading-relaxed">Follow the recommendation immediately based on priority level</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          2
                        </div>
                        <p className="text-sm leading-relaxed">Monitor air quality updates for changes in conditions</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          3
                        </div>
                        <p className="text-sm leading-relaxed">Report any violations or concerns to authorities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={onClose}
                    className="flex-1"
                    variant="outline"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    );
  }

  // Handle AQI Level Modal (existing code)
  if (!isAQILevel) return null;

  const qList: QA[] = questions[aqiLevel.name] || [];
  
  const getSeverityColor = () => {
    switch (aqiLevel.name) {
      case "Good": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Moderate": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "Unhealthy for Sensitive": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      case "Unhealthy": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "Very Unhealthy": return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "Hazardous": return "bg-red-900/10 text-red-900 border-red-900/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getSeverityIcon = () => {
    switch (aqiLevel.name) {
      case "Good": return "🌱";
      case "Moderate": return "😷";
      case "Unhealthy for Sensitive": return "🚶‍♂️";
      case "Unhealthy": return "🏠";
      case "Very Unhealthy": return "🚫";
      case "Hazardous": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Protection information modal">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">{getSeverityIcon && getSeverityIcon()}</span>
                    Protection Guide for {aqiLevel?.name || pollutant?.name || recommendation?.title} Air Quality
                  </DialogTitle>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={cn("text-sm font-medium border-2 px-3 py-1", getSeverityColor())}
                    aria-label={`Protection level: ${aqiLevel?.protectionLevel}`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {aqiLevel?.protectionLevel}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Delhi, India</span>
                  </div>
                  
                  {aqiValue && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      <span>AQI: {aqiValue}/5</span>
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* AQI Level Description */}
                <Card className="border-l-4" style={{ borderLeftColor: aqiLevel.gradient[0] }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5" style={{ color: aqiLevel.gradient[0] }} />
                      Air Quality Level: {aqiLevel.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {aqiLevel.description}
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">Protection Level: {aqiLevel.protectionLevel}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dynamic Questions for AQI Level */}
                {(() => {
                  const dynamicQuestions = generateDynamicQuestions(undefined, aqiValue);
                  const allQuestions = [...dynamicQuestions, ...qList].slice(0, 5);
                  
                  if (allQuestions.length === 0) return null;
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Top 5 Questions for {aqiLevel.name} Air Quality
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Essential information to protect yourself and your family
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {allQuestions.map((item, index) => (
                            <motion.div
                              key={index}
                              custom={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">{item.q}</div>
                                <div className="text-xs text-muted-foreground leading-normal">{item.a}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={onClose}
                    className="flex-1"
                    variant="outline"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 
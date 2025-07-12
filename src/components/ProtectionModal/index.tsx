import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Shield, Users, Clock, MapPin, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AQILevel } from '../AQICard/constants';
import questions from './questions.json';

interface ProtectionModalProps {
  open: boolean;
  aqiLevel: AQILevel | null;
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

export function ProtectionModal({ open, aqiLevel, pollutant, recommendation, onClose }: ProtectionModalProps) {
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

                {/* Suggestions/Questions for Pollutant Status */}
                {(() => {
                  // Map pollutant status to AQI level for questions.json
                  const statusToAQI = {
                    good: "Good",
                    moderate: "Moderate",
                    unhealthy: "Unhealthy",
                    critical: "Hazardous"
                  };
                  const qList = (questions as Record<string, string[]>)[statusToAQI[pollutant.status]] || [];
                  if (qList.length === 0) return null;
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Top 5 Questions for {statusToAQI[pollutant.status]} Air Quality
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Essential information to protect yourself and your family
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {qList.map((question, index) => (
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
                              <p className="text-sm leading-relaxed">{question}</p>
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
    const qList = (questions as Record<string, string[]>)[statusToAQI[recStatus]] || [];
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
                        {qList.map((question, index) => (
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
                            <p className="text-sm leading-relaxed">{question}</p>
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

  const qList = (questions as Record<string, string[]>)[aqiLevel.name] || [];
  
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
                    <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                    {aqiLevel?.protectionLevel}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>Delhi, India</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Description Card */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" aria-hidden="true" />
                      Current Situation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {aqiLevel.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Top Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                      Top 5 Questions for {aqiLevel?.name} Air Quality
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Essential information to protect yourself and your family
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {qList.map((question, index) => (
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
                          <p className="text-sm leading-relaxed">{question}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Information */}
                {(aqiLevel.name === "Very Unhealthy" || aqiLevel.name === "Hazardous") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="border-l-4 border-l-destructive bg-destructive/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                          Emergency Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium">Emergency Hotline: 1800-XXX-XXXX</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            If you experience severe symptoms like difficulty breathing, chest pain, or dizziness, 
                            seek immediate medical attention.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={onClose}
                    className="flex-1"
                    variant="outline"
                    aria-label="Close protection modal"
                  >
                    Got it
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Could open emergency contacts or additional resources
                      window.open('tel:1800-XXX-XXXX', '_self');
                    }}
                    aria-label="Call emergency hotline"
                  >
                    Call Emergency
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
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Shield, Users, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { AQILevel } from '../AQICard/constants';
import questions from './questions.json';

interface ProtectionModalProps {
  open: boolean;
  aqiLevel: AQILevel | null;
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
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
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
      ease: "easeOut",
    },
  }),
};

export function ProtectionModal({ open, aqiLevel, onClose }: ProtectionModalProps) {
  if (!aqiLevel) return null;

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
                    <span className="text-3xl">{getSeverityIcon()}</span>
                    Protection Guide for {aqiLevel.name} Air Quality
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                    aria-label="Close protection modal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={cn("text-sm font-medium border-2 px-3 py-1", getSeverityColor())}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {aqiLevel.protectionLevel}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Delhi, India</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Description Card */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
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
                      <Users className="w-5 h-5 text-primary" />
                      Top 5 Questions for {aqiLevel.name} Air Quality
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
                          <AlertTriangle className="w-5 h-5" />
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
                  >
                    Got it
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Could open emergency contacts or additional resources
                      window.open('tel:1800-XXX-XXXX', '_self');
                    }}
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
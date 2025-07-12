import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Heart, Users, Baby, UserCheck, Shield, Clock, Activity, AlertCircle, Phone, Download } from "lucide-react";
import { 
  getHealthGuidance, 
  generatePersonalizedAdvice, 
  DELHI_EMERGENCY_CONTACTS,
  getTimeBasedHealthTips,
  HealthGuidance,
  PersonalizedAdvice 
} from '@/lib/health-guidance';
import { cn } from "@/lib/utils";

interface HealthGuidanceCardProps {
  aqi: number;
  location: string;
  className?: string;
}

const userTypes = [
  { value: 'general', label: 'General Public', icon: Users },
  { value: 'sensitive', label: 'Sensitive Groups', icon: Heart },
  { value: 'children', label: 'Children', icon: Baby },
  { value: 'elderly', label: 'Elderly', icon: UserCheck },
  { value: 'respiratory', label: 'Respiratory Issues', icon: Activity },
  { value: 'pregnant', label: 'Pregnant Women', icon: Shield }
];

export function HealthGuidanceCard({ aqi, location, className }: HealthGuidanceCardProps) {
  const [selectedUserType, setSelectedUserType] = useState<PersonalizedAdvice['userType']>('general');
  const [activeTab, setActiveTab] = useState('overview');

  const healthGuidance = getHealthGuidance(aqi);
  const personalizedAdvice = generatePersonalizedAdvice(aqi, selectedUserType, location);
  const timeTips = getTimeBasedHealthTips(new Date().getHours(), aqi);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-white bg-red-600 border-red-700';
      case 'very-high': return 'text-white bg-red-500 border-red-600';
      case 'high': return 'text-white bg-orange-500 border-orange-600';
      case 'moderate': return 'text-white bg-yellow-500 border-yellow-600';
      case 'low': return 'text-white bg-green-500 border-green-600';
      default: return 'text-white bg-gray-500 border-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'moderate': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'low': return <Shield className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Health Guidance & Risk Communication
          </CardTitle>
          <Badge 
            className={cn(
              "text-sm font-medium",
              getSeverityColor(healthGuidance.riskLevel)
            )}
          >
            {healthGuidance.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Personalized health advice based on current AQI levels and your profile
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personalized">Personalized</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current AQI Level */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Current Air Quality Level</h3>
                <Badge 
                  style={{ backgroundColor: healthGuidance.color, color: 'white' }}
                  className="font-medium"
                >
                  {healthGuidance.aqiLevel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {healthGuidance.description}
              </p>
              
              {/* Health Effects */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Health Effects:</h4>
                <ul className="text-sm space-y-1">
                  {healthGuidance.healthEffects.map((effect, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Time-based Tips */}
            {timeTips.length > 0 && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Time-based Health Tips</h4>
                </div>
                <ul className="text-sm space-y-1 text-blue-800">
                  {timeTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* General Recommendations */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">General Recommendations</h4>
              <ul className="text-sm space-y-2">
                {healthGuidance.recommendations.general.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="personalized" className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Your Profile:</label>
              <Select value={selectedUserType} onValueChange={(value: any) => setSelectedUserType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profile" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Personalized Advice */}
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Personalized Advice for {userTypes.find(t => t.value === selectedUserType)?.label}
                </h4>
                <ul className="text-sm space-y-2">
                  {personalizedAdvice.advice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Precautions to Take</h4>
                <ul className="text-sm space-y-2">
                  {personalizedAdvice.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Recommended Activities</h4>
                <ul className="text-sm space-y-2">
                  {personalizedAdvice.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Outdoor Activities */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-600" />
                  Outdoor Activities
                </h4>
                <ul className="text-sm space-y-2">
                  {healthGuidance.activities.outdoor.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Indoor Activities */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Indoor Activities
                </h4>
                <ul className="text-sm space-y-2">
                  {healthGuidance.activities.indoor.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exercise Guidelines */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Exercise Guidelines
                </h4>
                <ul className="text-sm space-y-2">
                  {healthGuidance.activities.exercise.map((exercise, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Work Guidelines */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Work Guidelines
                </h4>
                <ul className="text-sm space-y-2">
                  {healthGuidance.activities.work.map((work, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      {work}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            {/* Emergency Actions */}
            {healthGuidance.emergencyActions.length > 0 && (
              <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Actions Required
                </h4>
                <ul className="text-sm space-y-2 text-red-700">
                  {healthGuidance.emergencyActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Contacts */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                Emergency Contacts
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Emergency:</span> {DELHI_EMERGENCY_CONTACTS.emergency}
                </div>
                <div>
                  <span className="font-medium">Ambulance:</span> {DELHI_EMERGENCY_CONTACTS.ambulance}
                </div>
                <div>
                  <span className="font-medium">Police:</span> {DELHI_EMERGENCY_CONTACTS.police}
                </div>
                <div>
                  <span className="font-medium">Fire:</span> {DELHI_EMERGENCY_CONTACTS.fire}
                </div>
                <div>
                  <span className="font-medium">Women Helpline:</span> {DELHI_EMERGENCY_CONTACTS.womenHelpline}
                </div>
                <div>
                  <span className="font-medium">Child Helpline:</span> {DELHI_EMERGENCY_CONTACTS.childHelpline}
                </div>
                <div>
                  <span className="font-medium">Senior Citizen:</span> {DELHI_EMERGENCY_CONTACTS.seniorCitizenHelpline}
                </div>
                <div>
                  <span className="font-medium">Mental Health:</span> {DELHI_EMERGENCY_CONTACTS.mentalHealthHelpline}
                </div>
              </div>
            </div>

            {/* Download Health Guidelines */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Download Health Guidelines
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Guidelines
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Emergency Contacts
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
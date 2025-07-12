import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Monitor, Home, Car, Building, School, Hospital, ShoppingBag, ExternalLink, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AirQualityDevice {
  name: string;
  type: 'monitor' | 'purifier' | 'mask' | 'filter';
  description: string;
  price: string;
  rating: number;
  features: string[];
  bestFor: string[];
  link: string;
}

interface ProtectiveMeasure {
  category: string;
  title: string;
  description: string;
  effectiveness: 'high' | 'medium' | 'low';
  cost: 'low' | 'medium' | 'high';
  implementation: string[];
  tips: string[];
}

const airQualityDevices: AirQualityDevice[] = [
  {
    name: "Prana Air Smart Air Quality Monitor",
    type: "monitor",
    description: "Real-time PM2.5, PM10, CO2, TVOC monitoring with mobile app",
    price: "₹8,999",
    rating: 4.5,
    features: [
      "Real-time monitoring",
      "Mobile app integration",
      "Data logging",
      "WiFi connectivity",
      "Battery powered"
    ],
    bestFor: ["Home", "Office", "Schools"],
    link: "https://pranaair.com"
  },
  {
    name: "Honeywell HPA300 Air Purifier",
    type: "purifier",
    description: "HEPA air purifier with activated carbon filter for large rooms",
    price: "₹25,000",
    rating: 4.3,
    features: [
      "HEPA H13 filter",
      "Activated carbon",
      "Covers 465 sq ft",
      "3 fan speeds",
      "Filter replacement indicator"
    ],
    bestFor: ["Large rooms", "Homes", "Offices"],
    link: "https://honeywell.com"
  },
  {
    name: "3M N95 Respirator Mask",
    type: "mask",
    description: "Professional grade N95 mask for protection against PM2.5",
    price: "₹150",
    rating: 4.7,
    features: [
      "N95 filtration",
      "Adjustable nose clip",
      "Comfortable fit",
      "Disposable",
      "NIOSH approved"
    ],
    bestFor: ["Outdoor activities", "Commuting", "High pollution days"],
    link: "https://3m.com"
  },
  {
    name: "Philips AC1215 Air Purifier",
    type: "purifier",
    description: "Compact air purifier with HEPA filter for small rooms",
    price: "₹12,000",
    rating: 4.2,
    features: [
      "HEPA filter",
      "Compact design",
      "Night mode",
      "Filter indicator",
      "Energy efficient"
    ],
    bestFor: ["Small rooms", "Bedrooms", "Study areas"],
    link: "https://philips.com"
  },
  {
    name: "Kaiterra Laser Egg Air Quality Monitor",
    type: "monitor",
    description: "Portable PM2.5 monitor with laser sensor technology",
    price: "₹6,500",
    rating: 4.4,
    features: [
      "Laser sensor",
      "Portable design",
      "Mobile app",
      "Battery powered",
      "Real-time data"
    ],
    bestFor: ["Portable monitoring", "Travel", "Multiple locations"],
    link: "https://kaiterra.com"
  }
];

const protectiveMeasures: ProtectiveMeasure[] = [
  {
    category: "Home Protection",
    title: "Indoor Air Quality Management",
    description: "Comprehensive strategies to improve indoor air quality",
    effectiveness: "high",
    cost: "medium",
    implementation: [
      "Install HEPA air purifiers in living areas",
      "Use air conditioning with proper filters",
      "Keep windows closed during high pollution",
      "Regular cleaning and dusting",
      "Use indoor plants (snake plant, peace lily)"
    ],
    tips: [
      "Replace air filters every 3-6 months",
      "Clean air purifier filters regularly",
      "Monitor indoor humidity levels",
      "Avoid smoking indoors",
      "Use natural cleaning products"
    ]
  },
  {
    category: "Personal Protection",
    title: "Outdoor Safety Measures",
    description: "Personal protective equipment and practices for outdoor activities",
    effectiveness: "high",
    cost: "low",
    implementation: [
      "Wear N95 or N99 masks outdoors",
      "Limit outdoor activities during peak pollution",
      "Use protective eyewear",
      "Stay hydrated",
      "Monitor air quality before going out"
    ],
    tips: [
      "Choose masks with proper fit",
      "Replace masks regularly",
      "Avoid outdoor exercise during high AQI",
      "Plan activities during cleaner hours",
      "Keep rescue medications handy"
    ]
  },
  {
    category: "Workplace Solutions",
    title: "Office Air Quality Management",
    description: "Workplace strategies to protect employees from air pollution",
    effectiveness: "high",
    cost: "high",
    implementation: [
      "Install commercial air purifiers",
      "Implement air quality monitoring",
      "Create clean air zones",
      "Provide protective equipment",
      "Establish air quality policies"
    ],
    tips: [
      "Monitor air quality in different areas",
      "Provide N95 masks to employees",
      "Allow work from home during high pollution",
      "Regular maintenance of HVAC systems",
      "Employee education on air quality"
    ]
  },
  {
    category: "School Protection",
    title: "Educational Institution Safety",
    description: "Protecting children and students from air pollution",
    effectiveness: "high",
    cost: "medium",
    implementation: [
      "Install air purifiers in classrooms",
      "Monitor air quality continuously",
      "Limit outdoor activities",
      "Provide masks to students",
      "Educate about air quality"
    ],
    tips: [
      "Keep windows closed during high pollution",
      "Schedule outdoor activities during cleaner hours",
      "Have indoor backup activities",
      "Regular communication with parents",
      "Emergency protocols for severe pollution"
    ]
  },
  {
    category: "Healthcare Facilities",
    title: "Hospital Air Quality Management",
    description: "Specialized air quality solutions for healthcare settings",
    effectiveness: "high",
    cost: "high",
    implementation: [
      "Install medical-grade air purifiers",
      "HEPA filtration systems",
      "UV sterilization",
      "Air quality monitoring",
      "Staff protection protocols"
    ],
    tips: [
      "Regular maintenance of medical equipment",
      "Staff training on air quality",
      "Patient education materials",
      "Emergency response protocols",
      "Collaboration with environmental health"
    ]
  }
];

const emergencySolutions = [
  {
    title: "Emergency Air Quality Kit",
    items: [
      "N95 masks (pack of 10)",
      "Portable air quality monitor",
      "HEPA air purifier",
      "Emergency contact list",
      "First aid supplies"
    ],
    cost: "₹5,000 - ₹15,000"
  },
  {
    title: "Evacuation Plan",
    items: [
      "Identify clean air shelters",
      "Emergency transportation",
      "Communication plan",
      "Essential supplies",
      "Medical information"
    ],
    cost: "Free"
  },
  {
    title: "Medical Emergency Kit",
    items: [
      "Rescue inhalers",
      "Antihistamines",
      "Eye drops",
      "Emergency medications",
      "Medical contact information"
    ],
    cost: "₹2,000 - ₹5,000"
  }
];

export function SolutionsCard() {
  const [activeTab, setActiveTab] = useState('devices');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDevices = selectedCategory === 'all' 
    ? airQualityDevices 
    : airQualityDevices.filter(device => device.bestFor.includes(selectedCategory));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Air Quality Solutions & Integration
          </CardTitle>
          <Badge className="text-sm font-medium bg-green-100 text-green-700">
            PROTECTIVE MEASURES
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Comprehensive solutions for air quality monitoring, purification, and protection
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="protection">Protection</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            {/* Device Categories */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Devices
              </Button>
              <Button
                variant={selectedCategory === 'Home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Home')}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
              <Button
                variant={selectedCategory === 'Office' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Office')}
              >
                <Building className="w-4 h-4 mr-1" />
                Office
              </Button>
              <Button
                variant={selectedCategory === 'Schools' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Schools')}
              >
                <School className="w-4 h-4 mr-1" />
                Schools
              </Button>
            </div>

            {/* Air Quality Devices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDevices.map((device, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">{device.description}</p>
                    </div>
                    <Badge className="text-xs">
                      {device.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{device.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{device.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < Math.floor(device.rating) ? "text-yellow-400" : "text-gray-300"
                              )}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Features:</span>
                      <ul className="text-xs space-y-1 mt-1">
                        {device.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Best for:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {device.bestFor.map((use, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(device.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="protection" className="space-y-4">
            {/* Protective Measures */}
            <div className="space-y-4">
              {protectiveMeasures.map((measure, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{measure.title}</h4>
                      <p className="text-sm text-muted-foreground">{measure.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={cn("text-xs", getEffectivenessColor(measure.effectiveness))}>
                        {measure.effectiveness.toUpperCase()} EFFECTIVENESS
                      </Badge>
                      <Badge className={cn("text-xs", getCostColor(measure.cost))}>
                        {measure.cost.toUpperCase()} COST
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Implementation Steps:</span>
                      <ul className="mt-2 space-y-1">
                        {measure.implementation.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Tips & Best Practices:</span>
                      <ul className="mt-2 space-y-1">
                        {measure.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Setting-specific Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Home Solutions</h4>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• Install HEPA air purifiers in living areas</li>
                  <li>• Use air conditioning with proper filters</li>
                  <li>• Keep windows closed during high pollution</li>
                  <li>• Regular cleaning and dusting</li>
                  <li>• Use indoor plants for natural purification</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium">Workplace Solutions</h4>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• Install commercial air purifiers</li>
                  <li>• Implement air quality monitoring</li>
                  <li>• Create clean air zones</li>
                  <li>• Provide protective equipment</li>
                  <li>• Establish air quality policies</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <School className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium">School Solutions</h4>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• Install air purifiers in classrooms</li>
                  <li>• Monitor air quality continuously</li>
                  <li>• Limit outdoor activities</li>
                  <li>• Provide masks to students</li>
                  <li>• Educate about air quality</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Hospital className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium">Healthcare Solutions</h4>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• Install medical-grade air purifiers</li>
                  <li>• HEPA filtration systems</li>
                  <li>• UV sterilization</li>
                  <li>• Air quality monitoring</li>
                  <li>• Staff protection protocols</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            {/* Emergency Solutions */}
            <div className="space-y-4">
              {emergencySolutions.map((solution, index) => (
                <div key={index} className="p-4 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-red-800">{solution.title}</h4>
                    <Badge className="bg-red-600 text-white text-xs">
                      {solution.cost}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-red-800">Essential Items:</span>
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      {solution.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Emergency Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Emergency Contacts:</span>
                  <ul className="mt-2 space-y-1">
                    <li>Emergency: 112</li>
                    <li>Ambulance: 102</li>
                    <li>Police: 100</li>
                    <li>Fire: 101</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Air Quality Resources:</span>
                  <ul className="mt-2 space-y-1">
                    <li>CPCB: cpcb.nic.in</li>
                    <li>SAFAR: safar.tropmet.res.in</li>
                    <li>Delhi Pollution Control</li>
                    <li>Air Quality Index Portal</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
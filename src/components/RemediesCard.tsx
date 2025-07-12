import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Leaf, 
  Droplets, 
  Flame, 
  Sun, 
  Moon, 
  Sprout, 
  Shield, 
  Apple, 
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Remedy {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  whyItHelps: string;
  remedies: {
    title: string;
    description: string;
    instructions: string;
    frequency: string;
  }[];
  precautions: string[];
  bestFor: string[];
  effectiveness: 'high' | 'medium' | 'low';
}

const remedies: Remedy[] = [
  {
    id: 'yoga',
    title: 'Yoga for Respiratory Health',
    subtitle: 'Ancient breathing techniques for lung strength',
    icon: Heart,
    color: '#10B981',
    bgColor: '#ECFDF5',
    whyItHelps: 'Yoga enhances lung capacity, improves breathing efficiency, and reduces stress. Specific pranayama exercises clear airways and strengthen respiratory muscles.',
    remedies: [
      {
        title: 'Anulom Vilom (Alternate Nostril Breathing)',
        description: 'Balances oxygen intake and clears nasal passages',
        instructions: 'Practice for 5-10 minutes daily in a well-ventilated or purified indoor space',
        frequency: 'Daily'
      },
      {
        title: 'Kapalbhati (Skull-Shining Breath)',
        description: 'Detoxifies lungs by forcing out stale air and improving circulation',
        instructions: 'Perform 3-5 rounds of 30 breaths each, avoiding overexertion if AQI is high (>200)',
        frequency: 'Daily'
      },
      {
        title: 'Bhastrika (Bellows Breath)',
        description: 'Increases oxygen supply and strengthens lungs',
        instructions: 'Do 2-3 rounds of 10-15 breaths, ensuring a clean environment',
        frequency: 'Daily'
      }
    ],
    precautions: [
      'Practice yoga indoors during high AQI periods (>150)',
      'Avoid outdoor practice when pollution levels are elevated',
      'Start slowly and increase duration gradually'
    ],
    bestFor: ['Respiratory health', 'Stress reduction', 'Lung capacity'],
    effectiveness: 'high'
  },
  {
    id: 'black-pepper',
    title: 'Black Pepper for Throat Relief',
    subtitle: 'Kali mirch - Natural expectorant and anti-inflammatory',
    icon: Flame,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    whyItHelps: 'Black pepper has anti-inflammatory, antimicrobial, and expectorant properties. It helps clear throat irritation and mucus caused by pollutants.',
    remedies: [
      {
        title: 'Black Pepper Tea',
        description: 'Soothes throat irritation caused by PM10 or NO2 exposure',
        instructions: 'Boil 2-3 crushed black peppercorns with 1 tsp honey and a pinch of turmeric in 1 cup water. Sip slowly.',
        frequency: '1-2 times daily'
      },
      {
        title: 'Black Pepper and Honey Mix',
        description: 'Reduces throat congestion and boosts immunity',
        instructions: 'Mix ¼ tsp black pepper powder with 1 tsp honey. Take once daily.',
        frequency: 'Once daily'
      },
      {
        title: 'Black Pepper Gargle',
        description: 'Relieves throat itchiness from pollution',
        instructions: 'Add a pinch of black pepper and salt to warm water for gargling.',
        frequency: 'As needed'
      }
    ],
    precautions: [
      'Avoid excessive consumption if you have digestive issues',
      'May cause acid reflux in sensitive individuals',
      'Use in moderation'
    ],
    bestFor: ['Throat irritation', 'Mucus clearance', 'Immunity boost'],
    effectiveness: 'high'
  },
  {
    id: 'tulsi',
    title: 'Tulsi (Holy Basil) for Immunity',
    subtitle: 'Sacred herb for respiratory support',
    icon: Leaf,
    color: '#059669',
    bgColor: '#ECFDF5',
    whyItHelps: 'Tulsi is a potent adaptogen and antioxidant in Ayurveda, known to protect against respiratory infections and reduce inflammation caused by pollutants.',
    remedies: [
      {
        title: 'Tulsi Tea',
        description: 'Clears airways and boosts immunity against pollution-related stress',
        instructions: 'Boil 5-7 fresh tulsi leaves in 1 cup water with a pinch of ginger. Drink 1-2 times daily.',
        frequency: '1-2 times daily'
      },
      {
        title: 'Tulsi Chewing',
        description: 'Reduces throat irritation and strengthens lungs',
        instructions: 'Chew 2-3 fresh tulsi leaves daily.',
        frequency: 'Daily'
      },
      {
        title: 'Tulsi Steam Inhalation',
        description: 'Clears nasal passages and respiratory system',
        instructions: 'Add 5-6 tulsi leaves to boiling water, cover head with towel, inhale steam for 5 minutes.',
        frequency: 'As needed'
      }
    ],
    precautions: [
      'Can be grown indoors to purify air naturally',
      'Releases oxygen and absorbs some pollutants',
      'Safe for most people'
    ],
    bestFor: ['Immunity boost', 'Respiratory health', 'Air purification'],
    effectiveness: 'high'
  },
  {
    id: 'ginger',
    title: 'Ginger for Detoxification',
    subtitle: 'Adrak - Warming and anti-inflammatory properties',
    icon: Flame,
    color: '#DC2626',
    bgColor: '#FEF2F2',
    whyItHelps: 'Ginger has warming and anti-inflammatory properties, helping to clear mucus and soothe respiratory irritation caused by air pollution.',
    remedies: [
      {
        title: 'Ginger-Honey Tea',
        description: 'Reduces throat irritation and improves digestion',
        instructions: 'Mix 1 tsp grated ginger with 1 tsp honey in warm water. Drink 1-2 times daily.',
        frequency: '1-2 times daily'
      },
      {
        title: 'Ginger and Turmeric Milk',
        description: 'Detoxifies and reduces inflammation from pollutant exposure',
        instructions: 'Add ½ tsp grated ginger and a pinch of turmeric to warm milk. Consume at night.',
        frequency: 'Nightly'
      }
    ],
    precautions: [
      'Limit if you have Pitta constitution (Ayurvedic body type)',
      'May cause heat sensitivity in some individuals',
      'Use in moderation'
    ],
    bestFor: ['Detoxification', 'Anti-inflammatory', 'Digestive health'],
    effectiveness: 'high'
  },
  {
    id: 'turmeric',
    title: 'Turmeric for Anti-Inflammatory Support',
    subtitle: 'Haldi - Powerful antioxidant and anti-inflammatory',
    icon: Sun,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    whyItHelps: 'Turmeric, with its active compound curcumin, is a powerful antioxidant and anti-inflammatory agent, countering oxidative stress from pollutants like PM2.5.',
    remedies: [
      {
        title: 'Turmeric Milk (Haldi Doodh)',
        description: 'Reduces inflammation and supports lung health',
        instructions: 'Mix ¼ tsp turmeric powder in warm milk with a pinch of black pepper to enhance absorption.',
        frequency: 'Nightly'
      },
      {
        title: 'Turmeric Gargle',
        description: 'Soothes throat irritation from smog',
        instructions: 'Add ½ tsp turmeric and a pinch of salt to warm water for gargling.',
        frequency: 'As needed'
      },
      {
        title: 'Turmeric Steam',
        description: 'Clears respiratory passages',
        instructions: 'Add 1 tsp turmeric to boiling water for steam inhalation.',
        frequency: 'As needed'
      }
    ],
    precautions: [
      'Consult doctor if on blood-thinning medications',
      'May interact with certain medications',
      'Use with black pepper for better absorption'
    ],
    bestFor: ['Anti-inflammatory', 'Antioxidant', 'Lung health'],
    effectiveness: 'high'
  },
  {
    id: 'jaggery',
    title: 'Jaggery (Gur) for Detoxification',
    subtitle: 'Natural cleanser for respiratory system',
    icon: Apple,
    color: '#7C3AED',
    bgColor: '#F3F4F6',
    whyItHelps: 'Jaggery is a natural cleanser in Ayurveda, helping to clear toxins from the lungs and improve digestion, which supports immunity against pollution effects.',
    remedies: [
      {
        title: 'Jaggery Water',
        description: 'Detoxifies the respiratory system',
        instructions: 'Dissolve 1-2 tsp jaggery in warm water and drink daily.',
        frequency: 'Daily'
      },
      {
        title: 'Jaggery with Ghee',
        description: 'Supports lung health and reduces mucus buildup',
        instructions: 'Mix 1 tsp jaggery with a few drops of ghee and consume after meals.',
        frequency: 'After meals'
      }
    ],
    precautions: [
      'Avoid in large quantities if diabetic',
      'High in natural sugar content',
      'Use in moderation'
    ],
    bestFor: ['Detoxification', 'Digestive health', 'Mucus reduction'],
    effectiveness: 'medium'
  },
  {
    id: 'nasya',
    title: 'Ayurvedic Nasya (Nasal Drops)',
    subtitle: 'Traditional nasal protection from pollutants',
    icon: Droplets,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    whyItHelps: 'Nasya involves administering herbal oils in the nostrils to lubricate and protect nasal passages from pollutants. Effective for preventing dryness and irritation.',
    remedies: [
      {
        title: 'Anu Taila Nasya',
        description: 'Lubricates and protects nasal passages from pollutants',
        instructions: 'Use 2-3 drops of Anu Taila or sesame oil in each nostril daily, preferably in the morning.',
        frequency: 'Daily (morning)'
      }
    ],
    precautions: [
      'Consult an Ayurvedic practitioner for proper technique',
      'Incorrect use can cause discomfort',
      'Use appropriate oil selection'
    ],
    bestFor: ['Nasal protection', 'Airway lubrication', 'Pollution defense'],
    effectiveness: 'high'
  },
  {
    id: 'neem',
    title: 'Neem for Purification',
    subtitle: 'Natural antimicrobial and detoxifier',
    icon: Sprout,
    color: '#059669',
    bgColor: '#ECFDF5',
    whyItHelps: 'Neem is a natural antimicrobial and detoxifier, helping to combat infections and purify blood affected by pollution exposure.',
    remedies: [
      {
        title: 'Neem Tea',
        description: 'Boosts immunity and purifies blood',
        instructions: 'Boil 5-6 neem leaves in water and drink once daily.',
        frequency: 'Once daily'
      },
      {
        title: 'Neem Face Wash',
        description: 'Cleanses skin of pollutant residue',
        instructions: 'Use neem-based soaps or washes to reduce skin irritation.',
        frequency: 'Daily'
      }
    ],
    precautions: [
      'Neem is bitter and cooling',
      'Avoid if you have a cold or low body temperature',
      'Use in moderation'
    ],
    bestFor: ['Blood purification', 'Skin protection', 'Immunity boost'],
    effectiveness: 'medium'
  },
  {
    id: 'diet',
    title: 'Dietary Recommendations',
    subtitle: 'Nutrient-rich diet for pollution protection',
    icon: Apple,
    color: '#DC2626',
    bgColor: '#FEF2F2',
    whyItHelps: 'A nutrient-rich diet strengthens immunity and counters oxidative stress from pollutants. Ayurveda emphasizes warm, light, and sattvic foods during pollution exposure.',
    remedies: [
      {
        title: 'Amla (Indian Gooseberry)',
        description: 'High vitamin C content fights oxidative stress from PM2.5',
        instructions: 'Consume 1 tsp amla juice or 1 raw amla daily.',
        frequency: 'Daily'
      },
      {
        title: 'Ghee',
        description: 'Lubricates respiratory passages and improves digestion',
        instructions: 'Take 1 tsp pure ghee daily to support detoxification.',
        frequency: 'Daily'
      },
      {
        title: 'Warm Soups',
        description: 'Aids digestion and reduces mucus',
        instructions: 'Include lentil or vegetable soups with spices like cumin, coriander, and fennel.',
        frequency: 'Regular meals'
      }
    ],
    precautions: [
      'Avoid cold, heavy foods during high AQI',
      'Dairy and fried items can increase mucus production',
      'Focus on warm, light foods'
    ],
    bestFor: ['Immunity boost', 'Digestive health', 'Oxidative stress reduction'],
    effectiveness: 'high'
  },
  {
    id: 'meditation',
    title: 'Meditation and Stress Reduction',
    subtitle: 'Traditional Indian practice for mental resilience',
    icon: Brain,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    whyItHelps: 'Pollution can increase stress and weaken immunity. Meditation reduces cortisol levels and supports mental resilience against environmental stressors.',
    remedies: [
      {
        title: 'Mindfulness Meditation',
        description: 'Reduces stress and supports mental resilience',
        instructions: 'Practice 5-10 minutes of mindfulness meditation daily in a clean indoor environment.',
        frequency: 'Daily'
      },
      {
        title: 'Dhyana (Deep Meditation)',
        description: 'Traditional Indian meditation for stress reduction',
        instructions: 'Focus on deep breathing and mental clarity in a purified space.',
        frequency: 'Daily'
      }
    ],
    precautions: [
      'Combine with yoga for best results',
      'Avoid outdoor meditation during high AQI periods',
      'Practice in clean, well-ventilated spaces'
    ],
    bestFor: ['Stress reduction', 'Mental resilience', 'Immunity support'],
    effectiveness: 'high'
  }
];

export function RemediesCard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null);

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRemedies = activeTab === 'all' 
    ? remedies 
    : remedies.filter(remedy => remedy.bestFor.some(benefit => benefit.toLowerCase().includes(activeTab)));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Traditional Remedies for Air Pollution Protection
          </CardTitle>
          <Badge className="text-sm font-medium bg-green-100 text-green-700">
            AYURVEDIC WISDOM
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Ancient Indian remedies and practices to protect against air pollution effects
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Remedies</TabsTrigger>
            <TabsTrigger value="respiratory">Respiratory</TabsTrigger>
            <TabsTrigger value="immunity">Immunity</TabsTrigger>
            <TabsTrigger value="detoxification">Detox</TabsTrigger>
            <TabsTrigger value="stress">Stress Relief</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Remedy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRemedies.map((remedy) => {
                const Icon = remedy.icon;
                return (
                  <div
                    key={remedy.id}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedRemedy(remedy)}
                  >
                    <Card 
                      className="h-full border-2 hover:border-4 transition-all duration-300"
                      style={{ 
                        borderColor: remedy.color,
                        backgroundColor: remedy.bgColor 
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: remedy.color + '20' }}
                            >
                              <Icon 
                                className="w-6 h-6" 
                                style={{ color: remedy.color }}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold">
                                {remedy.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {remedy.subtitle}
                              </p>
                            </div>
                          </div>
                          <Badge className={cn("text-xs", getEffectivenessColor(remedy.effectiveness))}>
                            {remedy.effectiveness.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Why it helps:</h4>
                          <p className="text-sm text-muted-foreground">
                            {remedy.whyItHelps}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Best for:</h4>
                          <div className="flex flex-wrap gap-1">
                            {remedy.bestFor.map((benefit, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: remedy.color, color: remedy.color }}
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          style={{ borderColor: remedy.color, color: remedy.color }}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detailed Remedy Modal */}
        {selectedRemedy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: selectedRemedy.bgColor }}
                    >
                      <selectedRemedy.icon 
                        className="w-8 h-8" 
                        style={{ color: selectedRemedy.color }}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedRemedy.title}</h2>
                      <p className="text-muted-foreground">{selectedRemedy.subtitle}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedRemedy(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Why it helps */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Why it helps
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedRemedy.whyItHelps}
                    </p>
                  </div>

                  {/* Remedies */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommended Remedies
                    </h3>
                    <div className="space-y-4">
                      {selectedRemedy.remedies.map((remedy, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{remedy.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {remedy.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">Instructions:</span>
                            </div>
                            <p className="ml-6">{remedy.instructions}</p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Frequency:</span>
                              <Badge variant="outline" className="text-xs">
                                {remedy.frequency}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Precautions */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Precautions
                    </h3>
                    <ul className="space-y-2">
                      {selectedRemedy.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Effectiveness */}
                  <div>
                    <h3 className="font-semibold mb-2">Effectiveness</h3>
                    <Badge className={cn("text-sm", getEffectivenessColor(selectedRemedy.effectiveness))}>
                      {selectedRemedy.effectiveness.toUpperCase()} EFFECTIVENESS
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
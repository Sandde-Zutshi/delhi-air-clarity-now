import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Loader2, 
  X,
  Globe,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchCities, LocationData } from '@/lib/api';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  currentLocation: string;
  loading?: boolean;
}

export function LocationSearch({ 
  onLocationSelect, 
  onCurrentLocation, 
  currentLocation,
  loading = false 
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCities(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location.name);
    setSearchQuery(location.name);
    setShowResults(false);
  };

  const handleCurrentLocation = () => {
    onCurrentLocation();
    setSearchQuery('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="pl-10 pr-10"
                disabled={loading}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Current Location Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCurrentLocation}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">My Location</span>
            </Button>
          </div>

          {/* Current Location Display */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{currentLocation}</span>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="glass-card max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {searchResults.map((location, index) => (
                  <motion.div
                    key={`${location.name}-${location.country}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-b-0",
                      "flex items-center justify-between"
                    )}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {location.state && `${location.state}, `}{location.country}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Searching...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
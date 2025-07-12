import React, { createContext, useContext, useState } from 'react';

interface AQICardHoverContextType {
  activeCardId: string | null;
  hoveredPoint: { value: number; time: string; hour: number } | null;
  setActiveCard: (cardId: string, point: { value: number; time: string; hour: number } | null) => void;
}

const AQICardHoverContext = createContext<AQICardHoverContextType | undefined>(undefined);

export const AQICardHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ value: number; time: string; hour: number } | null>(null);

  const setActiveCard = (cardId: string, point: { value: number; time: string; hour: number } | null) => {
    setActiveCardId(cardId);
    setHoveredPoint(point);
  };

  return (
    <AQICardHoverContext.Provider value={{ activeCardId, hoveredPoint, setActiveCard }}>
      {children}
    </AQICardHoverContext.Provider>
  );
};

export function useAQICardHover() {
  const ctx = useContext(AQICardHoverContext);
  if (!ctx) throw new Error('useAQICardHover must be used within AQICardHoverProvider');
  return ctx;
} 
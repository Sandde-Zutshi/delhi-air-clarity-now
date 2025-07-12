import React from 'react';
import { RefreshCw, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface RequestUsageCardProps {
  totalRequests: number;
  manualRefreshCount: number;
  remainingRequests: number;
  remainingManualRefreshes: number;
  timeUntilReset: string;
  canManualRefresh: boolean;
}

export default function RequestUsageCard({
  totalRequests,
  manualRefreshCount,
  remainingRequests,
  remainingManualRefreshes,
  timeUntilReset,
  canManualRefresh
}: RequestUsageCardProps) {
  const dailyLimit = 1000;
  const manualRefreshLimit = 436;
  
  const totalUsagePercent = (totalRequests / dailyLimit) * 100;
  const manualUsagePercent = (manualRefreshCount / manualRefreshLimit) * 100;

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'text-red-500';
    if (percent >= 75) return 'text-orange-500';
    if (percent >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsageBgColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-100';
    if (percent >= 75) return 'bg-orange-100';
    if (percent >= 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          API Usage
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Resets in {timeUntilReset}</span>
        </div>
      </div>

      {/* Daily Requests */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Daily Requests</span>
          <span className={`text-sm font-semibold ${getUsageColor(totalUsagePercent)}`}>
            {totalRequests} / {dailyLimit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(totalUsagePercent)}`}
            style={{ width: `${Math.min(totalUsagePercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">Remaining: {remainingRequests}</span>
          <span className="text-xs text-gray-500">{totalUsagePercent.toFixed(1)}% used</span>
        </div>
      </div>

      {/* Manual Refreshes */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Manual Refreshes</span>
          <span className={`text-sm font-semibold ${getUsageColor(manualUsagePercent)}`}>
            {manualRefreshCount} / {manualRefreshLimit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(manualUsagePercent)}`}
            style={{ width: `${Math.min(manualUsagePercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">Remaining: {remainingManualRefreshes}</span>
          <span className="text-xs text-gray-500">{manualUsagePercent.toFixed(1)}% used</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
        {canManualRefresh ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            {canManualRefresh ? 'Manual refresh available' : 'Manual refresh limit reached'}
          </p>
          <p className="text-xs text-gray-600">
            {canManualRefresh 
              ? `${remainingManualRefreshes} refreshes remaining today`
              : 'Limit resets tomorrow at midnight'
            }
          </p>
        </div>
      </div>

      {/* Smart Distribution Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Smart Request Distribution</h4>
        <div className="space-y-1 text-xs text-blue-700">
          <div className="flex justify-between">
            <span>6 AM - 12 AM:</span>
            <span>Every 2 minutes</span>
          </div>
          <div className="flex justify-between">
            <span>12 AM - 6 AM:</span>
            <span>Every 15 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import { useApiData } from '@/hooks/useApiData';

interface RefreshButtonProps {
  variant?: 'groundStations' | 'satellites' | 'all';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  variant = 'all',
  size = 'md',
  className = ''
}) => {
  const { refreshAllData, refreshGroundStations, refreshSatellites, isLoading } = useApiData();

  const handleRefresh = async () => {
    switch (variant) {
      case 'groundStations':
        await refreshGroundStations();
        break;
      case 'satellites':
        await refreshSatellites();
        break;
      case 'all':
      default:
        await refreshAllData();
        break;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
        text-white font-medium rounded-md
        transition-colors duration-200
        flex items-center gap-2
        ${className}
      `}
    >
      <svg 
        className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </button>
  );
};

import React from 'react';
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Please wait...', 
  fullScreen = true,
  size = 'md',
  color = '#4A90E2' 
}) => {
  const sizeVariants = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 bg-white/90 z-50'
      )}
    >
      {/* Custom Spinner */}
      <div 
        className={cn(
          'relative flex justify-center items-center',
          sizeVariants[size]
        )}
      >
        <div 
          className="absolute inset-0 border-4 border-dashed rounded-full animate-spin"
          style={{
            borderColor: `${color} transparent transparent transparent`
          }}
        ></div>
      </div>

      {/* Loading Message */}
      {message && (
        <span className="mt-4 text-gray-700 text-sm font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

export default Loading;

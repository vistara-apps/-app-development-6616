import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading indicator component with different variants
 * @param {object} props - Component props
 * @param {string} props.size - Size of the loading indicator (small, medium, large)
 * @param {string} props.type - Type of loading indicator (spinner, pulse, bar)
 * @param {string} props.text - Text to display with the loading indicator
 * @param {boolean} props.fullScreen - Whether to display the loading indicator full screen
 * @param {string} props.color - Color of the loading indicator
 */
const LoadingIndicator = ({ 
  size = 'medium', 
  type = 'spinner', 
  text = 'Loading...', 
  fullScreen = false,
  color = 'accent'
}) => {
  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Color classes
  const colorClasses = {
    accent: 'text-accent',
    primary: 'text-primary',
    purple: 'text-purple-medium',
    white: 'text-white'
  };

  // Render spinner type
  const renderSpinner = () => (
    <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
  );

  // Render pulse type
  const renderPulse = () => (
    <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse ${colorClasses[color]}`}></div>
  );

  // Render bar type
  const renderBar = () => (
    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${colorClasses[color]} animate-loading-bar`}></div>
    </div>
  );

  // Render loading indicator based on type
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'pulse':
        return renderPulse();
      case 'bar':
        return renderBar();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  // Full screen loading indicator
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {renderLoadingIndicator()}
          {text && <p className="text-text-primary font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  // Inline loading indicator
  return (
    <div className="flex items-center space-x-3">
      {renderLoadingIndicator()}
      {text && <p className="text-text-secondary">{text}</p>}
    </div>
  );
};

export default LoadingIndicator;


import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  statusColor?: 'green' | 'red' | 'yellow' | 'gray';
}

/**
 * Avatar component that displays initials in a colored circle
 */
const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
  showStatus = false,
  statusColor = 'green',
}) => {
  // Get initials (up to 2 letters) from the name
  const nameParts = name.split(' ');
  let initials = nameParts[0].charAt(0).toUpperCase();
  
  // Add second initial if available
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0).toUpperCase();
  }
  
  // Generate a consistent color based on the name
  const colors = [
    'from-blue-500 to-sky-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
  ];
  
  // Simple hash function to pick a color based on name
  const colorIndex = name.split('').reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  ) % colors.length;

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Status indicator classes
  const statusClasses = {
    green: 'bg-green-400',
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    gray: 'bg-gray-400',
  };

  return (
    <div className="relative">
      <div 
        className={`
          rounded-full bg-gradient-to-r ${colors[colorIndex]} 
          flex items-center justify-center text-white font-bold 
          shadow-md ring-2 ring-white/30 
          ${sizeClasses[size]} ${className}
        `}
      >
        {initials}
      </div>
      
      {showStatus && (
        <span 
          className={`
            absolute bottom-0 right-0 
            ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} 
            ${statusClasses[statusColor]} 
            border-2 border-white rounded-full
          `}
        />
      )}
    </div>
  );
};

export default Avatar;

// components/FlagIcon.tsx
import React from 'react';

interface FlagIconProps {
  countryCode: string;
  size?: number;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ 
  countryCode, 
  size = 20,
  className = ""
}) => {
  const flagSrc = `/flags/${countryCode.toLowerCase()}.png`;

  return (
    <img
      src={flagSrc}
      alt={`${countryCode} flag`}
      width={size}
      height={size * 0.75}
      className={`inline-block ${className}`}
      onError={(e) => {
        // Запасной вариант если иконка не найдена
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default FlagIcon;
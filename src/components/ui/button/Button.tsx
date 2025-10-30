import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  ariaLabel, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
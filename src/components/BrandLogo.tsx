import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isLight?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', isLight = false }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circle Icon Badge */}
      <div
        className={`${iconSizes[size]} rounded-full bg-[#0B3D2E] border-2 border-[#C9A227] flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden`}
        title="A.A Properties Kano Logo"
      >
        <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* House Roof and Body */}
          <path
            d="M50 18L18 44H26V78H74V44H82L50 18Z"
            stroke="#C9A227"
            strokeWidth="6"
            strokeLinejoin="round"
            fill="#0B3D2E"
          />
          {/* Key Emblem inside House */}
          <circle cx="50" cy="46" r="8" stroke="#C9A227" strokeWidth="4" />
          <path d="M50 54V68M50 62H56M50 66H55" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-tight">
        <div className={`font-extrabold tracking-tight font-['Poppins'] flex items-baseline gap-1.5 ${textSizes[size]}`}>
          <span className="text-[#C9A227]">A.A PROPERTIES</span>
          <span className={isLight ? 'text-white' : 'text-[#0B3D2E]'}>KANO</span>
        </div>
        <span className={`tracking-widest uppercase font-semibold text-[#8B9E97] ${subSizes[size]}`}>
          Properties You Can Trust
        </span>
      </div>
    </div>
  );
};

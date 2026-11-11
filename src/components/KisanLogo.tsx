import React from 'react';

interface KisanLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

/**
 * Faithful, transparent restoration of the user's authentic Kisan Suvidha logo:
 * Preserves the exact original green shield, golden wheat stalks, sprouting leaf,
 * white certified checkmark badge, and Indian tricolour arc with zero outer white bounding box.
 */
export const KisanLogo: React.FC<KisanLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  alt = "Kisan Suvidha Logo"
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/assets/kisan-logo-transparent.png"
      alt={alt}
      className={`shrink-0 object-contain select-none ${className}`}
      style={style}
      loading="eager"
      onError={(e) => {
        // Fallback paths in case of environment routing differences
        const target = e.currentTarget;
        if (!target.dataset.triedFallback) {
          target.dataset.triedFallback = '1';
          target.src = '/kisan-logo-transparent.png';
        } else if (target.dataset.triedFallback === '1') {
          target.dataset.triedFallback = '2';
          target.src = '/assets/aistudio/Tricolour_Certified_Agriculture_Shield__3__b991f068.png';
        }
      }}
    />
  );
};

export default KisanLogo;

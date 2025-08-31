'use client';

import React from 'react';
import Image from 'next/image';
import { BRANDING_CONFIG, getLogoComponent } from '@/config/branding';
import { Car, Building, ParkingCircle, Image as ImageIcon } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  centered?: boolean; // Tambah prop untuk centering
}

export function Logo({ 
  size = 'medium', 
  showText = true, 
  showTagline = false,
  className = '',
  centered = false
}: LogoProps) {
  const logoConfig = getLogoComponent(size);
  const { company } = BRANDING_CONFIG;
  
  // Render logo berdasarkan tipe
  const renderLogo = () => {
    if (logoConfig.type === 'image' && logoConfig.image) {
      // Fallback ke icon jika image tidak ada
      try {
        return (
          <Image
            src={logoConfig.image.src}
            alt={logoConfig.image.alt}
            width={logoConfig.image.width}
            height={logoConfig.image.height}
            className={`${logoConfig.sizeClass} object-contain`}
            onError={() => {
              console.warn('Logo image not found, falling back to icon');
            }}
          />
        );
      } catch (error) {
        console.warn('Error loading logo image, falling back to icon');
        // Fallback ke icon
        const iconClass = `text-white ${logoConfig.sizeClass}`;
        return <Car className={iconClass} />;
      }
    }
    
    // Icon-based logo
    const iconClass = `text-white ${logoConfig.sizeClass}`;
    
    switch (logoConfig.component) {
      case 'CarIcon':
        return <Car className={iconClass} />;
      case 'BuildingIcon':
        return <Building className={iconClass} />;
      case 'ParkingIcon':
        return <ParkingCircle className={iconClass} />;
      case 'CustomIcon':
        return <ImageIcon className={iconClass} />;
      default:
        return <Car className={iconClass} />;
    }
  };

  // Layout class berdasarkan props
  const layoutClass = centered 
    ? 'flex flex-col items-center justify-center text-center space-y-3' 
    : 'flex items-center space-x-3';

  return (
    <div className={`${layoutClass} ${className}`}>
      {/* Logo Icon/Image */}
      {logoConfig.type === 'image' && logoConfig.image ? (
        <div className="flex justify-center">
          {renderLogo()}
        </div>
      ) : (
        <div 
          className="rounded-lg flex items-center justify-center"
          style={{ backgroundColor: logoConfig.color }}
        >
          {renderLogo()}
        </div>
      )}
      
      {/* Company Name & Tagline */}
      {showText && (
        <div className={`flex flex-col ${centered ? 'items-center' : ''}`}>
          <h1 className={`font-bold text-gray-900 ${centered ? 'text-2xl' : 'text-lg'}`}>
            {company.name}
          </h1>
          {showTagline && (
            <p className={`text-gray-500 ${centered ? 'text-base' : 'text-sm'}`}>
              {company.tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Export default untuk kemudahan import
export default Logo;

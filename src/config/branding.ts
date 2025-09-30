// Branding Configuration - Mudah diubah untuk customisasi
export const BRANDING_CONFIG = {
    // Logo settings
    logo: {
        // Tipe logo yang digunakan
        type: 'image', // Options: 'icon', 'image', 'text-only'
        // Icon settings (jika menggunakan icon)
        icon: 'car', // Options: 'car', 'building', 'parking', 'custom'

        // Image settings (jika menggunakan image)
        image: {
            src: '/images/logoAerParkingLCC.png', // Path ke file logo image
            alt: 'Nivora Park Logo',
            width: 48,
            height: 48,
        },

        // Custom icon path (jika menggunakan custom icon)
        customIconPath: '/icons/custom-logo.svg',

        // Logo colors
        colors: {
            primary: '#3B82F6', // Blue - bisa ganti hex color
            secondary: '#1E40AF',
            text: '#1F2937',
            background: '#FFFFFF',
        },

        // Logo size
        size: {
            small: 'w-8 h-8',
            medium: 'w-12 h-12',
            large: 'w-16 h-16',
        },
    },

    // Company/App info - MUDAH DIUBAH!
    company: {
        name: 'Aer Parking LCC',           // 👈 GANTI NAMA DISINI
        tagline: 'Dashboard Monitoring Transaksi guys', // 👈 GANTI TAGLINE DISINI
        description: 'Sistem monitoring transaksi parkir yang terintegrasi',

        // Contact info
        contact: {
            email: 'info@nivorapark.com',
            phone: '+62 812-0000-0000',
            address: 'Jakarta, Indonesia',
        },
    },

    // Theme colors
    theme: {
        primary: '#3B82F6',     // Blue
        secondary: '#10B981',   // Green
        accent: '#F59E0B',      // Yellow
        success: '#10B981',     // Green
        warning: '#F59E0B',     // Yellow
        error: '#EF4444',       // Red
        info: '#3B82F6',        // Blue
    },

    // Navigation
    navigation: {
        showLogo: true,
        showCompanyName: true,
        showTagline: false,
    },
};

// Helper function untuk get logo component
export const getLogoComponent = (size: 'small' | 'medium' | 'large' = 'medium') => {
    const { type, icon, image, colors, size: sizeConfig } = BRANDING_CONFIG.logo;

    const sizeClass = sizeConfig[size];

    if (type === 'image') {
        return {
            type: 'image',
            component: 'ImageLogo',
            sizeClass,
            image: image,
            color: colors.primary,
        };
    }

    // Icon-based logo
    switch (icon) {
        case 'car':
            return {
                type: 'icon',
                icon: '🚗',
                component: 'CarIcon',
                sizeClass,
                color: colors.primary,
            };

        case 'building':
            return {
                type: 'icon',
                icon: '🏢',
                component: 'BuildingIcon',
                sizeClass,
                color: colors.primary,
            };

        case 'parking':
            return {
                type: 'icon',
                icon: '🅿️',
                component: 'ParkingIcon',
                sizeClass,
                color: colors.primary,
            };

        case 'custom':
            return {
                type: 'icon',
                icon: '🎨',
                component: 'CustomIcon',
                sizeClass,
                color: colors.primary,
                path: BRANDING_CONFIG.logo.customIconPath,
            };

        default:
            return {
                type: 'icon',
                icon: '🚗',
                component: 'CarIcon',
                sizeClass,
                color: colors.primary,
            };
    }
};

import React from 'react';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    bordered?: boolean;
}

// Tailwind size classes
const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-32 h-32 text-2xl',
};

// Actual CSS size values (in pixels)
const sizeValues = {
    sm: '2rem',    // 32px
    md: '2.5rem',  // 40px
    lg: '4rem',    // 64px
    xl: '6rem',    // 96px
    '2xl': '8rem', // 128px
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    fallback = '?',
    size = 'md',
    className = '',
    bordered = false,
}) => {
    // Base classes - critical classes that should not be overridden
    const baseClasses = "object-cover object-center shrink-0 !rounded-full";

    // Base classes for the placeholder
    const placeholderClasses = "flex items-center justify-center bg-gray-200 text-gray-600 font-bold shrink-0 !rounded-full";

    // Get size class for text sizing
    const textSizeClass = sizeClasses[size]?.split(' ')[2] || 'text-sm';

    // Border classes
    const borderClass = bordered ? "ring-2 ring-white shadow-sm" : "";

    // Enforce size with inline style
    const sizeStyle = {
        width: sizeValues[size],
        height: sizeValues[size],
        minWidth: sizeValues[size],
        minHeight: sizeValues[size],
        maxWidth: sizeValues[size],
        maxHeight: sizeValues[size],
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`${className} ${borderClass} ${baseClasses}`}
                style={sizeStyle}
            />
        );
    }

    return (
        <div
            className={`${className} ${borderClass} ${placeholderClasses} ${textSizeClass}`}
            style={sizeStyle}
        >
            {typeof fallback === 'string' ? fallback.charAt(0).toUpperCase() : fallback}
        </div>
    );
};

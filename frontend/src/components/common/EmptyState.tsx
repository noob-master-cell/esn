// frontend/src/components/common/EmptyState.tsx
import React from 'react';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
    icon?: IconName;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'alert-circle',
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            {/* Icon with gradient background */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-full">
                    <Icon name={icon} size="2xl" className="text-blue-600" strokeWidth={1.5} />
                </div>
            </div>

            {/* Text content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                    {description}
                </p>
            )}

            {/* Action button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Icon name="plus" size="sm" />
                    {action.label}
                </button>
            )}
        </div>
    );
};

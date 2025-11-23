import React from "react";

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
    <div className="flex items-center mb-6">
        {icon}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
);

import React from "react";

interface TabItem {
    id: string;
    label: string;
    count?: number;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className = "",
}) => {
    return (
        <div className={`border-b border-gray-100 ${className}`}>
            <nav className="-mb-px flex space-x-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`
                                group relative min-w-[100px] py-3 px-4 font-medium text-sm transition-all duration-200 rounded-t-lg
                                ${isActive
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                }
                            `}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span
                                        className={`py-0.5 px-2 rounded-full text-[10px] font-bold transition-colors ${isActive
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </span>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

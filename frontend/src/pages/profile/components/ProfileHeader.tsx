import React from "react";
import { Avatar } from "../../../components/ui/Avatar";

interface ProfileHeaderProps {
    dbUser: any;
    memberSince: number;
    onChangePhoto: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    dbUser,
    memberSince,
    onChangePhoto,
}) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="px-6 md:px-10 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-5xl mx-auto">

                    {/* Avatar */}
                    <div className="relative shrink-0 group/avatar">
                        <Avatar
                            src={dbUser?.avatar}
                            alt="Profile"
                            fallback={dbUser?.firstName || "U"}
                            size="2xl"
                            bordered
                        />

                        {/* Edit Overlay */}
                        <button
                            onClick={onChangePhoto}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 cursor-pointer rounded-full ring-2 ring-white"
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* Status Indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Active Member"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left pt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">
                                    {dbUser?.firstName} {dbUser?.lastName}
                                </h1>
                                <p className="text-gray-500 text-sm mb-3">{dbUser?.email}</p>
                            </div>

                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-600 mt-2">
                            {dbUser?.university && (
                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    <span>🎓</span> {dbUser.university}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                <span>📅</span> Member since {memberSince}
                            </span>
                            {dbUser?.esnCardVerified && (
                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span>💳</span> ESNcard Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

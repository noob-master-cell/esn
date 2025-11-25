import React from "react";

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
        <div className="relative h-72 md:h-80 overflow-hidden bg-blue-900">
            {/* Abstract Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

                {/* Animated Orbs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            </div>

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-6 text-center md:text-left max-w-7xl mx-auto">
                    {/* Avatar Group */}
                    <div className="relative group shrink-0 mb-1 md:mb-0">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl ring-1 ring-black/5">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-4xl font-bold text-indigo-400 relative shadow-inner">
                                {dbUser?.avatar ? (
                                    <img
                                        src={dbUser.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    dbUser?.firstName?.[0]?.toUpperCase() || "U"
                                )}

                                {/* Hover Overlay for Edit */}
                                <button
                                    onClick={onChangePhoto}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                >
                                    <svg className="w-7 h-7 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-gray-900 rounded-full shadow-lg" title="Active Member"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-white pb-1 md:pb-3 w-full">
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-lg truncate mb-2">
                            {dbUser?.firstName} {dbUser?.lastName}
                        </h1>
                        <div className="flex flex-row flex-wrap items-center gap-2.5 mt-2 text-blue-100 justify-center md:justify-start">
                            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:bg-white/20 transition-colors">
                                <span className="text-base">🎓</span> {dbUser?.university || "University not set"}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:bg-white/20 transition-colors">
                                <span className="text-base">📅</span> Member since {memberSince}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

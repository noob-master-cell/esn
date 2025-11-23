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
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg overflow-hidden">
                            {dbUser?.avatar ? (
                                <img
                                    src={dbUser.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                dbUser?.firstName?.[0]?.toUpperCase() || "U"
                            )}
                        </div>
                        <button
                            onClick={onChangePhoto}
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                            {dbUser?.firstName} {dbUser?.lastName}
                        </h1>
                        <p className="text-xl opacity-90">ESN Member since {memberSince}</p>
                        {dbUser?.university && (
                            <p className="text-lg opacity-75">{dbUser.university}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

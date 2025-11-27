import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useMyProfile } from "../../hooks/api/useUsers";
import { Avatar } from "../ui/Avatar";
import {
    HomeIcon,
    CalendarIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeIconSolid,
    CalendarIcon as CalendarIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from "@heroicons/react/24/solid";

export const MobileNavbar: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const location = useLocation();
    const { user: profileData } = useMyProfile({
        skip: !user,
    });

    const userRole = profileData?.role;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);
    const isOrganizer = ["ORGANIZER", "ADMIN", "SUPER_ADMIN"].includes(userRole);

    const isActive = (path: string) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        {
            name: "Home",
            path: "/",
            icon: HomeIcon,
            activeIcon: HomeIconSolid
        },
        {
            name: "Events",
            path: "/events",
            icon: CalendarIcon,
            activeIcon: CalendarIconSolid
        },
    ];

    if (isAdmin || isOrganizer) {
        navItems.push({
            name: "Admin",
            path: "/admin",
            icon: ShieldCheckIcon,
            activeIcon: ShieldCheckIconSolid
        });
    }

    // Profile item or Login item
    const profileItem = isAuthenticated ? {
        name: "Profile",
        path: "/profile",
        icon: UserCircleIcon,
        activeIcon: UserCircleIconSolid
    } : {
        name: "Log in",
        path: "/sign-in", // We'll handle the click to redirect if needed, or just link to sign-in page
        icon: ArrowRightOnRectangleIcon, // Using a different icon for login
        activeIcon: ArrowRightOnRectangleIcon
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = active ? item.activeIcon : item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Icon className="w-6 h-6 transition-transform duration-200" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Profile / Login Item */}
                <Link
                    to={profileItem.path}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(profileItem.path) ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    {isAuthenticated && profileData?.avatar ? (
                        <Avatar
                            src={profileData.avatar}
                            alt="Profile"
                            fallback={profileData.firstName || "U"}
                            size="sm"
                            className={`border-2 ${isActive(profileItem.path) ? "border-blue-600" : "border-transparent"}`}
                            bordered={false}
                        />
                    ) : (
                        <profileItem.icon className="w-6 h-6" />
                    )}
                    <span className="text-[10px] font-medium">{profileItem.name}</span>
                </Link>
            </div>
        </div>
    );
};

import * as React from "react";
import esnLogo from "../../assets/favicon/mstile-70x70.png";
import { Carousel } from "../ui/Carousel";

// ESN images for the carousel
const esnImages = [
    "/images/esn_image_1.png",
    "/images/esn_image_2.png",
    "/images/esn_image_3.png",
];

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pb-20">
            <div className="w-full max-w-5xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {/* Left Side - Form/Content */}
                        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                            <div className="w-full max-w-sm mx-auto">
                                {/* Logo - Centered */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                                        <img
                                            src={esnLogo}
                                            alt="ESN Logo"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                                        {title}
                                    </h1>
                                    <p className="text-gray-600 text-sm mt-2">
                                        {subtitle}
                                    </p>
                                </div>

                                {/* Content (Buttons/Form) */}
                                <div className="space-y-6">
                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Visual Content */}
                        <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden min-h-[500px]">
                            <Carousel images={esnImages} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

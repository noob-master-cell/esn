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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Left Side - Form/Content */}
                            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                                <div className="w-full max-w-md mx-auto">
                                    {/* Logo - Centered */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                                            <img
                                                src={esnLogo}
                                                alt="ESN Logo"
                                                className="h-14 w-14 object-contain"
                                            />
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                                            {title}
                                        </h1>
                                        <p className="text-gray-600 text-base mt-2">
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
                            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden min-h-[600px]">
                                <Carousel images={esnImages} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

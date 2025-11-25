import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookie-consent', 'all');
        setIsVisible(false);
    };

    const handleEssentialOnly = () => {
        localStorage.setItem('cookie-consent', 'essential');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6 z-50 animate-slide-up">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">We value your privacy</h3>
                    <p className="text-gray-600 text-sm">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies.
                        Read our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                    <Button variant="outline" onClick={handleEssentialOnly} className="whitespace-nowrap">
                        Essential Only
                    </Button>
                    <Button onClick={handleAcceptAll} className="whitespace-nowrap">
                        Accept All
                    </Button>
                </div>
            </div>
        </div>
    );
};

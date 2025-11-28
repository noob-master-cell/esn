import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const useInstallPrompt = () => {
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if the event was already captured before this component mounted
        if ((window as any).deferredPrompt) {
            setIsInstallable(true);
        }

        // Listen for the custom event dispatched from main.tsx
        const handleReady = () => {
            setIsInstallable(true);
        };

        window.addEventListener('pwa-install-ready', handleReady);

        return () => {
            window.removeEventListener('pwa-install-ready', handleReady);
        };
    }, []);

    const promptInstall = async () => {
        const deferredPrompt = (window as any).deferredPrompt as BeforeInstallPromptEvent;

        if (!deferredPrompt) {
            return;
        }

        await deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        (window as any).deferredPrompt = null;
        setIsInstallable(false);
    };

    return { isInstallable, promptInstall };
};

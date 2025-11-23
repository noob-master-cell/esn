import { useState, useEffect } from "react";

// Pull-to-refresh hook for mobile
export const usePullToRefresh = (onRefresh: () => void) => {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);

    useEffect(() => {
        let touchStartY = 0;
        let pulling = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                touchStartY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (window.scrollY === 0 && touchStartY > 0) {
                const currentY = e.touches[0].clientY;
                const pullDistance = Math.max(0, currentY - touchStartY);

                if (pullDistance > 10) {
                    pulling = true;
                    setIsPulling(true);
                    setPullDistance(Math.min(pullDistance, 120));
                }
            }
        };

        const handleTouchEnd = () => {
            if (pulling && pullDistance > 80) {
                onRefresh();
            }

            setIsPulling(false);
            setPullDistance(0);
            pulling = false;
            touchStartY = 0;
        };

        document.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [onRefresh, pullDistance]);

    return { isPulling, pullDistance };
};

// Network status hook
export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};

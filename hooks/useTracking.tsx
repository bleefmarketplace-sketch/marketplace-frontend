
export const useTracking = () => {

    const trackEvent = (type: 'view' | 'click' | 'search' | 'cart_add' | 'purchase', productId?: string, metadata?: any) => {
        // Use navigator.sendBeacon for "unloading" events or standard fetch for clicks
        fetch('/api/tracking/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, productId, metadata }),
            keepalive: true, // Ensures request finishes even if user navigates away
        });
    };

    return { trackEvent };
};
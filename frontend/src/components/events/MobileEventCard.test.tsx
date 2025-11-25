import { render, screen, fireEvent } from '@testing-library/react';
import MobileEventCard from './MobileEventCard';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

const mockEvent = {
    id: 'event-1',
    title: 'Test Event',
    startDate: new Date().toISOString(),
    category: 'PARTY',
    maxParticipants: 100,
    registrationCount: 40,
    location: 'Test Location',
};

describe('MobileEventCard', () => {
    it('renders event details correctly', () => {
        render(<MobileEventCard event={mockEvent} />);
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
        expect(screen.getByText('Many Spots Left')).toBeInTheDocument();
    });

    it('navigates to event details on click', () => {
        render(<MobileEventCard event={mockEvent} />);
        const cardTitle = screen.getByText('Test Event');
        fireEvent.click(cardTitle);
        expect(mockNavigate).toHaveBeenCalledWith('/events/event-1');
    });

    it('renders compact variant correctly', () => {
        render(<MobileEventCard event={mockEvent} variant="compact" />);
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        // Compact view might not show location or full badge text
    });

    it('shows "Full" badge when no spots left', () => {
        const fullEvent = { ...mockEvent, registrationCount: 100 };
        render(<MobileEventCard event={fullEvent} />);
        expect(screen.getByText('Full')).toBeInTheDocument();
    });
});

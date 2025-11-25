import { render, screen, fireEvent } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';
import { vi } from 'vitest';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('ServicesSection', () => {
    it('renders the section title', () => {
        render(<ServicesSection />);
        expect(screen.getByText('Why Join ESN?')).toBeInTheDocument();
    });

    it('renders all features', () => {
        render(<ServicesSection />);
        expect(screen.getByText('Exciting Events')).toBeInTheDocument();
        expect(screen.getByText('Global Community')).toBeInTheDocument();
        expect(screen.getByText('Student Discounts')).toBeInTheDocument();
    });

    it('navigates to events page when button is clicked', () => {
        render(<ServicesSection />);
        const button = screen.getByText('View All Events');
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/events');
    });
});

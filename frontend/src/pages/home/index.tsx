import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ServicesSection } from "../../components/home/ServicesSection";
import { FeaturedEventsSection } from "../../components/home/FeaturedEventsSection";

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <FeaturedEventsSection />
        </>
    );
};

export default HomePage;

import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ServicesSection } from "../../components/home/ServicesSection";

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <ServicesSection />
        </>
    );
};

export default HomePage;

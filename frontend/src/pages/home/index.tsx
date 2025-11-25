import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ServicesSection } from "../../components/home/ServicesSection";
import { FeaturedEventsSection } from "../../components/home/FeaturedEventsSection";
import { AboutSection } from "../../components/home/AboutSection";
import { ESNStoriesSection } from "../../components/home/ESNStoriesSection";

import unifiedBg from "../../assets/images/unified-bg.png";

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <div
                className="w-full relative"
                style={{
                    backgroundImage: `url(${unifiedBg})`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center'
                }}
            >
                <div className="relative z-10">
                    <AboutSection />
                    <ESNStoriesSection />
                    <ServicesSection />
                    <FeaturedEventsSection />
                </div>
            </div>
        </>
    );
};

export default HomePage;

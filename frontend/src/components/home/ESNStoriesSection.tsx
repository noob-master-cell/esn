import React from "react";
import esnIcon from "../../assets/favicon/favicon-32x32.png";

const stories = [
    {
        id: 1,
        name: "Maria Garcia",
        country: "Spain",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        quote: "My Erasmus in Kaiserslautern was the best experience of my life. I found a second family here!",
        role: "Exchange Student"
    },
    {
        id: 2,
        name: "Liam Wilson",
        country: "UK",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
        quote: "The events organized by ESN helped me make friends instantly. The hiking trips were my favorite.",
        role: "International Student"
    },
    {
        id: 3,
        name: "Sophie Dubois",
        country: "France",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        quote: "I learned so much about German culture and improved my language skills. Highly recommend!",
        role: "Erasmus+"
    },
    {
        id: 4,
        name: "Alessandro Rossi",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        quote: "ESN Kaiserslautern made me feel at home. The International Dinner was a culinary masterpiece!",
        role: "Master Student"
    },
    {
        id: 5,
        name: "Elena Popova",
        country: "Bulgaria",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
        quote: "Volunteering with ESN gave me skills I use in my job today. It's more than just parties.",
        role: "ESN Alumna"
    }
];

// Duplicate stories for seamless infinite scroll
const duplicatedStories = [...stories, ...stories];

export const ESNStoriesSection: React.FC = () => {
    return (
        <section className="w-full bg-transparent py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 font-bold tracking-wider uppercase text-xs mb-4 border border-blue-200">
                    Community Voices
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    ESN Stories
                </h2>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                    Hear from students who have lived the Erasmus experience in Kaiserslautern.
                </p>
            </div>

            {/* Scrolling Container */}
            <div className="relative w-full">
                <div className="flex gap-6 animate-scroll-stories w-max px-4">
                    {duplicatedStories.map((story, index) => (
                        <div
                            key={`${story.id}-${index}`}
                            className="w-[350px] bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex-shrink-0 hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={story.image}
                                    alt={story.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                                    <p className="text-sm text-blue-600 font-medium">{story.country}</p>
                                </div>
                            </div>

                            <div className="mb-6">

                                <p className="text-gray-600 italic leading-relaxed">
                                    "{story.quote}"
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                                <img
                                    src={esnIcon}
                                    alt="ESN Logo"
                                    className="w-6 h-6"
                                />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {story.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes scroll-stories {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-350px * 5 - 24px * 5)); /* width + gap * count */
          }
        }
        
        .animate-scroll-stories {
          animation: scroll-stories 40s linear infinite;
        }
        
        .animate-scroll-stories:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

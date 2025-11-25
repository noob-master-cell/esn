import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// FAQ Data
const faqs = [
    // About ESN
    {
        id: '1',
        question: 'What is ESN Kaiserslautern?',
        answer: 'ESN Kaiserslautern is a local section of the Erasmus Student Network, a non-profit international student organization. Our mission is to represent international students and provide opportunities for cultural understanding and self-development under the principle of "Students Helping Students". We work with both RPTU Kaiserslautern and Hochschule Kaiserslautern.',
        category: 'About ESN'
    },
    {
        id: '2',
        question: 'Where can I find your office?',
        answer: 'Our office is located at RPTU Kaiserslautern, Building 42 (Gottlieb-Daimler-Straße 42), Room 136 (International Office). You can also reach us via email at step@rptu.de or follow us on Instagram and Facebook for the latest updates.',
        category: 'About ESN'
    },

    // Events & Activities
    {
        id: '3',
        question: 'What kind of events do you organize?',
        answer: 'We organize a wide range of events to help you integrate and make friends! This includes Welcome Weeks (City Rallies, Barhopping, Campus Treasure Hunts), cultural events (International Dinners, hikes), regular meetups (Lingua language exchange), and trips to cities like Heidelberg or Hambacher Schloss.',
        category: 'Events'
    },
    {
        id: '4',
        question: 'How do I sign up for events?',
        answer: 'You can browse our upcoming events on the "Events" page of this website. Simply click on an event you are interested in to see the details and registration instructions. Some events may require a small fee or the ESNcard.',
        category: 'Events'
    },

    // ESNcard
    {
        id: '5',
        question: 'What is the ESNcard and why should I get one?',
        answer: 'The ESNcard is the membership card of the Erasmus Student Network. It gives you access to all our services and thousands of discounts all over Europe, including 10% off Ryanair flights (plus free luggage!), FlixBus discounts, and many local deals. It serves as proof of membership in our section.',
        category: 'ESNcard'
    },
    {
        id: '6',
        question: 'Who is eligible for an ESNcard?',
        answer: 'You can get an ESNcard if you are an international student (Erasmus+, exchange, or full-degree), an ESN volunteer, or a buddy/mentor. This includes students at RPTU and Hochschule Kaiserslautern.',
        category: 'ESNcard'
    },

    // Living in Kaiserslautern
    {
        id: '7',
        question: 'How does public transport work?',
        answer: 'The bus system in Kaiserslautern is reliable. If you are a student at RPTU or HS, your student ID (Chipkarte) usually serves as your semester ticket, allowing you to use buses and regional trains (VRN area) for free. Note that Google Maps might not always have the most up-to-date bus schedules, so check the VRN app.',
        category: 'Living in KL'
    },
    {
        id: '8',
        question: 'What should I know about shopping and payments?',
        answer: 'Important: Many smaller shops, bakeries, and restaurants in Germany ONLY accept cash (Bargeld) or the German "Girocard" (EC-Karte). Credit cards (Visa/Mastercard) are not accepted everywhere. Also, most shops (except gas stations and some bakeries) are closed on Sundays and public holidays.',
        category: 'Living in KL'
    },
    {
        id: '9',
        question: 'How do I get from Frankfurt Airport to Kaiserslautern?',
        answer: 'The easiest way is by train. From Frankfurt Airport (Fernbahnhof or Regionalbahnhof), you can take a train to Mannheim Hbf and transfer to a train to Kaiserslautern Hbf. The journey takes about 1.5 to 2 hours. Make sure to download the "DB Navigator" app for schedules and tickets.',
        category: 'Living in KL'
    },

    // University Support
    {
        id: '10',
        question: 'Who can help me with academic questions?',
        answer: 'For questions about your study program, courses, or Learning Agreement, contact your departmental coordinator or the International Office at your university (RPTU or HS). ESN can help with general advice and buddy support, but official academic matters should go through university staff.',
        category: 'University'
    },
    {
        id: '11',
        question: 'What is the Buddy Program?',
        answer: 'The Buddy Program pairs incoming international students with local students. Your buddy can help you with practical matters like picking up your keys, showing you around the city, and answering your questions before and after arrival. Contact us or the International Office to sign up!',
        category: 'University'
    }
];

const categories = ['All', 'About ESN', 'Events', 'ESNcard', 'Living in KL', 'University'];

const FAQPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 max-w-xl mx-auto text-xl text-gray-500"
                    >
                        Everything you need to know about ESN Kaiserslautern and your stay.
                    </motion.p>
                </div>

                {/* Search and Filter */}
                <div className="mb-10 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredFaqs.map((faq) => (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Disclosure as="div" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex justify-between w-full px-6 py-5 text-left text-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                                <span className="text-lg font-medium">{faq.question}</span>
                                                <ChevronUpIcon
                                                    className={`${open ? 'transform rotate-180' : ''
                                                        } w-6 h-6 text-blue-500 transition-transform duration-200`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {faq.answer}
                                                </motion.div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No questions found matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-blue-50 rounded-3xl p-8 sm:p-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <a
                        href="/feedback"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        Contact Us
                    </a>
                </div>

            </div>
        </div>
    );
};

export default FAQPage;

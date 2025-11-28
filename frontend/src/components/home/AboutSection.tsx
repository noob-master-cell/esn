import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export const AboutSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full bg-transparent py-20 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

                    {/* Image Side */}
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                alt="Students having fun"
                                className="w-full h-full object-cover"
                                width="2070"
                                height="1380"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <p className="font-bold text-lg">Students Helping Students</p>
                                    <p className="text-sm opacity-90">Since 1989</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">530+ Sections</div>
                                <div className="text-xs text-gray-500">Across Europe</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-pink-50 text-pink-600 font-bold tracking-wider uppercase text-xs mb-4 border border-pink-100">Who We Are</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                                We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">ESN Kaiserslautern</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                ESN Kaiserslautern is a non-profit international student organization. Our mission is to represent international students, thus provide opportunities for cultural understanding and self-development under the principle of <span className="font-semibold text-gray-900">Students Helping Students</span>.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">University Partners</h3>
                                    <p className="text-gray-600">We work closely with RPTU Kaiserslautern and Hochschule Kaiserslautern to support incoming students.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Cultural Exchange</h3>
                                    <p className="text-gray-600">We organize trips, parties, and cultural events to help you explore Germany and meet the world.</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate("/faq")}
                            variant="outline"
                            className="px-8 py-4 !bg-white !text-gray-900 border-gray-200 rounded-2xl font-bold hover:!bg-gray-50 shadow-sm hover:shadow-md inline-flex items-center gap-2"
                        >
                            Read our Survival Guide
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

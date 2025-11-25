import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                Welcome to ESN Kaiserslautern ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; and other similar information.</li>
                                <li><strong>Social Media Login Data:</strong> We may provide you with the option to register with us using your existing social media account details, like your Google or other social media account. If you choose to register in this way, we will collect the information described in the section called "How do we handle your social logins" below.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>To facilitate account creation and logon process.</li>
                                <li>To send administrative information to you.</li>
                                <li>To fulfill and manage your orders and registrations for events.</li>
                                <li>To protect our Services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Data Processors</h2>
                            <p>We use trusted third-party service providers to help us operate our website and services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated to protect your data.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Auth0:</strong> We use Auth0 for secure user authentication and identity management.</li>
                                <li><strong>Cloudinary:</strong> We use Cloudinary to store and serve images uploaded by users.</li>
                                <li><strong>Vercel / Railway:</strong> We use these platforms to host our website and backend services.</li>
                                <li><strong>Google Analytics / Vercel Analytics:</strong> We may use these tools to analyze website traffic and improve user experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How We Handle Your Social Logins</h2>
                            <p>
                                Our website offers you the ability to register and login using your third-party social media account details (like your Google logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
                            </p>
                            <p className="mt-2">
                                We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you on the relevant website. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
                            <p>If you have questions or comments about this policy, you may email us at esn.events.kaiserslautern@gmail.com.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

import React from 'react';

const Imprint: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Imprint (Impressum)</h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Angaben gemäß § 5 TMG</h2>
                            <p>
                                ESN Kaiserslautern<br />
                                [Address Line 1]<br />
                                [Address Line 2]<br />
                                [Postal Code] Kaiserslautern<br />
                                Germany
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Vertreten durch</h2>
                            <p>
                                [Name of Representative 1]<br />
                                [Name of Representative 2]
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Kontakt</h2>
                            <p>
                                Telefon: [Phone Number]<br />
                                E-Mail: esn.events.kaiserslautern@gmail.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Registereintrag</h2>
                            <p>
                                Eintragung im Vereinsregister.<br />
                                Registergericht: [Name of Court]<br />
                                Registernummer: [Registration Number]
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                            <p>
                                [Name of Person Responsible]<br />
                                [Address if different from above]
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Haftungsausschluss (Disclaimer)</h2>
                            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Haftung für Inhalte</h3>
                            <p>
                                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                            </p>
                            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Haftung für Links</h3>
                            <p>
                                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Imprint;

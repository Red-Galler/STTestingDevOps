import React from 'react';


function AboutUs() {
    return (
        <div className="container mx-auto px-4 py-10">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Over Ons</h1>
                <p className="text-lg dark:text-gray-300">

                    Wij zijn een groep van drie gedreven studenten Toegepaste Informatica aan de Odisee Hogeschool in Brussel, 
                    verenigd door onze passie voor web- en app-ontwikkeling. Ons team, bestaande uit Manal, Dalil en Zakaria, heeft zich toegelegd op het leveren van 
                    hoogwaardige digitale oplossingen. Gedurende onze studie hebben we ons gespecialiseerd in verschillende aspecten van softwareontwikkeling, 
                    van diepgaande programmering tot verfijnd UI/UX design.

                    Elk van ons brengt een uniek perspectief en vaardigheden naar het project, waardoor we een goed afgeronde en veelzijdige aanpak kunnen bieden. 
                    Terwijl we ons voorbereiden om onze academische loopbaan af te sluiten, zijn we enthousiast over de mogelijkheden die voor ons liggen in de professionele wereld van 
                    technologie en ontwikkeling.


                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-3xl font-semibold mb-6 dark:text-white">Onze Missie</h2>
                <p className="text-lg dark:text-gray-300">
                Onze missie met deze enquête-applicatie is om een krachtig, gebruiksvriendelijk en toegankelijk platform te bieden dat mensen in staat stelt om met gemak meningen, 
                ervaringen en feedback te verzamelen en te analyseren. 
                <br/>
                <br/>
                Onze applicatie is ontworpen met het oog op flexibiliteit en gebruiksgemak, waardoor gebruikers van alle achtergronden op een intuïtieve manier enquêtes kunnen creëren, 
                verspreiden en de resultaten kunnen analyseren. We richten ons op het aanbieden van een scala aan aanpasbare sjablonen, interactieve elementen en geavanceerde analytische 
                tools die samenwerken om de best mogelijke gebruikerservaring te bieden. Of het nu gaat om marktonderzoek, klanttevredenheid, educatieve doeleinden of persoonlijke interesse, 
                onze applicatie is erop gericht om aan diverse behoeften te voldoen.


                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-3xl font-semibold mb-6 dark:text-white">Ons Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-dark-secondary shadow-lg rounded-lg p-6 text-center">
                        <img src="/profielfoto/Manal.png" alt="Manal Moussaoui" className="w-32 h-32 mx-auto rounded-full mb-4" />
                        <h3 className="text-xl font-semibold dark:text-white">Manal Moussaoui</h3>
                        <p className="text-md dark:text-gray-300">Developer/Analyst</p>
                        <div className="flex justify-center mt-4">
                            <a href="https://www.linkedin.com/in/manal-moussaoui-433627242/" className="text-blue-500 mx-2">LinkedIn</a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-secondary shadow-lg rounded-lg p-6 text-center">
                        <img src= "/profielfoto/DALIL.PNG" alt="Dalil Chibani" className="w-32 h-32 mx-auto rounded-full mb-4" />
                        <h3 className="text-xl font-semibold dark:text-white">Dalil Chibani</h3>
                        <p className="text-md dark:text-gray-300">Developer</p>
                        <div className="flex justify-center mt-4">
                            <a href="https://www.linkedin.com/in/dalil-chibani-8a01361b9/#" className="text-blue-500 mx-2">LinkedIn</a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-secondary shadow-lg rounded-lg p-6 text-center">
                        <img src="/profielfoto/Zakaria.PNG" alt="Zakaria Bouhlala" className="w-32 h-32 mx-auto rounded-full mb-4" />
                        <h3 className="text-xl font-semibold dark:text-white">Zakaria Bouhlala</h3>
                        <p className="text-md dark:text-gray-300">Developer</p>
                        <div className="flex justify-center mt-4">
                            <a href="https://www.linkedin.com/in/zakaria-bouhlala-a28683296/" className="text-blue-500 mx-2">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-semibold mb-6 dark:text-white">Contacteer Ons</h2>
                <p className="text-lg mb-4 dark:text-gray-300">
                    Hebt u een vraag? We horen graag van u. Stuur ons een bericht en we reageren zo snel mogelijk.
                </p>
            </section>
        </div>
    );
}

export default AboutUs;

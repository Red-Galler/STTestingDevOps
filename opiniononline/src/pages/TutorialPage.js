import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from '../App';
import { supabase } from "../supabaseClient";

function TutorialPage() {
    const navigate = useNavigate();
    const loggedInUserId = useContext(userContext).id;

    async function CreateProject() {
        try {
            const { data, error } = await supabase.rpc('create_survey', { owner_id: loggedInUserId });

            if (error) throw error;

            navigate(`/Editor/${data}`);
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">OpinionOnline Tutorial: Een Stap-voor-Stap Gids</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Stap 1: Creëer Uw Enquête</h2>
                <p className="text-md text-gray-600 mb-4">
                    Start door de OpinionOnline app te openen en selecteer de plus 'Een nieuwe enquête aanmaken' in het menu. Voer een titel in voor uw enquête en begin met het toevoegen van vragen. U heeft de keuze uit verschillende vraagtypes, zoals meerkeuze en open vragen.
                </p>
                <img src="/Tutorial/STAP1.PNG" alt="Illustratie van stap 1" className="mb-4 rounded shadow-lg"/>
                <img src="/Tutorial/STAP1.2.PNG" alt="Illustratie van stap 1" className="mb-4 rounded shadow-lg"/>
                <img src="/Tutorial/STAP1.3.PNG" alt="Illustratie van stap 1" className="mb-4 rounded shadow-lg"/>

            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Stap 2: Personaliseer het Design</h2>
                <p className="text-md text-gray-600 mb-4">
                    Na het formuleren van de vragen, personaliseert u het design van uw enquête. Kies uit diverse thema's, pas de kleuren aan en voeg uw eigen logo toe om de enquête af te stemmen op uw persoonlijke of bedrijfsstijl.
                </p>
                <img src="/Tutorial/STAP2.PNG" alt="Illustratie van stap 2" className="mb-4 rounded shadow-lg"/>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Stap 3: Distribueer Uw Enquête</h2>
                <p className="text-md text-gray-600 mb-4">
                    Klaar met de opmaak? Deel uw enquête via e-mail of plaats een link op uw website. OpinionOnline biedt gebruiksvriendelijke opties voor het verspreiden van uw enquête naar het gewenste publiek.
                </p>
                <img src="/Tutorial/STAP3.PNG" alt="Illustratie van stap 3" className="mb-4 rounded shadow-lg"/>
                <img src="/Tutorial/STAP3.1.PNG" alt="Illustratie van stap 3" className="mb-4 rounded shadow-lg"/>

            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Stap 4: Analyseer en Interpreteer</h2>
                <p className="text-md text-gray-600 mb-4">
                    Gebruik de geavanceerde analysetools van OpinionOnline om de reacties te evalueren. Bekijk resultaten real-time, genereer gedetailleerde rapporten en verkrijg diepgaande inzichten om geïnformeerde beslissingen te nemen.
                </p>
                <img src="/images/tutorial-step4.png" alt="Illustratie van stap 4" className="mb-4 rounded shadow-lg"/>
            </section>

            
            <div className="text-center">
                <button className="bg-primary mt-6 dark:bg-dark-primary py-2 px-4 rounded" onClick={CreateProject}>
                    Begin vandaag nog met het maken van een enquête met OpinionOnline!
                </button>
            </div>
        </div>
    );
}

export default TutorialPage;





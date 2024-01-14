import { Link } from "react-router-dom";

function AfterRegistrationSuccess() {


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Bijna klaar!</h1>
            <p className="text-gray-600 mb-3">Bedankt voor je registratie. We hebben een bevestigingsmail gestuurd naar het opgegeven adres.</p>
            <p className="text-gray-600 mb-3">Controleer je e-mail en klik op de bevestigingslink om je account te activeren.</p>
            <p className="text-gray-600 mb-3">Als je problemen ondervindt, neem dan contact op met ons supportteam via <a href="mailto:support@opineonline.com" className="text-green-300 hover:text-green-400 transition duration-300">support@opineonline.com</a>.</p>
            <Link to={'/'}>
                <p className="underline text-center text-green-300 hover:text-green-400 transition duration-300">inloggen</p>
            </Link>
        </div>
    );
}

export default AfterRegistrationSuccess;

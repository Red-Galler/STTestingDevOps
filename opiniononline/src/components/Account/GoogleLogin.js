import { FaGoogle } from "react-icons/fa";
import { supabase } from "../../supabaseClient";

function GoogleLogin() {

    async function signInWithGoogle(onError) {
        try {
            const { user, session, error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });

            if (error) throw error;

        } catch (error) {
            console.error('Error during Google sign-in:', error.message);
            onError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center  w-full">
            <button
                className="flex justify-center items-center gap-4  w-full py-3  hover:bg-gray-light transition duration-300 font-medium text-lg border"
                onClick={signInWithGoogle}
            >
                <FaGoogle />
                Sign in with Google
            </button>
        </div>
    )
}


export default GoogleLogin;
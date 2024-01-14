import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa6';
import GoogleLogin from '../components/Account/GoogleLogin';
// Include additional imports if you're handling Google Auth or form submission




function RegisterPage() {

    const navigate = useNavigate();

    const [user, setUser] = useState();



    const [error, setError] = useState(null)


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    async function SignUp(e) {

        e.preventDefault();

        if (!IsStrongPassword(user.password)) {
            setError('Gelieve een sterkere wachtwoord te kiezen')

            return;
        }

        if (!validateEmail(user.email)) {
            setError('Gelieve een geldig emailadres te kiezen')
            return
        }



        try {

            const { data, error } = await supabase.auth.signUp(
                {
                    email: user.email,
                    password: user.password,
                    options: {
                        data: {
                            first_name: user.firstname,
                            last_name: user.lastname,
                        }
                    }
                }
            )

            if (error) throw error


            if (data.user.identities.length > 0) {
                navigate('/Success')
            }

            else {
                setError('Er is al een account gekoppeld aan deze email.')

            }
            console.log(data)
        }

        catch (error) {
            console.log(error)
        }
    }






    function IsStrongPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <FaArrowLeft className='absolute top-0  left-0 text-3xl m-8 text-gray-darker' onClick={() => navigate('/')} />
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">Create Your Account</h2>

                <form onSubmit={SignUp} className="space-y-8">
                    <div>
                        <label htmlFor="firstname" className="block text-lg font-medium text-gray-700 mb-2">Voornaam</label>
                        <input onChange={(e) => setUser(prev => ({ ...prev, firstname: e.target.value }))} type="text" id="firstname" name="firstname" required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200" />
                    </div>

                    <div>
                        <label htmlFor="lastname" className="block text-lg font-medium text-gray-700 mb-2">Familienaam</label>
                        <input onChange={(e) => setUser(prev => ({ ...prev, lastname: e.target.value }))} type="text" id="lastname" name="lastname" required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                        <input onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))} type="text" id="email" name="email" required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Wachtwoord</label>
                        <input onChange={(e) => {
                            setUser(prev => ({ ...prev, password: e.target.value }))
                        }}
                            type="password" id="password" name="password" required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200" />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className="block text-lg font-medium text-gray-700 mb-2">Wachtwoord bevestigen</label>
                        <input onChange={(e) => setUser(prev => ({ ...prev, passwordConfirmation: e.target.value }))} type="password" id="passwordConfirm" name="passwordConfirm" required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200" />
                    </div>

                    <p className="text-red-400">{error}</p>


                    <div>
                        <button type='submit' disabled={user?.password !== user?.passwordConfirmation}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-lg font-medium text-white bg-primary  transition duration-300">
                            Register
                        </button>
                    </div>


                        <GoogleLogin onError={(error) => setError(error)} />


                </form>
            </div>
        </div>
    );
}

export default RegisterPage;

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      if (supabase.auth && typeof supabase.auth.resetPasswordForEmail === 'function') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/resetpassword/:token', // Vervang dit door je eigen omleidings-URL
        });

        if (error) {
          throw error;
        }

        setSuccessMessage('Een e-mail met instructies voor het opnieuw instellen van het wachtwoord is verzonden.');
      } else {
        throw new Error('Supabase auth of resetPasswordForEmail is niet gedefinieerd.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Er is een fout opgetreden bij het aanvragen van wachtwoordherstel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Wachtwoord vergeten</h2>
      <p className="mb-6">Vul hieronder je e-mailadres in om instructies voor wachtwoordherstel te ontvangen.</p>

      <label className="mb-4">
        E-mail:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
      </label>

      <button
        onClick={handleForgotPassword}
        disabled={isSubmitting}
        className="hover:bg-primary text-black px-4 py-2 rounded"
      >
        Wachtwoord herstellen
      </button>

      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ForgotPassword;

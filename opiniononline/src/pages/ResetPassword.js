import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // Haal e-mailadres op met de token
        const { data, error } = await supabase.auth.api.getUserByToken(token);

        if (error) {
          throw error;
        }

        // Je kunt het e-mailadres in de state opslaan als je het nodig hebt
        // setEmail(data.email);
      } catch (error) {
        console.error(error);
        setErrorMessage('Er is een fout opgetreden bij het ophalen van het e-mailadres.');
      }
    };

    fetchEmail();
  }, [token]);

  const handleResetPassword = async () => {
    try {
      setIsSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      

      if (error) {
        throw error;
      }

      setSuccessMessage('Je wachtwoord is succesvol bijgewerkt. Ga naar de loginpagina om in te loggen.');
    } catch (error) {
      console.error(error);
      setErrorMessage('Er is een fout opgetreden bij het bijwerken van het wachtwoord.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Wachtwoord opnieuw instellen</h2>
      <p className="mb-6">Voer hieronder je nieuwe wachtwoord in.</p>

      <label className="mb-4">
        Nieuw wachtwoord:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full"
        />
      </label>

      <button
        onClick={handleResetPassword}
        disabled={isSubmitting}
        className="hover:bg-primary text-black px-4 py-2 rounded"
      >
        Wachtwoord bijwerken
      </button>

      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ResetPassword;

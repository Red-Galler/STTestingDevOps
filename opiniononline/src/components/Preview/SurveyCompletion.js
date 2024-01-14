import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea } from "@material-tailwind/react";
import { supabase } from '../../supabaseClient';
import { FaCircleCheck } from 'react-icons/fa6';

const SurveyCompletionScreen = ({ surveyId, userId, onRetake }) => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ surveyId: surveyId, userId: userId });

    const [isSubmitted, setIsSubmitted] = useState(false);


    async function SubmitAnswers() {
        try {
            const { error } = await supabase.from('Feedback2').insert(feedback)

            if (error) throw error

            setIsSubmitted(true)

        }

        catch (error) {
            console.log(error)
        }


    }



    return (
        <div className="flex flex-col items-center justify-center bg-gray-200 w-full h-full p-6 border border-black dark:bg-dark-third shadow-xl mt-5">
            <h1 className="text-2xl font-bold mb-4">Bedankt voor het invullen van de enquête!</h1>

            {isSubmitted ?


                <div className='w-full flex justify-center items-center flex-col mt-2'>
                    <FaCircleCheck className='text-6xl text-green-normal dark:text-dark-text'/>
                    <p className='mt-2 text-xl'>Feedback is ingediend!</p>
                </div> :
                <div className='w-full flex flex-col justify-center items-center'>
                    <div className="flex items-center justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setFeedback(prev => ({ ...prev, score: star }))} className={`text-3xl ${feedback.score >= star ? 'text-yellow-500' : 'text-gray-400'}`}>
                                ★
                            </button>
                        ))}
                    </div>
                    <div className='w-6/12'>
                        <Textarea onChange={(e) => setFeedback(prev => ({ ...prev, feedback: e.target.value }))} className='bg-white' />
                    </div>

                    <button onClick={SubmitAnswers} className="btn btn-primary mb-4">
                        Beoordeling indienen
                    </button>

                </div>


            }
            {/* Action Buttons */}
            <div className="flex gap-4 mt-5">
                <Button className='flex-1' onClick={onRetake}>enquête opnieuw invullen</Button>
                <Button className='flex-1' color="green" onClick={() => { navigate('/') }}>Naar dashboard</Button>
            </div>
        </div>
    );
};

export default SurveyCompletionScreen;

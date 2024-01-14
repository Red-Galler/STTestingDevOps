import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import Chart from 'react-google-charts';

function Feedback() {
    const { id } = useParams();

    // Voorbeeld feedback data
    const [feedbackData, setFeedbackData] = useState([]);

    // In een echte toepassing zou je hier data ophalen van je backend/server
    useEffect(() => {

        async function GetFeedback() {
            try {
                const { data, error } = await supabase.from('Feedback2').select('*, Users2(*)').eq('surveyId', id)

                if (error) throw error

                if (data) {
                    setFeedbackData(data)
                    console.log(data);
                }
            }

            catch (error) {
                console.log(error)
            }
        }

        GetFeedback()
        // Haal feedback op van de server
        // setFeedbackData(gekregen data van de server);
    }, []);


    // Functie om de score te tellen
    const countScores = () => {
        const scoreCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbackData.forEach(item => {
            if (item.score >= 1 && item.score <= 5) {
                scoreCount[item.score]++;
            }
        });
        return Object.entries(scoreCount).map(([score, count]) => [`Score ${score}`, count, 'color: #4285F4']);
    };

    const chartData = [
        ["Score", "Aantal", { role: "style" }],
        ...countScores()
    ];

    const chartOptions = {
        hAxis: {
            textPosition: 'out',
        },
        vAxis: {
            textPosition: 'none',
            gridlines: { color: 'transparent' }
        },
        legend: { position: 'none' },
        bar: { groupWidth: '95%' },
        chartArea: {
            width: '100%',
            height: '80%'
        },
        // Toevoegen van responsive optie
        responsive: true
    };


    console.log(feedbackData);

    return (
        <div className="w-full p-4 flex justify-center items-center">
            <div className='md:w-10/12'>

                <h1 className="text-2xl font-semibold mb-4">Feedback van Gebruikers</h1>


                <div className='w-full mt-10'>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={chartData} options={chartOptions} />

                </div>

                <div className="overflow-x-auto relative mt-10 w-full">
                    <table className="table-auto overflow-scroll w-full text-xl text-center text-gray-500 dark:text-dark-text">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-secondary dark:text-dark-text">
                            <tr>
                                <th scope="col" className="py-3 px-6 whitespace-normal">
                                    E-mailadres
                                </th>
                                <th scope="col" className="py-3 px-6 whitespace-normal">
                                    Feedback
                                </th>
                                <th scope="col" className="py-3 px-6 whitespace-normal">
                                    Score
                                </th>
                                <th scope="col" className="py-3 px-6 whitespace-normal">
                                    Datum
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackData.map((item) => (
                                <tr key={item.id} className="bg-white border-b dark:bg-dark-third dark:border-dark-border">
                                    <td className="py-4 px-6">{item.Users2?.email}</td>
                                    <td className="py-4 px-6">{item.feedback}</td>
                                    <td className="py-4 px-6">{item.score}</td>
                                    <td className="py-4 px-6">{new Date(item.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>

    );
}

export default Feedback;

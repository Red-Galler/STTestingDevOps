import { useState, useContext, useEffect } from "react";
import TestCard from "../components/Projecten/TestCard";
import RecommendedTemplates from "../components/Projecten/RecommendedTemplates";

import { userContext } from '../App';
import { supabase } from "../supabaseClient";




function Testen() {

    const loggedInUserId = useContext(userContext)

    const [surveys, setSurveys] = useState([]);

    const [activeStatusPicker, setActiveStatusPicker] = useState(null);




    useEffect(() => {
        async function getSurveys() {
            try {

                const { data, error } = await supabase.from('Surveys2').select('*').order('created_at')

                if (error) throw error

                if (data) setSurveys(data)
                

            }
            catch (error) {
                console.log(error)
            }
        }

        getSurveys();
    }, [loggedInUserId])


    return (
        <div className="w-full p-5">

            {/* <RecommendedTemplates /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-5 ">

                {surveys.map((survey) => {
                    return <TestCard key={survey.id} survey={survey} isActive={activeStatusPicker === survey.id} onActivePicker={() => setActiveStatusPicker(prev => prev === survey.id ? null : survey.id)} />
                })}



            </div>
        </div>
    )
}


export default Testen


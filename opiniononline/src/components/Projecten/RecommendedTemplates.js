import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import TemplateCard from "./TemplateCard";
import IconButton from '../IconButton';
import { userContext } from '../../App';


import { FaPlus, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { supabase } from '../../supabaseClient';


function RecommendedTemplates() {
    const [isGridVisible, setIsGridVisible] = useState(true);

    const loggedInUserId = useContext(userContext).id


    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);


    async function FetchTemplates() {

        try {
            const { data, error } = await supabase.from('Surveys2').select('*').eq('isTemplate', true)

            if (error) throw error

            if (data) {

                // Fetch the backgrounds for all surveys
                const templates = await Promise.all(data.map(async (survey) => {
                    const background = await FetchPublicUrl('survey_backgrounds', `survey_background_${survey.id}`);
                    return { ...survey, background: background }; // Combine the survey data with its background URL
                }));

                setTemplates(templates)
            }
        }
        catch (error) {
            console.log(error)
        }


    }



    async function FetchPublicUrl(from, name) {

        try {

            const { data, error } = supabase
                .storage
                .from(from)
                .getPublicUrl(name);

            if (error) throw error

            const response = await fetch(data.publicUrl);
            if (response.ok) {
                return data.publicUrl;
            } else {
                return null;
            }
        }
        catch (error) {
            console.log(error)
        }

    }





    async function CreateProject() {
        try {
            const { data, error } = await supabase.rpc('create_survey', { owner_id: loggedInUserId });

            if (error) throw error;

            navigate(`/Editor/${data}`)


        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        FetchTemplates();
    }, [])

    return (
        <div className="bg-white dark:bg-dark-secondary  m-5 p-5 border dark:border-dark-border">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text">Aanbevolen sjablonen</h2>
                {isGridVisible ?
                    <IconButton className={'dark:text-dark-text'} icon={FaChevronUp} message={'Invouwen'} onClick={() => setIsGridVisible(!isGridVisible)} />
                    :
                    <IconButton className={'dark:text-dark-text'} icon={FaChevronDown} message={'Uitvouwen'} onClick={() => setIsGridVisible(!isGridVisible)} />
                }
            </div>

            <div className={`flex flex-wrap gap-5 overflow-hidden transition-max-height duration-500 ease-in-out ${isGridVisible ? 'max-h-[200px] mt-6' : 'max-h-0'}`}>
                <div className="flex justify-center items-center w-7/12 sm:w-4/12 lg:w-3/12 2xl:w-2/12 h-[200px] border bg-gray-200 dark:bg-dark-third border-gray-400 dark:border-dark-border  rounded-xl">
                    <IconButton onClick={() => CreateProject()} icon={FaPlus} message={"Een nieuwe enquête aanmaken"} className='text-5xl rounded-2xl p-4 dark:text-dark-text' />
                </div>

                {templates.map((template) => {
                    return <TemplateCard key={template.id} template={template} loggedInUser={loggedInUserId}/>
                })}
            </div>
        </div>
    )
}

export default RecommendedTemplates;
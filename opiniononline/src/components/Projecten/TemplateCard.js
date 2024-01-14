import { FaWpforms } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { template } from "lodash";


function TemplateCard({ template, loggedInUser }) {
    


    const navigate = useNavigate();


    async function CopyFileSupabase(from, fileNameToCopy, fileNameDestination) {
        try {
            const { data, error } = await supabase
                .storage
                .from(from)
                .copy(fileNameToCopy, fileNameDestination);
        }
        catch (error) {
            console.log(error)
        }
    }

    async function CreateProject() {
        let templateToCopy = {...template};

        
        try {

            const { data, error } = await supabase.rpc('use_template', {
                template_id: templateToCopy.id,
                owner_id: loggedInUser
            })


            if (error) throw error

            if (data[0]) {

                CopyFileSupabase('survey_logos', `survey_${templateToCopy.id}`, `survey_${data[0].id}`)
                CopyFileSupabase('survey_backgrounds', `survey_background_${templateToCopy.id}`, `survey_background_${data[0].id}`)
            }


            let surveyId = data[0].id

            navigate(`/Editor/${surveyId}`)

        }

        catch (error) {
            console.log(error)
        }
    }


    return (
        <div onClick={CreateProject} className="flex flex-col w-7/12 sm:w-4/12 lg:w-3/12 2xl:w-2/12 h-[200px] border border-gray-400 dark:border-dark-border bg-gray-200 dark:bg-dark-secondary rounded-xl cursor-pointer group">
            <div style={{
                backgroundImage: `url(${template?.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }} className="flex-1 bg-white dark:bg-gray-700 rounded-t-xl"></div>

            <div className="flex items-center gap-2 py-1 px-3 border-t bg-white dark:bg-dark-secondary border-gray-400 dark:border-dark-border rounded-b-xl group-hover:bg-primary group-hover:text-white">
                <FaWpforms className="text-primary-normal text-4xl dark:text-dark-text" />
                <div className="text-start">
                    <p className="text-gray-700 dark:text-dark-text">{template.title}</p>
                    <p className="text-gray-500 dark:text-dark-text">Sjabloon</p>
                </div>
            </div>
        </div>
    )
}


export default TemplateCard;
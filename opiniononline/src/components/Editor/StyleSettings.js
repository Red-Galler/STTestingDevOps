import { useEffect, useRef, useState } from "react";
import ProjectStyleBox from "./ProjectStyleBox";
import EditLogo from "./EditLogo";
import EditFont from "./EditFont";
import { useDispatch, useSelector } from "react-redux";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { updateBackground, updateSurveyStyles } from "../../slices/surveySlice";

function StyleSettings({onFooterClick}) {

    const [selectedBox, setSelectedBox] = useState(null);
    const survey = useSelector(state => state.surveys.survey);

    const dispatch = useDispatch();


    const inputButton = useRef();


    function RenderComponent() {
        switch (selectedBox) {
            case "Logo":
                return <EditLogo onBack={onBack} />
            case "Font":
                return <EditFont onBack={onBack} />
            default:
                break;
        }
    }


    
    function onBack() {
        setSelectedBox(null)
    }


    async function HandleImageUpdate(e) {
        let file = e.target.files[0];
        let filename = `survey_background_${survey.id}`




        console.log(filename);

        if (!file) return

        UploadImage(filename, file)

    }



    async function UploadImage(filename, file) {

        try {
            const { data, error } = await supabase
                .storage
                .from('survey_backgrounds')
                .upload(filename, file, {
                    cacheControl: '0',
                    upsert: true
                })


            if (error) throw error




            let publicUrl = await FetchBackground(filename)

            // Dispatch the public URL with a cache-busting query string
            dispatch(updateBackground(`${publicUrl}?cb=${new Date().getTime()}`));

            UpdateTheme()

        }

        catch (error) {
            console.log(error)
        }



    }


    async function FetchBackground(filename) {
        try {
            const { data, error } = supabase
                .storage
                .from('survey_backgrounds')
                .getPublicUrl(filename);

            if (error) throw error

            return data.publicUrl

        }
        catch (error) {
            console.log(error)
        }


    }



    async function DeleteBackground(e) {
        e.stopPropagation();


        try {

            const { error } = await supabase
                .storage
                .from('survey_backgrounds')
                .remove([`survey_background_${survey.id}`])

                if(error) throw error;

                dispatch(updateBackground(null))

                UpdateTheme()
        }

        catch (error) {
            console.log(error)
        }




    }

    async function UpdateTheme(){
        try {
            const {data, error} = await supabase.from('SurveyStyles2').update({themeName: null, isEditedTheme: false}).eq('surveyId', survey.id).select()

            if(data){
                dispatch(updateSurveyStyles(data[0]))
            }
        }
        catch(error){
            console.log(error)
        }


    }
    

    function StyleElement(element) {
        console.log(element)
        setSelectedBox(element)
    }


    return (

        <div className="dark:bg-dark-default">
            {
                selectedBox ? <div className="">{RenderComponent()}</div> :
                    <div className="grid grid-cols-2">
                        <ProjectStyleBox
                            className={'border border-t-0 dark:bg-dark-secondary dark:border-dark-border'}
                            title={"Uw logo"}
                            content={survey?.logo ? <img className="w-4/12" src={survey?.logo} alt='logo'></img> : <FaPlusCircle className="text-3xl text-gray-400" />}
                            onClick={() => StyleElement("Logo")} />
                      
                        <ProjectStyleBox
                            className={'border border-t-0 dark:bg-dark-secondary dark:border-dark-border'}
                            title={"Teksstijl"}
                            content={<p className="text-5xl text-gray-400">Aa</p>}
                            onClick={() => StyleElement("Font")} />


                        <ProjectStyleBox
                            className={'border border-t-0 border-s-0 dark:bg-dark-secondary dark:border-dark-border'}
                            title={"Achtergrond"}
                            content={survey?.background ? <div className="flex items-center">
                                <img className="h-28 w-10/12" src={survey.background} alt="achtergrond" />
                                <button onClick={(e) => { DeleteBackground(e) }} className="ml-2">
                                    <FaTrashAlt className="text-2xl text-red-500" />
                                </button>
                            </div> : <FaPlusCircle
                                className="text-3xl text-gray-400" />}
                            onClick={() => inputButton.current.click()} />

                        <input ref={inputButton} type="file" onChange={HandleImageUpdate} className="hidden"></input>

                    </div>
            }
        </div>
    )
}


export default StyleSettings;
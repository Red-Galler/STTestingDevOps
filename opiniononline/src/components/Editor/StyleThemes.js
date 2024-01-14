import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { setThemes, updateBackground, updateSurveyStyles } from "../../slices/surveySlice";

function StyleThemes({ surveyId, surveyStyle, onChange }) {

    //const [themes, setThemes] = useState([]);

    const dispatch = useDispatch();

    const themes = useSelector(state => state.surveys.themes);


    useEffect(() => {
        if (themes.length === 0) {
            GetThemes();
        }

    }, [])

    async function GetThemes() {
        try {

            const { data, error } = await supabase.from('SurveyStyles2').select('*').eq('isTheme', true)

            if (error) throw error


            if (data) {
                let themes = data;



                themes = await Promise.all(themes.map(async (theme) => {
                    const background = await FetchUrl('theme_backgrounds', `theme_${theme.id}`)

                    return { ...theme, background: background }
                }))


                console.log('PPPP')
                dispatch(setThemes(themes))

            }
        }

        catch (error) {
            console.log(error)
        }
    }



    async function FetchUrl(from, filename) {
        try {
            const { data, error } = supabase
                .storage
                .from(from)
                .getPublicUrl(filename)

            if (error) throw error

            return data.publicUrl

        }
        catch (error) {
            console.log(error)
        }


    }


    async function UseTheme(theme) {

        let copyOfTheme = { ...theme };

        delete copyOfTheme.background
        delete copyOfTheme.id
        delete copyOfTheme.isTheme
        delete copyOfTheme.surveyId


        const response = await fetch(theme.background);
        const blob = await response.blob();

        console.log(surveyId)

        UploadImage(`survey_background_${surveyId}`, blob)
        let updatedSurveyStyle = await UpdateSurveyStyle(copyOfTheme, surveyId)

        dispatch(updateSurveyStyles(updatedSurveyStyle))

        onChange()

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





            let publicUrl = await FetchUrl('survey_backgrounds', filename)

            // Dispatch the public URL with a cache-busting query string
            dispatch(updateBackground(`${publicUrl}?cb=${new Date().getTime()}`));

        }

        catch (error) {
            console.log(error)
        }



    }


    async function UpdateSurveyStyle(theme, surveyId) {

        try {
            let updatedSurveyStyle = {...theme, isEditedTheme: false}
            const { data, error } = await supabase.from('SurveyStyles2').update(updatedSurveyStyle).eq('surveyId', surveyId).select();


            if (error) throw error

            if (data) {

                let updatedSurveyStyle = data[0];

                console.log(updatedSurveyStyle)
                return updatedSurveyStyle;
            }

        }
        catch (error) {
            console.log(error)
        }


    }






    return (
        <div className=" dark:bg-dark-secondary">

            {
                themes.map((theme) => {

                    return (
                        <div onClick={() => UseTheme(theme)} className={` border-gray-normal dark:border-dark-border  border-2 border-t-0  h-48 p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-dark-third  ${surveyStyle.themeName === theme.themeName && 'bg-gray-200 dark:bg-dark-third'}`}>
                            <p className=" font-semibold">{theme.themeName} {(surveyStyle.themeName === theme.themeName && surveyStyle.isEditedTheme) && "(aangepast)"}</p>

                            <div style={{
                                backgroundImage: `url('${theme.background}')`, // Corrected path
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                                className="h-32 mt-2"
                            >

                            </div>


                        </div>
                    )
                })
            }

        </div>
    )
}



export default StyleThemes;
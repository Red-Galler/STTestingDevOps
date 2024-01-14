import { FaChevronLeft, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import IconButton from "../IconButton";
import { Button, Option, Radio, Select } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import { useEffect, useRef, useState } from "react";
import { fetchSurveyLogo, updateLogo, updateSurveyLogo, updateSurveyStyles } from "../../slices/surveySlice";
import { useParams } from "react-router-dom";
import HeaderStyles from "./HeaderStyles";
import { debounce } from "lodash";


function EditLogo({ onBack }) {
    const { id } = useParams();
    const inputButton = useRef();
    const [loading, setLoading] = useState(false);

    const sizes = [
        {
            logoSize: '12',
            label: 'Klein'
        },
        {
            logoSize: '16',
            label: 'Middelgroot'
        },
        {
            logoSize: '20',
            label: 'Groot'
        }
    ]

    const survey = useSelector(state => state.surveys.survey)

    const surveyStyles = useSelector(state => state.surveys.surveyStyles);

    const dispatch = useDispatch();



    const [updatedSurveyStyles, setUpdatedSurveyStyles] = useState(surveyStyles);
    const debouncedSetUpdatedSurveyStyle = debounce(setUpdatedSurveyStyles, 300);



    useEffect(() => {

        async function updateSurveyStylesInDb() {

            try {
                const { error } = await supabase.from('SurveyStyles2').update({ logoSize: updatedSurveyStyles.logoSize, logoPosition: updatedSurveyStyles.logoPosition }).eq("surveyId", updatedSurveyStyles.surveyId);

                if (error) throw error;

                dispatch(updateSurveyStyles(updatedSurveyStyles));

            }
            catch (error) {
                console.log(error)
            }

        }

        updateSurveyStylesInDb();

    }, [updatedSurveyStyles])


    async function handleImageUpdate(e) {
        try {

            let file = e.target.files[0];
            let filename = `survey_${updatedSurveyStyles.surveyId}`

            if (!file) return

            setLoading(true);


            const { error } = await supabase
                .storage
                .from('survey_logos')
                .upload(filename, file, {
                    cacheControl: '0',
                    upsert: true
                })


            console.log(error)
            let publicUrl = await FetchLogo(filename)

            // Dispatch the public URL with a cache-busting query string
            dispatch(updateLogo(`${publicUrl}?cb=${new Date().getTime()}`));



            setLoading(false);
        }

        catch (error) {
            setLoading(false)
            console.log(error)
        }


    }



    async function FetchLogo(filename) {
        try {
            const { data, error } = supabase
                .storage
                .from('survey_logos')
                .getPublicUrl(filename);

            if (error) throw error

            return data.publicUrl

        }
        catch (error) {
            console.log(error)
        }


    }



    async function DeleteLogo(e) {
        e.stopPropagation();


        try {

            const { error } = await supabase
                .storage
                .from('survey_backgrounds')
                .remove([`survey_background_${survey.id}`])

            if (error) throw error;

            dispatch(updateLogo(null))
        }

        catch (error) {
            console.log(error)
        }




        console.log('YESSS')
    }


    return (
        <div>
            <HeaderStyles title={'Logo wijzigen'} onBack={onBack} />

            <div className="dark:bg-dark-secondary">

                <div className="flex border-x border-b border-gray-dark dark:border-dark-border p-6">
                    <Button type="file" onClick={() => inputButton.current.click()} size="md" className="bg-primary p-0">
                        {
                            survey?.logo ?

                                <div className="flex items-center gap-3">
                                    <img src={survey?.logo} alt="logo" className="w-20 h-20 flex-1"></img>
                                </div>


                                :
                                <div className="flex items-center gap-3  text-lg p-2">
                                    <FaPlusCircle />
                                    <span>Logo</span>
                                </div>
                        }
                        <input ref={inputButton} type="file" onChange={(e) => handleImageUpdate(e)} className="hidden"></input>
                    </Button>

                    {
                        survey?.logo &&
                        <button onClick={(e) => { DeleteLogo(e) }} className="ml-2">
                            <FaTrashAlt className="text-2xl text-red-500" />
                        </button>
                    }

                </div>

                <div className="flex flex-col  border-x border-b border-gray-dark dark:border-dark-border p-6">
                    <p className="ms-3 font-semibold">Grootte</p>

                    {
                        sizes.map((size) => {
                            return <Radio checked={updatedSurveyStyles.logoSize === size.logoSize} value={size.logoSize} name="size" label={size.label} color="green" onChange={() => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, logoSize: size.logoSize }))} />
                        })
                    }

                </div>


                <div className="flex flex-col  border-x border-b border-gray-dark dark:border-dark-border p-6">
                    <p className="ms-3 font-semibold">Positie</p>
                    <div className="ms-3 mt-3">
                        <Select labelProps={{
                            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0'
                        }}
                            onChange={(value) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, logoPosition: value }))}
                            value={updatedSurveyStyles.logoPosition}

                        >
                            <Option value="start">Links</Option>
                            <Option value="end">Rechts</Option>
                        </Select>

                    </div>

                </div>
            </div>

        </div>
    )
}




export default EditLogo;
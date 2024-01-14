import { Option, Select, Spinner } from "@material-tailwind/react";
import HeaderStyles from "./HeaderStyles";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import surveySlice, { setIsLoadingFalse, setIsLoadingTrue, updateSurveyStyles } from "../../slices/surveySlice";
import IconButton from "../IconButton";
import { FaBold, FaItalic, FaRemoveFormat, FaUnderline } from "react-icons/fa";
import FontStylingOptions from "./FontStylingOptions";
import { debounce } from "lodash";

function EditFont({ onBack }) {
    const dispatch = useDispatch();



    const surveyStyle = useSelector(state => state.surveys.surveyStyles)

    const [updatedSurveyStyle, setUpdatedSurveyStyle] = useState(surveyStyle);

    const isInitialRender = useRef([true]);


    const debouncedSetUpdatedSurveyStyle = debounce(setUpdatedSurveyStyle, 300); // 300 ms

    useEffect(() => {
        setUpdatedSurveyStyle(surveyStyle)
    }, [surveyStyle])


    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        async function UpdateStyle() {
            let copyOfUpdatedStyle = ({ ...updatedSurveyStyle, isEditedTheme: true })
            const { data, error } = await supabase
                .from('SurveyStyles2')
                .update(copyOfUpdatedStyle)
                .eq('id', surveyStyle.id)

            if (error) throw error;


            dispatch(updateSurveyStyles(updatedSurveyStyle));

        }

        UpdateStyle()

    }, [updatedSurveyStyle]);

    return (
        <div>
            <HeaderStyles title={'Lettertypen'} onBack={onBack} />

            <div className="dark:bg-dark-secondary border dark:border-dark-border dark:text-dark-text">

                <FontStylingOptions
                    label="Titel"
                    values={{
                        fontFamily: updatedSurveyStyle.titleFontFamily,
                        fontSize: updatedSurveyStyle.titleFontSize,
                        isBold: updatedSurveyStyle.titleIsBold,
                        isCursive: updatedSurveyStyle.titleIsCursive,
                        isUnderlined: updatedSurveyStyle.titleIsUnderlined,
                        fontColor: updatedSurveyStyle.titleColor
                    }}
                    onSelectChanges={{
                        onFontFamilyChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleFontFamily: newValue })),
                        onFontSizeChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleFontSize: newValue }))
                    }}
                    onButtonClicks={{
                        Bold: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsBold: !updatedSurveyStyle.titleIsBold })),
                        Cursive: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsCursive: !updatedSurveyStyle.titleIsCursive })),
                        Underlined: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsUnderlined: !updatedSurveyStyle.titleIsUnderlined }))
                    }}
                    onChangeColor={(newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleColor: newValue }))}
                />



                <FontStylingOptions
                    label="Vraag"
                    values={{
                        fontFamily: updatedSurveyStyle.questionFontFamily,
                        fontSize: updatedSurveyStyle.questionFontSize,
                        fontColor: updatedSurveyStyle.questionColor
                    }}
                    onSelectChanges={{
                        onFontFamilyChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, questionFontFamily: newValue })),
                        onFontSizeChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, questionFontSize: newValue }))
                    }}
                    onButtonClicks={{
                    }}
                    onChangeColor={(newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, questionColor: newValue }))}

                    showButtons={false}
                />


                <FontStylingOptions
                    label="Voettekst"
                    values={{
                        fontFamily: updatedSurveyStyle.footerFontFamily,
                        fontSize: updatedSurveyStyle.footerFontSize,
                        isBold: updatedSurveyStyle.footerIsBold,
                        isCursive: updatedSurveyStyle.footerIsCursive,
                        isUnderlined: updatedSurveyStyle.footerIsUnderlined,
                        fontColor: updatedSurveyStyle.footerColor
                    }}
                    onSelectChanges={{
                        onFontFamilyChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerFontFamily: newValue })),
                        onFontSizeChange: (newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerFontSize: newValue }))
                    }}
                    onButtonClicks={{
                        Bold: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsBold: !updatedSurveyStyle.footerIsBold })),
                        Cursive: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsCursive: !updatedSurveyStyle.footerIsCursive })),
                        Underlined: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsUnderlined: !updatedSurveyStyle.footerIsUnderlined }))
                    }}
                    onChangeColor={(newValue) => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerColor: newValue }))}
                />

            </div>


        </div>
    );
}


export default EditFont;
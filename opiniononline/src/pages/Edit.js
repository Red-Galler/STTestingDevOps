import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from "../supabaseClient";
import { clearSurvey, fetchSurveyData, fetchSurveyStyle, updateSurveyStyles } from '../slices/surveySlice';


import ProjectStyles from "../components/Editor/ProjectStyles";
import Section from "../components/Editor/Section";
import IconButton from "../components/IconButton";
import ToolBarSide from "../components/Editor/ToolBarSide";

import { FaArrowLeft, FaArrowRight, FaRegEye } from "react-icons/fa";
import ToolBarBottom from "../components/Editor/ToolBarBottom";
import Input from "../components/Editor/Input.js";
import SurveyLogo from "../components/Editor/SurveyLogo.js";
import ProjectStylesDialog from "../components/Editor/ProjectStylesDialog.js";
import ProjectStylesDrawer from "../components/Editor/ProjectStylesDrawer.js";
import { debounce } from "lodash";
import { userContext } from "../App.js";


function Edit() {
    const dispatch = useDispatch();

    const navigate = useNavigate();


    const { id } = useParams();

    const survey = useSelector(state => state.surveys.survey)


    const isInitialRender = useRef([true, true]);

    const surveyStyle = useSelector(state => state.surveys.surveyStyles)

    const [updatedSurvey, setUpdatedSurvey] = useState(surveyStyle);


    const [updatedSurveyStyle, setUpdatedSurveyStyle] = useState();

    const debouncedSetUpdatedSurveyStyle = debounce(setUpdatedSurveyStyle, 300); // 300 ms


    const activeBlock = useSelector(state => state.surveys.active);

    // Stores the active section or question. So if activeBlock changes it stores the div in this ref
    const activeBlockRef = useRef(null);

    const footerRef = useRef(null)



    useEffect(() => {
        setUpdatedSurveyStyle(surveyStyle)
    }, [surveyStyle])


    useEffect(() => {
        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        async function UpdateStyle() {
            const { error } = await supabase
                .from('SurveyStyles2')
                .update(updatedSurveyStyle)
                .eq('id', updatedSurveyStyle.id)

            if (error) throw error;


            dispatch(updateSurveyStyles(updatedSurveyStyle));

        }

        UpdateStyle()

    }, [updatedSurveyStyle?.titleFontFamily, updatedSurveyStyle?.titleFontSize, updatedSurveyStyle?.titleIsBold, updatedSurveyStyle?.titleIsCursive, updatedSurveyStyle?.titleIsUnderlined,
    updatedSurveyStyle?.footerFontFamily, updatedSurveyStyle?.footerFontSize, updatedSurveyStyle?.footerIsBold, updatedSurveyStyle?.footerIsCursive, updatedSurveyStyle?.footerIsUnderlined])




    useEffect(() => {
        setUpdatedSurvey(survey)
    }, [survey])


    useEffect(() => {
        if (isInitialRender.current[1]) {
            isInitialRender.current[1] = false;
            return;
        }
        async function UpdateSurvey(survey) {

            try {

                const copyOfSurvey = { ...survey };
                delete copyOfSurvey.Sections2;
                delete copyOfSurvey.background;
                delete copyOfSurvey.logo;

                const { error } = await supabase.from('Surveys2').update(copyOfSurvey).eq('id', survey.id)


                if (error) throw error;

            }
            catch (error) {
                console.log(error);
            }

        }

        if (survey != null) {
            UpdateSurvey(updatedSurvey)
        }

    }, [updatedSurvey])


    useEffect(() => {
        setTimeout(() => {
            if (activeBlockRef.current) {
                activeBlockRef.current.scrollIntoView({ block: "center", behavior: 'smooth' });
            }
        }, 150);

        console.log(activeBlock)

    }, [activeBlock])


   
    return (
        <div className="flex w-full z-10 dark:bg-dark-default">



            <ProjectStyles id="titleElement" className={'hidden h-[calc(100vh-5rem)] overflow-y-auto sticky top-20 2xl:block w-4/12 p-4 bg-white dark:bg-dark-default dark:text-dark-text dark:border-dark-border text-lg z-19'} />


            <div
                style={{
                    backgroundImage: `url(${survey?.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh', // Ensures it covers at least the full height of the viewport
                }}

                className="w-full min-h-screen border border-t-0 dark:border-dark-border relative"
            >



                {/* Overlay with Opacity */}
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the color and opacity as needed
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1, // Ensure it's behind the content
                    }}
                ></div>

                <div style={{ zIndex: 2 }} className="relative">


                    <div
                        className="flex justify-end gap-6 p-6 text-3xl">



                        <ProjectStylesDialog  className={'md:hidden'} />
                        <ProjectStylesDrawer  className={'hidden md:block 2xl:hidden'} />

                        <div className="flex gap-2 text-primary-normal">
                            {
                            //<IconButton icon={FaArrowLeft} message={"Ongedaan maken"} placement="bottom"></IconButton>
                            //<IconButton icon={FaArrowRight} message={"Opnieuw"} placement="bottom"></IconButton>
                            }
                        </div>

                        <Link to={`/Preview/${id}`} className="flex items-center">
                            <FaRegEye className="text-gray-darker" />
                        </Link>

                    </div>

                    <div className="flex w-full p-2 mt-5">
                        <div className="flex gap-4 flex-1 justify-center">
                            <div className="text-start w-full md:w-10/12">


                                {
                                    updatedSurvey?.logo ? <SurveyLogo logo={updatedSurvey.logo} surveyStyle={surveyStyle} /> : <div className="w-6/12 md:w-4/12 lg:w-2/12 p-3 bg-white dark:bg-primary border border-primary-normal text-center rounded-lg">
                                        <p>Uw logo</p>

                                    </div>

                                }

                                <div style={{ color: surveyStyle?.titleColor }} className="mt-10">
                                    < Input id="titleElement"
                                        value={updatedSurvey?.title}
                                        onChange={(newValue) => setUpdatedSurvey(prev => ({ ...prev, title: newValue }))}
                                        setStyling={true}
                                        className={`
                                        text-${updatedSurveyStyle?.titleFontSize} 
                                        ${updatedSurveyStyle?.titleFontFamily} 
                                        ${updatedSurveyStyle?.titleIsBold ? "font-bold" : "font-normal"}
                                        ${updatedSurveyStyle?.titleIsCursive ? "italic" : "not-italic"}
                                        ${updatedSurveyStyle?.titleIsUnderlined ? "underline" : ""}
                                        `}
                                        onButtonClicks={{
                                            Bold: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsBold: !prev?.titleIsBold })),
                                            Cursive: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsCursive: !prev.titleIsCursive })),
                                            Underlined: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, titleIsUnderlined: !prev.titleIsUnderlined }))

                                        }}
                                        buttonStates={{
                                            isBold: surveyStyle?.titleIsBold,
                                            isCursive: surveyStyle?.titleIsCursive,
                                            isUnderlined: surveyStyle?.titleIsUnderlined,
                                        }}
                                    />
                                </div>



                                <div className="w-full mb-16">

                                    {
                                        survey &&
                                        survey.Sections2.map((section) => {

                                            return <Section key={section.id} section={section} ref={activeBlockRef} />
                                        })
                                    }




                                    <div style={{ color: surveyStyle?.footerColor }} className="mt-10">
                                        < Input 
                                            value={updatedSurvey?.footer}
                                            onChange={(newValue) => setUpdatedSurvey(prev => ({ ...prev, footer: newValue }))}
                                            setStyling={true}
                                            className={`
                                            text-end
                                        text-${updatedSurveyStyle?.footerFontSize} 
                                        ${updatedSurveyStyle?.footerFontFamily} 
                                        ${updatedSurveyStyle?.footerIsBold ? "font-bold" : "font-normal"}
                                        ${updatedSurveyStyle?.footerIsCursive ? "italic" : "not-italic"}
                                        ${updatedSurveyStyle?.footerIsUnderlined ? "underline" : ""}
                                        `}
                                            onButtonClicks={{
                                                Bold: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsBold: !prev?.footerIsBold })),
                                                Cursive: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsCursive: !prev.footerIsCursive })),
                                                Underlined: () => debouncedSetUpdatedSurveyStyle(prev => ({ ...prev, footerIsUnderlined: !prev.footerIsUnderlined }))

                                            }}
                                            buttonStates={{
                                                isBold: surveyStyle?.footerIsBold,
                                                isCursive: surveyStyle?.footerIsCursive,
                                                isUnderlined: surveyStyle?.footerIsUnderlined,
                                            }}
                                        />
                                    </div>
                                </div>



                            </div>
                            <ToolBarSide className={'hidden lg:block'} />

                        </div>

                    </div>
                </div>

                <ToolBarBottom className={'lg:hidden'} />

            </div>
        </div>
    );
}

export default Edit;
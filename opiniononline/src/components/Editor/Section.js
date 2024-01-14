import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { changeActive, setIsLoadingFalse, setIsLoadingTrue, updateSection } from "../../slices/surveySlice";
import { Reorder } from "framer-motion";


import IconButton from "../IconButton";
import Input from "./Input";
import Question from "./Question";

import { FaArrowsAltV, FaEllipsisH, FaTrashAlt } from "react-icons/fa";
import { Option, Select } from "@material-tailwind/react";
import DeleteSectionModal from "./DeleteSectionModal";
import { debounce } from "lodash";


// forwardref allows a component to expose its child element's references to a parent component 'the edit page'
const Section = React.forwardRef(({ section }, ref) => {


    const dispatch = useDispatch();

    const isInitialRender = useRef([true]);

    // Makes an observable, so everytime the name, description or orderNr changes we gonna update the database
    const [updatedSection, setUpdatedSection] = useState(section);



    const [questions, setQuestions] = useState(section.Questions2);

    const sections = [...useSelector(state => state.surveys.survey.Sections2), { sectionOrder: 0, title: "Naar de volgende sectie" }, { sectionOrder: -1, title: "Verzenden" }];


    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);
    const isActive = activeBlock?.id === section.id && activeBlock?.type === section.type;


    const [questionsExpand, setQuestionsExpand] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    // Debounced function for database updates
    const debouncedUpdateSection = useRef(debounce(async (updatedSection) => {
        try {
            const copyOfSection = { ...updatedSection };
            delete copyOfSection.type;
            delete copyOfSection.Questions2;
            delete copyOfSection.canUpdate;

            const { error } = await supabase.from('Sections2').update(copyOfSection).eq('id', copyOfSection.id);

            if (error) throw error;

            dispatch(updateSection(updatedSection));

        }

        catch (error) {
            console.error('Error updating section:', error);
        }
    }, 300)).current;




    const handleSectionChange = (field, value) => {

        const sectionToUpdate = { ...updatedSection, [field]: value, canUpdate: true }

        setUpdatedSection(sectionToUpdate);

        debouncedUpdateSection(sectionToUpdate); // Call debounced function for database update
    };



    useEffect(() => {

        setQuestions(section.Questions2)

    }, [section.Questions2]);



    function OnClickSection() {
        dispatch(changeActive(section))

        // The questions must be opened every time the section is active
        setQuestionsExpand(true)
    }






    // This function changes the questionOrder prop of the question when a reorder happened
    async function ReorderQuestions(newOrder) {
        let instance = new Worker('/workers/FetchSurvey.js');

        const workerPromise = new Promise((resolve, reject) => {
            instance.onmessage = ({ data }) => {
                resolve(data.data); // Resolve the promise with the data received from the worker
            };
            instance.onerror = (error) => {
                console.error('Worker error:', error);
                reject(error); // Reject the promise in case of an error
            };
        });

        // Post message to worker
        instance.postMessage({ questions: newOrder, action: 'SORTQUESTIONS' });

        // Await the worker's response
        const workerResponse = await workerPromise;

        setQuestions(workerResponse);
    }



    useEffect(() => {


        const userListener = supabase
            .channel(`section_${section.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Sections2' }, (payload) => {
                if (payload.new.id === section.id && payload.new.sectionOrder !== payload.old.sectionOrder)
                    setUpdatedSection(prev => ({ ...prev, sectionOrder: payload.new.sectionOrder, canUpdate: false }))
            }

            )
            .subscribe()
        return () => {
            userListener.unsubscribe();
        }
    }, [])


    return (
        <div ref={isActive ? ref : null} className="w-full mt-16" onClick={OnClickSection}>

            <div className="w-4/12 lg:w-3/12 p-2 bg-primary text-white text-center rounded-t-lg">
                <p>{`Sectie ${updatedSection.sectionOrder} van ${sections.length - 2}`}</p>
            </div>


            <div className="w-full flex bg-white dark:bg-dark-secondary dark:text-dark-text dark:border-dark-border border rounded-lg shadow-lg">
                <div className={`w-2 rounded-s-lg ${isActive ? 'bg-primary' : 'bg-white dark:bg-dark-secondary'} transition-all duration-300 ease-in-out`}></div>

                <div className="p-4 w-full">
                    <div className="relative flex items-start justify-between mb-4">
                        <Input placeholder={"Naam"} value={updatedSection.title} onChange={(newValue) => handleSectionChange('title', newValue)} />

                        <div className="flex items-center gap-5 text-2xl text-gray-darker">
                            <IconButton className={"dark:text-dark-text"} icon={FaArrowsAltV} message={"Samenvouwen"} onClick={() => setQuestionsExpand(!questionsExpand)}></IconButton>
                            <IconButton className={"dark:text-dark-text"} icon={FaTrashAlt} onClick={() => sections.length > 3 && setIsDeleteModalOpen(true)}></IconButton>
                        </div>
                    </div>

                    <Input placeholder={"Beschrijving"} value={updatedSection.description} onChange={(newValue) => handleSectionChange('description', newValue)} />
                </div>
            </div>

            <div className={`${!questionsExpand ? 'max-h-0 opacity-0 overflow-hidden' : 'opacity-100'} transition-all ease-in-out delay-75`}>
                {
                    questions &&
                    <Reorder.Group onReorder={ReorderQuestions} axis="y" values={questions}>
                        {
                            questions.map((question) => {

                                return (<Question key={question.id} ref={activeBlock?.id === question.id && activeBlock?.type === question.type ? ref : null} question={question} />)

                            })
                        }
                    </Reorder.Group>
                }
            </div>


            {
                updatedSection.sectionOrder + 2 !== sections.length &&

                <div class="flex items-center gap-3 mt-5 text-gray-800">
                    <span class="flex font-bold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }} >{`Na Sectie ${updatedSection.title}`}</span>
                    <div class="">




                        <select onChange={(e) => { handleSectionChange('nextSectionOrder', e.target.value) }} className="text-lg bg-gray-50 border border-gray-300 text-gray-900 dark:bg-dark-secondary dark:text-dark-text dark:border-dark-border  rounded-md focus:ring-green-normal focus:border-green-normal block w-full p-2"
                            value={updatedSection?.nextSectionOrder}>
                            {
                                sections.map((section) => {
                                    return (<option className='mt-1' key={section.sectionOrder} value={section.sectionOrder}>{section.title}</option>)
                                })
                            }
                        </select>
                    </div>
                </div>


            }


            <DeleteSectionModal sectionToDelete={section} open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />


        </div>
    )

})



export default Section;
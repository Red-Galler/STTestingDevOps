import { FaFileImport, FaPause, FaPlus } from "react-icons/fa";
import IconButton from "../IconButton";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import { addQuestion, addSection } from "../../slices/surveySlice";

function ToolBarCommon({ className }) {
    const [isSaving, setIsSaving] = useState(false); // Add state to track saving status

    const dispatch = useDispatch();

    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);

    const sections = useSelector(state => state.surveys.survey?.Sections2);
    const survey = useSelector(state => state.surveys.survey);



    async function AddQuestion() {

        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {

            let question = {
                questionKindId: 1, // Default multiplechoice question
                questionContent: ``,
                sectionId: 0,
                questionOrder: 0
            }

            if (activeBlock?.type === 'question') {
                question.questionContent = `Vraag`;
                question.sectionId = activeBlock.sectionId;
                question.questionOrder = activeBlock.questionOrder + 1;
            }
            else if (activeBlock?.type === 'section') {
                question.questionContent = `Vraag`;
                question.sectionId = activeBlock.id;
                question.questionOrder = 1;
            }
            else {
                question.questionContent = `Vraag`;
                question.sectionId = sections[0].id;
                question.questionOrder = 1;

            }


            let { data, errorUpdate } = await supabase
                .rpc('add_question', {
                    p_sectionid: question.sectionId,
                    p_desiredorder: question.questionOrder
                })

            if (errorUpdate) throw errorUpdate

            let instance = new Worker('/workers/FetchSurvey.js');

            const workerPromise = new Promise((resolve, reject) => {
                instance.onmessage = ({ data }) => {
                    console.log(data.data);
                    resolve(data.data); // Resolve the promise with the data received from the worker
                };
                instance.onerror = (error) => {
                    console.error('Worker error:', error);
                    reject(error); // Reject the promise in case of an error
                };
            });

            let answers = data[0].answers
            delete data[0].answers
            data[0] = { ...data[0], type: "question", Answers2: answers }
            // Post message to worker
            instance.postMessage({ action: 'ADDQUESTION', addedQuestion: data[0], questions: survey.Sections2?.find((section) => section.id === data[0].sectionId).Questions2 });

            const workerResponse = await workerPromise;

            console.log(workerResponse)

            dispatch(addQuestion({ addedQuestion: data[0], updatedQuestions: workerResponse }))



            setIsSaving(false);
        }
        catch (error) {
            setIsSaving(false);

            console.log(error);
        }


    }

    async function AddSection() {
        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {

            let { data, insertError } = await supabase
                .rpc('add_section', {
                    section_order: sections.length + 1,
                    survey_id: survey.id
                })


            if (insertError) throw insertError

            let newSection = { ...data[0].data, type: "section" }

            dispatch(addSection(newSection))

            setIsSaving(false);

        }
        catch (error) {
            setIsSaving(false);

            console.log(error)
        }
    }

    return (
        <div className={className}>
            <IconButton icon={FaPlus} onClick={AddQuestion} className={'p-5 text-3xl '} />
            <IconButton icon={FaPause} onClick={AddSection} className={'p-5 rotate-90 text-3xl'} />

            {

                //<IconButton icon={FaFileImport} className={'p-5 text-3xl'} />

            }
        </div>
    );
}



export default ToolBarCommon;
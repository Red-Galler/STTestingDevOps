import { FaRegCopy } from "react-icons/fa";
import IconButton from "../IconButton";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion } from "../../slices/surveySlice";

function CopyQuestion({ question }) {


    let dispatch = useDispatch();

    const survey = useSelector(state => state.surveys.survey);

    async function AddCopyToDb() {

        let copyOfQuestion = { ...question };

        delete copyOfQuestion.id

        let { data, errorUpdate } = await supabase
            .rpc('copy_question', {
                question_obj: question
            })


        if (errorUpdate) console.log(errorUpdate)

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

            dispatch(addQuestion({addedQuestion: data[0], updatedQuestions:workerResponse}))

    }

    return (
        <IconButton icon={FaRegCopy} className={'m-2 text-4xl'} onClick={AddCopyToDb} />
    );
}



export default CopyQuestion
import { FaRegTrashAlt } from "react-icons/fa";
import IconButton from "../IconButton";
import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestion } from "../../slices/surveySlice";


function DeleteQuestion({ question }) {

    const dispatch = useDispatch();

    const [isDeleting, setIsDeleting] = useState(false); // Add state to track saving status


    const survey = useSelector(state => state.surveys.survey)

    const canDelete = survey.Sections2.find((section) => section.id === question.sectionId).Questions2.length > 1



    async function DeleteFromDb() {


        if (isDeleting) {
            return
        }


        console.log('EEEE')

        setIsDeleting(true);

        try {

            const { errorDelete } = await supabase.from('Questions2').delete().eq('id', question.id)

            if (errorDelete) throw errorDelete

            // Runs a stored procedure that is store in Supabase. with rpc we can access the function.
            // The function subtracts 1 from the answerOrderNrs if it is greater then 'deleted_ordernr'
            // If the 'deleted_ordernr' is 1, it subtracts 1 from all the answers
            let { errorUpdate } = await supabase
                .rpc('subtract_question_order_nr', {
                    deleted_ordernr: question.questionOrder,
                    section_id: question.sectionId
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

            // Post message to worker
            instance.postMessage({ action: 'DELETEQUESTION', sections: survey.Sections2, deletedQuestion: question });

            const workerResponse = await workerPromise;


            dispatch(deleteQuestion(workerResponse))



            setIsDeleting(false);


        }
        catch (error) {
            setIsDeleting(true);
            console.log(error)
        }

    }

    return (
        <IconButton icon={FaRegTrashAlt} className={'m-2 text-4xl'} onClick={() => canDelete && DeleteFromDb()} />
    );
}



export default DeleteQuestion;
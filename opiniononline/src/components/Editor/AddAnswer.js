import { Checkbox, Radio } from "@material-tailwind/react";
import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAnswer } from "../../slices/surveySlice";

function AddAnswer({ question, answersCount }) {

    const [isSaving, setIsSaving] = useState(false); // Add state to track saving status

    const dispatch = useDispatch();

    async function InsertAnswerIntoDb() {
        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {


            let answer = { questionId: question.id, answerContent: `Optie ${answersCount + 1}`, nextSectionId: null, orderNr: answersCount + 1 }

            const { error } = await supabase
                .from('Answers2')
                .insert(answer)
                .select()
                .single();

            if (error) throw error

            setIsSaving(false);
        }
        catch (error) {
            setIsSaving(false);
            console.log(error)
        }




    }

    return (
        <div className="flex items-center mt-2 gap-3 dark:text-dark-text">
            {
                question.questionKindId === 1 && <Radio className='mb-3' color="green" disabled /> ||
                question.questionKindId === 2 && <Checkbox className='mb-3' color="green" disabled /> ||
                question.questionKindId === 3 && <span className='text-2xl mb-1'>{answersCount + 1}.</span>  // Display a numbered item, adjust as necessary

            }
            <p className="text-xl mb-4"><span onClick={InsertAnswerIntoDb}>Optie toevoegen </span></p>
        </div>
    );

}





export default AddAnswer;
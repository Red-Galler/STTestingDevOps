import { useEffect, useRef, useState } from 'react';
import Input from './Input';
import { Checkbox, Option, Radio, Select } from '@material-tailwind/react';
import IconButton from '../IconButton';
import { FaGripHorizontal, FaGripVertical, FaTimes } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';
import { useSelector } from 'react-redux';
import { Reorder, useDragControls } from 'framer-motion';
import { debounce } from 'lodash';

function AnswerEdit({ answer, questionKind, canDelete, active, questionIsActive }) {
    const [updatedAnswer, setUpdatedAnswer] = useState(answer);

    const sections = [...useSelector(state => state.surveys.survey.Sections2), { sectionOrder: 0, title: "volgende" }, { sectionOrder: -1, title: "Verzenden" }];

    const dragControls = useDragControls();


    const isInitialRender = useRef([true, true]);


    // Debounced function for database updates
    const debouncedUpdateAnswer = useRef(debounce(async (updatedAnswer) => { console.log('jaaaa'); UpdateAnswer(updatedAnswer) }, 300)).current;


    const handleAnswerChange = (field, value) => {

        const answerToUpdate = { ...updatedAnswer, [field]: value }

        setUpdatedAnswer(answerToUpdate);

        debouncedUpdateAnswer(answerToUpdate); // Call debounced function for database update
    };





    async function UpdateAnswer(answer) {

        try {
            const { error } = await supabase.from('Answers2').update(answer).eq('id', answer.id).single()

            if (error) throw error;

        }
        catch (error) {
            console.log(error);
        }

    }


    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        console.log(updatedAnswer)
        UpdateAnswer(updatedAnswer)

    }, [updatedAnswer])




    useEffect(() => {

        if (isInitialRender.current[1]) {
            isInitialRender.current[1] = false;
            return;
        }

        UpdateAnswer(answer);

    }, [answer.orderNr])





    async function DeleteAnswer(answer) {
        if (canDelete) {
            try {

                const { errorDelete } = await supabase.from('Answers2').delete().eq('id', answer.id)

                if (errorDelete) throw errorDelete

                // Runs a stored procedure that is store in Supabase. with rpc we can access the function.
                // The function subtracts 1 from the answerOrderNrs if it is greater then 'deleted_ordernr'
                // If the 'deleted_ordernr' is 1, it subtracts 1 from all the answers
                let { errorUpdate } = await supabase
                    .rpc('subtract_answer_order_nr', {
                        question_id: answer.questionId,
                        deleted_ordernr: answer.orderNr
                    })


                if (errorUpdate) throw errorUpdate

            }
            catch (error) {
                console.log(error)
            }
        }
    }

    return (

        <Reorder.Item value={answer} id={answer.id} dragListener={false} dragControls={dragControls}>

            <div className={`sm:flex gap-3 items-center justify-between mt-2 group ${questionIsActive ? 'border dark:border-dark-border sm:border-0' : 'border-0'}`}>
                <div className='flex gap-3 items-center sm:w-full'>
                    <div className='flex items-center mb-3'>
                        <FaGripVertical className={`invisible text-gray-dark dark:text-dark-text cursor-pointer ${questionIsActive ? 'group-hover:visible invisible' : ''}`} onPointerDown={(event) => dragControls.start(event)} style={{ touchAction: 'none' }} />
                        {
                            questionKind === 1 && <Radio color="green" disabled /> ||
                            questionKind === 2 && <Checkbox color="green" disabled /> ||
                            questionKind === 3 && <span className='text-2xl'>{answer.orderNr}.</span>  // Display a numbered item, adjust as necessary

                        }
                    </div>
                    < Input className={"dark:text-dark-text"} value={updatedAnswer.answerContent} onChange={(newValue) => handleAnswerChange('answerContent', newValue)} />
                </div>





                <div className={`flex  items-center mt-2 w-3/12  ${active ? 'block' : 'hidden'}`}>
                    <IconButton icon={FaTimes} className={`m-2 text-2xl`} onClick={() => DeleteAnswer(answer)} />


                    {questionKind === 1 &&

                        <select className="text-lg bg-gray-50 border border-gray-300 text-gray-900 dark:bg-dark-secondary dark:text-dark-text dark:border-dark-border  rounded-md focus:ring-green-normal focus:border-green-normal block w-full p-2" onChange={(e) => handleAnswerChange('nextSectionOrder', e)}
                            value={updatedAnswer?.nextSectionOrder}>
                            {
                                sections.map((section) => {
                                    return (<option class key={section.sectionOrder} value={section.sectionOrder}>{section.title}</option>)
                                })
                            }
                        </select>


                    }


                </div>


            </div>
        </Reorder.Item >

    )

}


export default AnswerEdit;
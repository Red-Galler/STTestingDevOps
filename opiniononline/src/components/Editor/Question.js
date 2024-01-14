import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";

import { useDispatch, useSelector } from "react-redux";
import { changeActive, setIsLoadingFalse, setIsLoadingTrue, updateQuestion } from "../../slices/surveySlice";
import { Reorder, useDragControls } from "framer-motion";


import { Select, Option, Switch } from "@material-tailwind/react";
import { FaGripHorizontal } from "react-icons/fa";

import Input from './Input';
import IconButton from "../IconButton";
import AnswerEdit from "./AnswerEdit";
import AddAnswers from "./AddAnswer";
import DeleteQuestion from "./DeleteQuestion";
import CopyQuestion from "./CopyQuestion";
import { debounce } from "lodash";




// forwardref allows a component to expose its child element's references to a parent component 'section'
const Question = React.forwardRef(({ question }, ref) => {

    const dispatch = useDispatch();


    const [answers, setAnswers] = useState(question.Answers2);

    const allQuestionKinds = useSelector(state => state.surveys.allQuestionKinds);


    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);

    const isActive = activeBlock?.id === question.id && activeBlock?.type === question.type;

    const dragControls = useDragControls();


    const surveyStyle = useSelector(state => state.surveys.surveyStyles)

    const isInitialRender = useRef([true]);


    const [updatedQuestion, setUpdatedQuestion] = useState(question);

    // Debounced function for database updates
    const debouncedUpdateQuestion = useRef(debounce(async (updatedQuestion) => {UpdateQuestion(updatedQuestion)}, 300)).current;


    const handleQuestionChange = (field, value) => {

        const questionToUpdate = { ...updatedQuestion, [field]: value }

        setUpdatedQuestion(questionToUpdate);

        debouncedUpdateQuestion(questionToUpdate); // Call debounced function for database update
    };



    async function UpdateQuestion(question) {

        try {
            // Deletes added props before updating the row
            const copyOfQuestion = { ...question };

            delete copyOfQuestion.type;
            delete copyOfQuestion.Answers2
            delete copyOfQuestion.canUpdateOrder

            const { error } = await supabase.from('Questions2').update(copyOfQuestion).eq('id', question.id).single()


            if (error) throw error;

            dispatch(updateQuestion(question))

        }
        catch (error) {
            console.log(error);
        }

    }



    // when orderNr changes
    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        if (question.canUpdateOrder) {
            handleQuestionChange("questionOrder", question.questionOrder)
        } 

    }, [question.questionOrder])




    useEffect(() => {

        const subscription = supabase
            .channel(question.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Answers2' }, payload => {
                switch (payload.eventType) {
                    case 'INSERT':
                        if (payload.new.questionId === question.id) {
                            setAnswers(prev => [...prev, payload.new]);
                        }

                        break;
                    case 'DELETE':
                        setAnswers(prev => prev.filter(answer => answer.id !== payload.old.id));
                        break;
                    case 'UPDATE':
                        if (payload.new.questionId === question.id) {
                            //fetchAnswers(question);
                        }
                        break;
                    default:
                        break;
                }
            })
            .subscribe()


        return () => {
            subscription.unsubscribe();
        }
    }, [])




    function OnClickQuestion(e) {
        e.stopPropagation();
        dispatch(changeActive(question))
    }



    function ReorderAnswers(newOrder) {
        const updatedAnswers = newOrder.map((answer, index) => {
            let copyOfAnswer = { ...answer };
            if (index + 1 !== copyOfAnswer.questionOrder) {
                copyOfAnswer.orderNr = index + 1;
            }
            return copyOfAnswer;
        });

        setAnswers(updatedAnswers);
    }


    return (
        <Reorder.Item value={question} id={question.id} dragListener={false} dragControls={dragControls}
        >
            <div ref={ref} onClick={OnClickQuestion} className="w-full mt-10">


                <div className={`${isActive ? 'bg-white border dark:bg-dark-secondary dark:border-dark-border' : 'bg-transparent'} rounded-lg flex dark:text-dark-text`}>

                    <div className={`w-2 rounded-s-lg ${isActive && 'bg-primary'} transition-all duration-300 ease-in-out`}>

                    </div>
                    <div className="flex-1 p-4 dark:text-dark-text">
                        <div className={`${isActive ? 'flex' : 'hidden'} flex justify-center cursor-pointer`} >
                            <FaGripHorizontal className="text-gray-dark dark:text-dark-text" onPointerDown={(event) => dragControls.start(event)} style={{ touchAction: 'none' }} />
                        </div>
                        <div className={`relative sm:flex items-start gap-7`}>
                            <div     style={{ color: isActive ? undefined : surveyStyle?.questionColor }} className={`flex-1 ${isActive ? 'text-black' : ''} dark:text-dark-text`}>
                                <Input
                                    placeholder={'Uw vraag'}
                                    value={updatedQuestion.questionContent}
                                    onChange={(newValue) => handleQuestionChange('questionContent', newValue)}
                                    setStyling={true}
                                    className={`${surveyStyle.questionFontFamily} text-${surveyStyle.questionFontSize} ${updatedQuestion.isBold ? "font-bold" : "font-normal"}  ${updatedQuestion.isCursive ? "italic" : "not-italic"} ${updatedQuestion.isUnderlined ? "underline" : "no-underline"}`}
                                    onButtonClicks={{
                                        Bold: () => handleQuestionChange('isBold', !updatedQuestion.isBold),
                                        Cursive: () => handleQuestionChange('isCursive', !updatedQuestion.isCursive),
                                        Underlined: () => handleQuestionChange('isUnderlined', !updatedQuestion.isUnderlined),
                                    }}
                                    buttonStates={{
                                        isBold: updatedQuestion.isBold,
                                        isCursive: updatedQuestion.isCursive,
                                        isUnderlined: updatedQuestion.isUnderlined
                                    }}

                                />
                            </div>

                            {
                                isActive &&

                                <div>

                                    <Select
                                        size="lg"
                                        value={question.questionKindId}
                                        onChange={(newValue) => handleQuestionChange('questionKindId', newValue)}
                                        labelProps={{
                                            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
                                        }}
                                    >
                                        {
                                            allQuestionKinds.map((kind) => {
                                                return (<Option key={kind.id} value={kind.id}>{kind.kind}</Option>)
                                            })
                                        }

                                    </Select>
                                </div>

                            }

                        </div>
                        <div className="flex flex-col mt-3" style={{ color: isActive ? 'black' : surveyStyle?.questionColor }}>

                            <Reorder.Group onReorder={ReorderAnswers} axis="y" values={answers}>
                                {
                                    answers.map((answer) => {
                                        return (
                                            <AnswerEdit key={answer.id} answer={answer} questionKind={updatedQuestion.questionKindId} canDelete={answers.length > 1} active={isActive} questionIsActive={isActive} />
                                        )
                                    })
                                }
                            </Reorder.Group>

                            {
                                isActive &&


                                <div>
                                    <AddAnswers question={updatedQuestion} answersCount={answers.length} />

                                    <div>
                                        <hr className="mt-16 dark:border-dark-border" />
                                        <div className="flex justify-end p-4 gap-4">

                                            <div>
                                                <DeleteQuestion question={question} />
                                                <CopyQuestion question={question} />
                                            </div>


                                            <Switch className="h-full w-full" label={'Verplicht'}
                                                color="green"
                                                labelProps={{
                                                    className: "text-xl dark:text-dark-text",
                                                }}

                                                containerProps={{
                                                    className: 'w-11 h-6',
                                                }}
                                                circleProps={{
                                                    className: 'before:hidden left-0.5 border-none',
                                                }}
                                                checked={updatedQuestion.answerRequired}
                                                onChange={() => handleQuestionChange('answerRequired', !updatedQuestion.answerRequired)}
                                            />


                                        </div>
                                    </div>
                                </div>
                            }




                        </div>
                    </div>


                </div>






            </div>
        </Reorder.Item>

    );
})

export default Question




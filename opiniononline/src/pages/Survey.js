import { Button, Checkbox, Radio } from "@material-tailwind/react";
import IconButton from "../components/IconButton";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Route, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CheckboxGroup from "../components/Preview/CheckboxGroup";
import RadioButtonGroup from "../components/Preview/RadioButtonGroup";
import {useNavigate} from 'react-router-dom';

function Survey() {
    const { id } = useParams();

    const [survey, setSurvey] = useState(null);

    const [activeQuestion, setActiveQuestion] = useState(null);
    const [activeSection, setActiveSection] = useState(null);

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const [disablePrevious, setDisablePrevious] = useState(true);
    const [endOfSurvey, setEndOfSurvey] = useState(false);

    const [path, setPath] = useState([]);

    useEffect(() => {
        async function GetSurvey() {

            try {
                const { data, error } = await supabase.from('Surveys2').select('id, title , Sections2(id, sectionOrder, Questions2(*, Answers2(*)))').eq('id', id).single();

                if (error) throw error;


                if (data) {

                    setSurvey(data)

                    let firstSection = data.Sections2.find(section => section.sectionOrder === 1)

                    setActiveQuestion(FindFirstQuestion(firstSection))
                }
            }
            catch (error) {
                console.log(error)
            }

        }

        GetSurvey();
    }, [])





    useEffect(() => {

        if (activeQuestion) {

            const section = FindSectionById(activeQuestion.sectionId)

            setActiveSection(section)


            // When the we are back at the first question, we want to disable the backbutton and set an empty path
            if (activeQuestion?.questionOrder === 1 && section?.sectionOrder === 1) {
                setDisablePrevious(activeSection?.sectionOrder === 1 && activeQuestion?.questionOrder === 1)
                setPath([])
            }
        }


    }, [activeQuestion])

    const navigate = useNavigate();

    useEffect(() => {
        if (endOfSurvey) {
            SubmitAnswers();
            navigate('/Testen');
            // <Link to={`/Survey/${survey.id}`}>
        }
    }, [endOfSurvey])


    function NextQuestion() {
        
        setDisablePrevious(false)
        setPath(prev => [...prev, activeQuestion?.id])


        let nextSection = null;
        let nextQuestion = null;


        // When we have a question with radiobuttons it is possible that a radiobutton redirects to another section.

        if (activeQuestion.questionKindId === 1 && selectedAnswers[activeQuestion.id][0]?.nextSectionId != null) {

            nextSection = FindSectionById(selectedAnswers[activeQuestion.id][0].nextSectionId)
            nextQuestion = FindFirstQuestion(nextSection);

            // If the user clicks on the backbutton we need to know from which section and question we came from.
            nextQuestion['fromRedirect'] = { sectionId: activeSection.id, questionId: activeQuestion.id };

        }


        else {
            nextQuestion = activeSection.Questions2.find(question => question.questionOrder === activeQuestion.questionOrder + 1)

            // If there is no question left in the current section, we go to the next section
            if (!nextQuestion) {

                let nextSection = survey.Sections2.find(section => section.sectionOrder === activeSection.sectionOrder + 1)

                // If there is no next section, it means it is the end of the survey
                if (!nextSection) {
                    setEndOfSurvey(true);
                    return
                }

                nextQuestion = nextSection.Questions2.find(question => question.questionOrder === 1);
            }

        }


        setActiveQuestion(nextQuestion)

    }


    function PreviousQuestion() {

        let previousQuestion = null;

        if (endOfSurvey) {
            setEndOfSurvey(false);
            return
        }


        // When we go one question back we need to remove the current question from the path
        setPath(prev => prev.filter(question => question !== activeQuestion.id))





        // If we come from a redirect, we need to find the section and question from which this redirect comes
        if (activeQuestion.fromRedirect) {
            let newActiveSection = FindSectionById(activeQuestion.fromRedirect.sectionId);
            previousQuestion = newActiveSection.Questions2.find(question => question.id === activeQuestion.fromRedirect.questionId)

        }
        else {
            previousQuestion = activeSection.Questions2.find(question => question.questionOrder === activeQuestion.questionOrder - 1)
        }


        // If there is no previous question in the current section, we go one section back and take the last question
        if (!previousQuestion) {

            let previousSection = survey.Sections2.find(section => section.sectionOrder === activeSection.sectionOrder - 1)

            previousQuestion = previousSection.Questions2.find(question => question.questionOrder === previousSection.Questions2.length);
        }


        setActiveQuestion(previousQuestion)

    }


    // function SubmitAnswers() {

    //     // Converts the object to an array of [key, value]. We do this so we can compare to the path and only leave those that are included in the plath
    //     let ResponsesArray = Object.entries(selectedAnswers).filter(([key]) => path.includes(parseInt(key)))

    //     // Here we convert it back to an object
    //     let ResultResponses = Object.fromEntries(ResponsesArray)


    //     // Foreach question we need to insert the selected answers in the database
    //     console.log(ResultResponses)
    //     let orders = []
    //     let answers = []
    //     for (let question in ResultResponses) {
    //         let result = ResultResponses[question][0]
    //         answers.push(result.id);
    //         orders.push(result.questionId);

    //     }
    //     AddAnswersToDb(answers,orders)


    // }


    // async function AddAnswersToDb(answers,orders) {

    //     try {

    //         // Change properties of object so we can add directly to database
    //         // let newArray = response.map(answer => {
    //         //     // return { questionId: answer.questionId, answerId: answer.id }
                
    //         // })
    //         console.log('aaaaa')
    //         let newArray = {UserId: "f5aba26c-71ec-43a6-b673-fa9b2429fb89" ,SurveyId: id, Order: orders, Answers: answers}


    //         const { error } = await supabase
    //             .from('SurveyResults')
    //             .insert(newArray)


    //         if (error) throw error;
    //     }

    //     catch (error) {
    //         console.log(error)
    //     }
    // }


    
    function SubmitAnswers() {

        // Converts the object to an array of [key, value]. We do this so we can compare to the path and only leave those that are included in the plath
        let ResponsesArray = Object.entries(selectedAnswers).filter(([key]) => path.includes(parseInt(key)))

        // Here we convert it back to an object
        let ResultResponses = Object.fromEntries(ResponsesArray)


        // Foreach question we need to insert the selected answers in the database
        for (let question in ResultResponses) {
            AddAnswersToDb(ResultResponses[question])
        }
    }


    async function AddAnswersToDb(response) {

        try {

            // Change properties of object so we can add directly to database

            let newArray = response.map(answer => {
                return { questionId: answer.questionId, answerId: answer.id }
            })

            const { error } = await supabase
                .from('QuestionAnswer2')
                .insert(newArray)


            if (error) throw error;
        }

        catch (error) {
            console.log(error)
        }
    }

    /// HELPER FUNCTIONS ///
    function FindFirstQuestion(section) {
        return section.Questions2.find(question => question.questionOrder === 1)
    }


    function FindSectionById(id) {
        return survey.Sections2.find(section => section.id === id)
    }




    return (
        <div className="flex justify-center w-full h-[100%]">

            <div className="w-8/12 h-[50%]">
                <div className="h-full mt-6 border border-gray-dark rounded-xl shadow-xl p-10 text-2xl">
                    <div className="flex justify-between">
                        <h1 className="mb-8">{survey?.title}</h1>
                        LOGO
                    </div>
                    {
                        endOfSurvey ? <div>GEDAAN</div> :
                            <div>
                                <p className="text-start">{activeQuestion?.questionOrder}. {activeQuestion?.questionContent}</p>
                                <div className="flex flex-col mt-5">

                                    {

                                        activeQuestion?.questionKindId === 1 && <RadioButtonGroup key={activeQuestion.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion.id]: respons } })} responses={selectedAnswers[activeQuestion.id]} /> ||
                                        activeQuestion?.questionKindId === 2 && <CheckboxGroup key={activeQuestion.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion.id]: respons } })} responses={selectedAnswers[activeQuestion.id]} />
                                    }
                                </div>
                            </div>
                    }

                </div>
                <div className="flex items-center justify-between mt-5">
                    <div className="flex gap-3">
                        <Button disabled={disablePrevious} onClick={PreviousQuestion} size="lg" className="w-40 bg-gray-light border-primary-normal text-primary-normal">Vorige</Button>
                        <Button onClick={NextQuestion} size="lg" className="w-40 bg-primary">{endOfSurvey ? "Verzenden" : "Volgende"}</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}



export default Survey;
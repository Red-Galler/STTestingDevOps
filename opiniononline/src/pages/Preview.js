import { Button, Checkbox, Radio, useSelect } from "@material-tailwind/react";
import IconButton from "../components/IconButton";
import { FaPen } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CheckboxGroup from "../components/Preview/CheckboxGroup";
import RadioButtonGroup from "../components/Preview/RadioButtonGroup";
import SurveyLogo from "../components/Editor/SurveyLogo"
import { useDispatch, useSelector } from "react-redux";
import { fetchSurveyData, fetchSurveyStyle } from "../slices/surveySlice";
import SurveyCompletion from "../components/Preview/SurveyCompletion";
import { userContext } from '../App';


function Preview() {
    const { id } = useParams();
    const user = useContext(userContext); // Get the user UID using the hook



    const dispatch = useDispatch();
    const survey = useSelector(state => state.surveys.survey)


    const [isOwner, setIsOwner] = useState(survey?.ownerId === user.id)


    const surveyStyle = useSelector(state => state.surveys.surveyStyles)



    const [activeQuestion, setActiveQuestion] = useState(null);

    const [selectedAnswers, setSelectedAnswers] = useState({});


    const [disablePrevious, setDisablePrevious] = useState(true);
    const [disableNext, setDisableNext] = useState(true);


    const [endOfSurvey, setEndOfSurvey] = useState(false);

    const [path, setPath] = useState([]);


    function InitializeSurvey() {


        setPath([]);
        setEndOfSurvey(false)
        setDisablePrevious(true)
        setDisableNext(false)
        setSelectedAnswers({})


        let firstSection = FindSectionByOrder(1)

        let firstQuestion = FindFirstQuestion(firstSection)

        setActiveQuestion(firstQuestion)
    }

    useEffect(() => {
        async function fetchSurvey() {
            let data = await supabase.auth.getSession();

            dispatch(fetchSurveyStyle(id)).then(() => {

                let token = data.data.session.access_token
                dispatch(fetchSurveyData({ id: id, token: token }))
            })
        }


        fetchSurvey();


    }, [id])

    useEffect(() => {
        if (survey) {
            setIsOwner(survey.ownerId === user.id)

            InitializeSurvey();



        }
    }, [survey])




    useEffect(() => {

        if (activeQuestion) {
            const currentSection = FindSectionById(activeQuestion.sectionId)

            // When the we are back at the first question, we want to disable the backbutton and set an empty path
            if (activeQuestion?.questionOrder === 1 && currentSection?.sectionOrder === 1) {
                setDisablePrevious(true)
                setPath([])
            }

        }


    }, [activeQuestion])




    useEffect(() => {

        let selectedAnswer = selectedAnswers[activeQuestion?.id]

        if (activeQuestion?.answerRequired) {
            setDisableNext(selectedAnswer.length === 0);
        }
        else {
            setDisableNext(false)
        }

    }, [selectedAnswers])


    useEffect(() => {

        if(isOwner) return

        SubmitAnswers()
        sendSurveyCompletion()

    }, [endOfSurvey])

    async function NextQuestion() {

        setDisablePrevious(false)



        let currentSection = FindSectionById(activeQuestion.sectionId);
        let nextSection = null;
        let nextQuestion = null;

        // When we have a question with radiobuttons it is possible that a radiobutton redirects to another section.

        if (activeQuestion.questionKindId === 1 && selectedAnswers[activeQuestion.id] && selectedAnswers[activeQuestion.id][0]?.nextSectionOrder) {

            console.log(selectedAnswers[activeQuestion.id][0]?.nextSectionOrder)
            if (selectedAnswers[activeQuestion.id][0]?.nextSectionOrder === -1) {
                setPath(prev => [...prev, activeQuestion])
                setEndOfSurvey(true)

                return
            }

            nextSection = FindSectionByOrder(selectedAnswers[activeQuestion.id][0]?.nextSectionOrder)

            nextQuestion = FindFirstQuestion(nextSection);

            console.log(nextSection)

        }


        else {

            if (currentSection.Questions2.length === activeQuestion.questionOrder) {

                if (currentSection.nextSectionOrder === 0) {
                    nextSection = FindSectionByOrder(currentSection.sectionOrder + 1);

                    if (!nextSection) {
                        setEndOfSurvey(true);

                        setPath(prev => [...prev, activeQuestion])


                        return

                    }

                    nextQuestion = FindFirstQuestion(nextSection)
                }

                else if (currentSection.nextSectionOrder === -1) {
                    setEndOfSurvey(true);

                    setPath(prev => [...prev, activeQuestion])

                    return
                }

                else {
                    console.log('nuuuu')
                    nextSection = FindSectionByOrder(currentSection.nextSectionOrder);
                    nextQuestion = FindFirstQuestion(nextSection)

                }
            }


            else {
                nextQuestion = currentSection.Questions2.find(question => question.questionOrder === activeQuestion.questionOrder + 1)
            }

        }


        nextQuestion = { ...nextQuestion, fromRedirect: { sectionId: currentSection.id, questionId: activeQuestion.id } };


        setPath(prev => [...prev, activeQuestion])


        setActiveQuestion(nextQuestion)

    }


    function PreviousQuestion() {

        let previousQuestion = null;

        if (endOfSurvey) {
            previousQuestion = path.at(-1)

            console.log('ZZZZ', previousQuestion)

            setEndOfSurvey(false);
        }


        else {

            // When we go one question back we need to remove the current question from the path
            let updatedPath = path.filter(question => question.id !== activeQuestion.id)

            previousQuestion = updatedPath.at(-1)

            setPath(updatedPath)
        }

        setActiveQuestion(previousQuestion)

    }


    function SubmitAnswers() {

        // Converts the object to an array of [key, value]. We do this so we can compare to the path and only leave those that are included in the plath
        let ResponsesArray = Object.entries(selectedAnswers).filter(([key]) => path.some((question) => question.id === parseInt(key)))

        console.log(ResponsesArray)



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
        return survey?.Sections2.find(section => section.id === id)
    }


    function FindSectionByOrder(order) {
        return survey?.Sections2.find(section => section.sectionOrder === order)
    }



    async function sendSurveyCompletion() {


        const url = 'http://localhost:8000/functions/v1/notifySurveyOwner';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6InhuU00wWStYQTlIYm50b3IiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA0NjE3NzUxLCJpYXQiOjE3MDQ2MTQxNTEsImlzcyI6Imh0dHBzOi8veWFod2NtcGVkYWhxa29leXVscGsuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImNiMDE3OTM0LTI5ZGUtNDVhNC1iMjc0LTcxYThkOWI1ZDlmMyIsImVtYWlsIjoiemFrYXJpYS5ib3VobGFsYUBzdHVkZW50Lm9kaXNlZS5iZSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzA0NTU0NDE0fV0sInNlc3Npb25faWQiOiJlZGMxMjQ4NS1hMmFlLTRlMTctOTM2Mi1lZTg5YjU1NmMxMzUifQ.-8mm3Io79r8nxtfQuF8y_39nnBP-v8HpYCK15YfZ_sM" // Only if authentication is needed
                },
                body: JSON.stringify({ owner_id: survey.ownerId, survey: survey, surveyCompleter: user })
            });


            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();


            if(responseData.status === "FAILED") throw new Error("Error");


        } catch (error) {
            console.error("Error sending request:", error);
        }
    }




    return (
        <div className="flex justify-center w-full h-[calc(100vh-5rem)]">

            <div className="w-full lg:w-8/12 lg:h-[70%] ">
                {isOwner &&
                    <div className="hidden lg:flex justify-end mt-6 text-3xl">
                        <Link to={`/Editor/${id}`}>
                            <FaPen className="text-gray-darker" />
                        </Link>
                    </div>
                }



                {endOfSurvey ? isOwner ? <Navigate to={`/Editor/${id}`} /> : <SurveyCompletion surveyId={id} userId={user.id} onRetake={InitializeSurvey} /> :
                    <div style={{
                        backgroundImage: `url(${survey?.background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                        className="relative h-full border border-gray-dark lg:rounded-xl shadow-xl  text-2xl p-10 lg:mt-5  overflow-hidden dark:border-dark-border"
                    >

                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the color and opacity as needed
                            zIndex: 1
                        }}></div>

                        <div className="relative z-20 h-full">

                            {isOwner &&
                                <div className="flex lg:hidden justify-end mt-6 text-3xl">
                                    <Link to={`/Editor/${id}`}>
                                        <FaPen className="text-gray-darker" />
                                    </Link>
                                </div>
                            }
                            <div className="flex items-center justify-between  mt-3">


                                {

                                    survey?.logo && surveyStyle ?
                                        <div className={`${surveyStyle.logoPosition === 'end' ? 'order-1' : 'order-0'}`}>
                                            <SurveyLogo logo={survey?.logo} surveyStyle={surveyStyle} />
                                        </div> : null
                                }



                                <h1 style={{ color: surveyStyle?.titleColor }} className={`
                                        text-end
                                        
                                        text-${surveyStyle?.titleFontSize} 
                                        ${surveyStyle?.titleFontFamily} 
                                        ${surveyStyle?.titleIsBold ? "font-bold" : "font-normal"}
                                        ${surveyStyle?.titleIsCursive ? "italic" : "not-italic"}
                                        ${surveyStyle?.titleIsUnderlined ? "underline" : ""}
                                        `}
                                >
                                    {survey?.title}
                                </h1>

                            </div>


                            <div style={{ color: surveyStyle?.questionColor }} className="mt-10">

                                {

                                    <div className="">
                                        <p
                                            className={`
                                                text-${surveyStyle?.questionFontSize} 
                                                ${surveyStyle?.questionFontFamily} 
                                                ${activeQuestion?.isBold ? "font-bold" : "font-normal"}  
                                                ${activeQuestion?.isCursive ? "italic" : "not-italic"} 
                                                ${activeQuestion?.isUnderlined ? "underline" : "no-underline"}`}

                                        >
                                            {activeQuestion?.questionOrder}. {activeQuestion?.questionContent}
                                        </p>


                                        <div className="flex flex-col mt-5">

                                            {

                                                activeQuestion?.questionKindId === 1 && <RadioButtonGroup key={activeQuestion?.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion?.id]: respons } })} responses={selectedAnswers[activeQuestion?.id]} color={surveyStyle?.questionColor} /> ||
                                                activeQuestion?.questionKindId === 2 && <CheckboxGroup key={activeQuestion.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion.id]: respons } })} responses={selectedAnswers[activeQuestion.id]} color={surveyStyle?.questionColor} />
                                            }
                                        </div>

                                    </div>
                                }
                            </div>

                            <div className="hidden lg:block absolute bottom-0 w-full">

                                <p style={{ color: surveyStyle?.footerColor }} className={`
                                        text-end
                                        
                                        text-${surveyStyle?.footerFontSize} 
                                        ${surveyStyle?.footerFontFamily} 
                                        ${surveyStyle?.footerIsBold ? "font-bold" : "font-normal"}
                                        ${surveyStyle?.footerIsCursive ? "italic" : "not-italic"}
                                        ${surveyStyle?.footerIsUnderlined ? "underline" : ""}
                                        `}
                                >
                                    {survey?.footer}
                                </p>
                            </div>

                        </div>


                        <div className="z-20 flex lg:hidden items-center w-10/12 gap-3 absolute bottom-20">
                            <Button disabled={disablePrevious} onClick={PreviousQuestion} size="lg" className="w-full md:w-40 bg-gray-light border-primary-normal text-primary-normal dark:bg-dark-secondary">Vorige</Button>
                            <Button disabled={disableNext} onClick={NextQuestion} size="lg" className="w-full md:w-40 bg-primary">{endOfSurvey ? "Verzenden" : "Volgende"}</Button>
                        </div>

                    </div>

                }

                {
                    !endOfSurvey && <div className="hidden lg:flex items-center gap-3 mt-5">
                        <Button disabled={disablePrevious} onClick={PreviousQuestion} size="lg" className="w-40 bg-gray-light border-primary-normal text-primary-normal dark:bg-dark-secondary">Vorige</Button>
                        <Button disabled={disableNext} onClick={NextQuestion} size="lg" className="w-40 bg-primary">{endOfSurvey ? "Verzenden" : "Volgende"}</Button>
                    </div>
                }

            </div>
        </div>
    );
}



export default Preview;
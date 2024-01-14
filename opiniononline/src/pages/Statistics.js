import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from "../supabaseClient";
import { fetchSurveyData, updateSectionsList } from '../slices/surveySlice';
import { FaEllipsisV, FaCopy } from "react-icons/fa";
import { Chart } from "react-google-charts";
import IconButton from "../components/IconButton";


function Statistics() {
    const dispatch = useDispatch();
    const [datas, setDatas] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        console.log(id)
        //dispatch(fetchSurveyData(id));
        async function test() {
            // const { data, error } = await supabase.from('QuestionAnswer2')
            //     .select('questionId, answerId, count(*) AS answer_count')
            //     .group('questionId, answerId')

            const { data, error } = await supabase.from('answers_by_question').select('*')
            // console.log("data")
            // console.log(data)


            // const transformedData = data.reduce((result, entry) => {



            //     if (entry.answerId !== undefined && entry.answer_count !== undefined) {
            //       result.push([entry.answerId.toString(), entry.answer_count]);
            //     }
            //     return result;


            //   }, []);

            //   // Add a single "Answers" column header
            //   const finalData = [["Answers", "Value"], ...transformedData];

            //   console.log("transformedData")
            //   console.log(transformedData)





            const groupedData = new Map();

            data.forEach(element => {
                const { questionId, answerId, answer_count } = element;

                // If the questionId is not in the Map, create a new entry
                if (!groupedData.has(questionId)) {
                    groupedData.set(questionId, []);
                }

                // Add the current element to the corresponding questionId entry
                groupedData.get(questionId).push([answerId.toString(), answer_count]);
            });
            let test = []

            // Now you have a Map where each entry represents a group of elements with the same questionId
            groupedData.forEach((data, questionId) => {
                //   console.log(`QuestionId: ${questionId}`);
                const finalData = [questionId,["Answers", "Value"], ...data];
                test.push(finalData)
            });
            // console.log("test")
            // console.log(test)

            setDatas(test);








        }
        test();

    }, [id, dispatch]);


    const options = {
        pieHole: 0.2,
        is3D: false,
        slices: {
            0: { color: '#81c784' },
            1: { color: '#9e9e9e' }
        }
    };
    const activeBlock = useSelector(state => state.surveys.active);

    // Stores the active section or question. So if activeBlock changes it stores the div in this ref
    const ref = useRef(null);


    useEffect(() => {

        setTimeout(() => {

            if (ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 150);


    }, [activeBlock])


    // useEffect(() => {
    //     const subscription = supabase
    //         .channel(`project ${id}`)
    //         .on('postgres_changes', { event: '*', schema: 'public', table: 'Sections2' }, payload => {
    //             switch (payload.eventType) {
    //                 case 'INSERT':

    //                     // When a new section is added, the list of sections need to get updated
    //                     dispatch(updateSectionsList(payload.new))

    //                     break;
    //                 case 'DELETE':
    //                     break;
    //                 case 'UPDATE':
    //                     //TODO///
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         })
    //         .subscribe()


    //     return () => {
    //         subscription.unsubscribe();
    //     }
    // }, [])




    return (
        <div className="flex w-full bg-gray-light">

            {/* Left Sidebar */}
            <div className="w-1/4 h-screen bg-white text-left dark:bg-dark-default border-e dark:border-dark-border">
                <div className="rectangle-5">
                    <div className="aantal-antwoorden py-20 px-2 border border-gray-200 dark:border-dark-border">
                        <div>
                            <div className="flex justify-between">
                                <p>Aantal antwoorden</p>
                                <IconButton icon={FaEllipsisV} message={'Meer'} />
                            </div>
                        </div>

                    </div>

                    <div className="p-2 border border-gray-200 dark:bg-dark-secondary dark:border-dark-border">Overzicht</div>
                    <div className="p-2 border border-gray-200 dark:bg-dark-secondary dark:border-dark-border">Vraag</div>
                    <div className="p-2 border border-gray-200 dark:bg-dark-secondary dark:border-dark-border">Individueel</div>
                </div>
            </div>

            {/* Right Canvas */}
            <div className="w-full md:w-3/4 p-4 flex flex-col items-center dark:bg-dark-default">
                <div className="w-4/5 bg-white border border-gray-dark p-4 m-2 text-left dark:bg-dark-secondary">
                    <div className="flex justify-between">
                        <div>
                            <h1>Vraag</h1>
                            <p>Aantal antwoorden</p>
                        </div>
                        <div className="text-right">
                            <IconButton icon={FaCopy} message={'Copy'} />
                        </div>
                    </div>
                    <div className="rectangle-10 p-2">
                        {
                            datas.map((data, index) => {
                                // Create a new options object for each chart
                                const chartOptions = { ...options, title: data[0] };
                                let test = data.slice(1)
                                return (
                                    <Chart
                                        key={index}
                                        chartType="PieChart"
                                        data={test}
                                        options={chartOptions}
                                        width={"100%"}
                                        height={"400px"}
                                    />
                                );
                            })
                        }


                        {/* {

                            datas.forEach(data => {                  
                                return <Chart
                                chartType="PieChart"
                                data={data}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                                />
                            })
                            
                        }
                         */}
                    

                    </div>
                </div>



            </div>
        </div>
    );
}

export default Statistics;
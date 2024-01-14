import { useState, useContext, useEffect } from "react";
import ProjectCard from "../components/Projecten/ProjectCard";
import RecommendedTemplates from "../components/Projecten/RecommendedTemplates";
import { userContext } from '../App';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSurveys } from "../slices/surveySlice";
import { useNavigate } from "react-router-dom";

function Projecten() {
    const dispatch = useDispatch();
    const loggedInUserId = useContext(userContext).id;

    const surveys = useSelector(state => state.surveys.allSurveys);

    const [activeStatusPicker, setActiveStatusPicker] = useState(null);

    useEffect(() => {

        dispatch(fetchAllSurveys(loggedInUserId));
        document.addEventListener('click', (e) => {
            setActiveStatusPicker(null);
        });

    }, []);

    return (
        <div className="w-full p-5 dark:bg-dark-default dark:text-white">

            <RecommendedTemplates />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5 dark:bg-dark-default dark:text-white">
                {surveys.map((survey) => (
                    <ProjectCard
                        key={survey.id}
                        survey={survey}
                        isActive={activeStatusPicker === survey.id}
                        onActivePicker={() => setActiveStatusPicker(prev => prev === survey.id ? null : survey.id)}
                    />
                ))}
            </div>
            
        </div>
    );
}

export default Projecten;

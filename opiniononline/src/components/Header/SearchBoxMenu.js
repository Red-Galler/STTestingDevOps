import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
} from "@material-tailwind/react";

import { useDispatch, useSelector } from "react-redux";
import { FaArrowRightToBracket, FaCircleUser, FaImage } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture } from "../../slices/surveySlice";
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../../App";
import { FaWpforms } from "react-icons/fa";

function ProfileMenu({ searchInput }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const allSurveys = useSelector(state => state.surveys.allSurveys);
    const [filteredSurveys, setFilteredSurveys] = useState(allSurveys);

    const [input, setInput] = useState(searchInput);

    useEffect(() => {
        setInput(searchInput);

        let filtered = allSurveys.filter((survey) => (survey.title.toLowerCase()).includes(searchInput.toLowerCase()))
        setFilteredSurveys(filtered)

    }, [searchInput])

    function OpenSurvey(survey){
        navigate(`/Editor/${survey.id}`)
        setInput(null)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            event.stopPropagation()
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setInput(null);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);
    
    return (
        <div className="w-full absolute flex justify-center">
            {input &&
                <div ref={menuRef} className="bg-white dark:bg-dark-secondary border dark:border-dark-border w-full sm:w-11/12 lg:w-6/12 z-40 rounded-t-md shadow-xl">
                    {filteredSurveys.map((survey) => {
                        return (
                            <div onClick={() => OpenSurvey(survey)} className="flex justify-between items-center p-5 hover:bg-gray-300 dark:hover:bg-dark-third">
                                <FaWpforms className="text-primary-normal text-2xl" />
                                <div className="flex-1 ms-5">
                                    <p className="dark:text-dark-text">{survey.title}</p>
                                </div>
                                <p className="font-thin text-gray-darker dark:text-dark-text">{new Date(survey.created_at).toLocaleDateString()}</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default ProfileMenu;

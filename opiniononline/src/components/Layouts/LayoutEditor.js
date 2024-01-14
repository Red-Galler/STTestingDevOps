import { Outlet, useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import { Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { clearSurvey, fetchSurveyData } from "../../slices/surveySlice";
import { userContext } from "../../App";

function LayoutCreate() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useContext(userContext);
    const navigate = useNavigate();

    const survey = useSelector(state => state.surveys.survey)


    let menuItems = [
        { name: 'Edit', link: `/Editor/${id}` },
        { name: 'Answers', link: `/Editor/${id}/Answers` },
        { name: 'Feedback', link: `/Editor/${id}/Feedback` },
    ]

    
    const isLoading = useSelector(state => state.surveys.isLoading)



    useEffect(() => {

        console.log(id)
        async function fetchSurvey() {
            let data = await supabase.auth.getSession(); // Example, adjust based on your auth setup


            let token = data.data.session.access_token
            dispatch(fetchSurveyData({ id: id, token: token }))
        }


        fetchSurvey();


        return ()=> {
            dispatch(clearSurvey())
        }
    }, [id]);


    useEffect(()=> {
        if (survey && survey?.ownerId !== user.id) navigate('*')

    }, [survey])




    return (

        <div className="flex dark:bg-dark-default">
            <div className="h-[calc(100vh-5rem)] overflow-y-auto sticky top-20  lg:block w-50 border border-t-0 dark:border-dark-border">
                <Nav className="" menuItems={menuItems} />
            </div>
            <main className="flex-1 w-full">
                {isLoading &&
                    <div className="fixed w-full h-full  flex justify-center items-center z-50 backdrop-blur-xl">
                        <Spinner color="green" className="h-32 w-32" />
                    </div>}
                <Outlet />
            </main>
        </div>

    );
}

export default LayoutCreate;
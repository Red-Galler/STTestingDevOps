import { FaWpforms, FaChevronDown, FaShareAlt, FaEllipsisH, FaRegStar } from "react-icons/fa";
import StatusPicker from "./StatusPicker";
import IconButton from "../IconButton";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { updateSurveys } from "../../slices/surveySlice";
import MoreMenu from "./MoreMenu"
import { hover } from "@testing-library/user-event/dist/hover";
import DuplicateProjectModal from "./DuplicateProjectModal";
import DetailsDrawer from "./DetailsDrawer";
import DeleteProjectModal from "./DeleteProjectModal";
import ShareModal from "./ShareModal";


function ProjectCard({ survey, isActive, onActivePicker }) {
    const [updatedSurvey, setUpdatedSurvey] = useState(survey);

    const [hovered, setHovered] = useState(false)

    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const allStatuses = useSelector(state => state.surveys.surveyStatuses)
    const [surveyStatus, setSurveyStatus] = useState();



    useEffect(() => {
        let status = allStatuses.find(status => status.id === updatedSurvey.statusId)

        setSurveyStatus(status)

    }, [updatedSurvey.statusId])


    const editableTitle = useRef();

    const dispatch = useDispatch();

    const isInitialRender = useRef([true]);


    useEffect(() => {

        if (isInitialRender.current[0]) {

            isInitialRender.current[0] = false;
            return;
        }

        async function UpdateSurvey(survey) {
            try {

                const copyOfSurvey = { ...survey };
                delete copyOfSurvey.background;

                const { error } = await supabase.from('Surveys2').update(copyOfSurvey).eq('id', copyOfSurvey.id)

                if (error) throw error

            }

            catch (error) {
                console.log(error)
            }
            dispatch(updateSurveys(survey))

        }

        UpdateSurvey(updatedSurvey)


    }, [updatedSurvey])


    function OnEditTitle() {

        editableTitle.current.focus()

        // Select the content when p is focussed
        const range = document.createRange();
        range.selectNodeContents(editableTitle.current);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);


    }


    function OnBlur(e) {
        console.log(e.target.innerText)

        setUpdatedSurvey(prev => ({ ...prev, title: e.target.innerText }))
    }


    return (
        <div className="relative m-2">
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="group flex flex-col h-[290px] bg-gray-200 dark:bg-dark-secondary border border-gray-400 dark:border-dark-border rounded-xl">

                <div className="flex items-center gap-1 p-2 text-xl text-gray-darker dark:text-dark-text overflow-hidden">
                    <FaWpforms className="text-primary-normal absolute" />
                    <p
                        ref={editableTitle}
                        contentEditable
                        className="ml-6 whitespace-nowrap overflow-hidden"
                        tabIndex={1}
                        onBlur={OnBlur}
                        onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}
                    >
                        {updatedSurvey.title}
                    </p>


                    <IconButton onClick={() => setUpdatedSurvey(prev => ({ ...prev, is_marked: !prev.is_marked }))} className={`hidden group-hover:flex items-center justify-center absolute right-2 p-1 ${updatedSurvey.is_marked ? 'bg-primary text-white' : ''}`} icon={FaRegStar} />



                </div>

                <div style={{
                    backgroundImage: `url(${survey?.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }} className="flex-1 relative">


<div 
                    className={`${hovered ? 'flex' : 'hidden'} items-center justify-between p-2 absolute bottom-0 z-30 bg-gray-200 dark:bg-dark-default w-full`}
                >

                        <Link to={`/Editor/${survey.id}`}>
                            <button className="bg-primary py-2 px-3 text-white rounded">Openen</button>
                        </Link>



                        <div className="flex gap-5 text-2xl text-gray-darker">
                            <IconButton icon={FaShareAlt} message={'Delen'} onClick={() => setIsShareModalOpen(true)}/>
                            <MoreMenu
                                survey={survey}
                                onEditTitle={OnEditTitle}
                                onDuplicate={() => setIsDuplicateModalOpen(true)}
                                onOpenDetails={() => setIsDetailsDrawerOpen(true)}
                                onChangeStatus={onActivePicker}
                                onRemoveMarked={() => setUpdatedSurvey(prev => ({ ...prev, is_marked: false }))}
                                onOpenInNewTab={() => window.open(`/Editor/${survey.id}`, '_blank')}
                                onDelete={() => setIsDeleteModalOpen(true)}
                                isSurveyMarked={survey.is_marked}
                                onShare={() => setIsShareModalOpen(true)} />
                        </div>

                    </div>


                </div>



                <div className="flex items-center justify-between py-1 px-3 bg-gray-normal border-t border-gray-dark dark:bg-dark-secondary  dark:border-dark-border rounded-b-xl">
                    <div id="statusPickerDropdown" className="flex items-center gap-2 dark:text-dark-text">

                        <div className={`w-4 h-4 ${surveyStatus?.color} rounded-2xl`}></div>
                        <p className="text-lg">{surveyStatus?.name}</p>

                    </div>
                    
                    <IconButton id="statusPickerDropdown" icon={FaChevronDown} onClick={() => onActivePicker()} className={'dark:text-dark-text'}/>

                </div>


            </div>

            <StatusPicker  id="statusPickerDropdown" onChangeStatus={(statusId) => setUpdatedSurvey(prev => ({ ...prev, statusId: statusId }))} active={isActive} />

            <DuplicateProjectModal surveyToCopy={updatedSurvey} open={isDuplicateModalOpen} onClose={() => setIsDuplicateModalOpen(false)} />

            <DetailsDrawer survey={updatedSurvey} open={isDetailsDrawerOpen} onClose={() => setIsDetailsDrawerOpen(false)} />

            <DeleteProjectModal surveyToDelete={updatedSurvey} open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />


            <ShareModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} survey={updatedSurvey} onMakePublic={() => setUpdatedSurvey(prev => ({ ...prev, isPublic: !prev.isPublic }))} />

        </div>

    )

}


export default ProjectCard;
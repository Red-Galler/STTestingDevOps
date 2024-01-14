import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StyleSettings from "./StyleSettings";
import StyleThemes from "./StyleThemes";



function ProjectStyles({ className }) {

    const [selectedBox, setSelectedBox] = useState('Settings');

    const survey = useSelector(state => state.surveys.survey);
    const surveyStyle = useSelector(state => state.surveys.surveyStyles);


    function RenderComponent() {
        switch (selectedBox) {
            case "Settings":
                return <StyleSettings/>
            case "Themes":
                return <StyleThemes surveyId={survey.id} surveyStyle={surveyStyle} onChange={()=> setSelectedBox('Settings')} />
            default:
                break;
        }
    }




    function StyleElement(element) {
        console.log(element)
        setSelectedBox(element)
    }


    return (
        <div className={`${className}`}>
            <div className="shadow-lg h-full">
                <div className="flex gap-3 justify-center border border-gray-normal dark:border-dark-border dark:text-dark-text h-16 relative">
                    <h2 className=" flex items-center justify-center relative w-3/12 cursor-pointer" onClick={() => StyleElement("Settings")} >
                        Instellingen
                        {<span className={`${selectedBox === 'Settings' ? 'opacity-100': 'opacity-0'} absolute left-0 right-0 bottom-0 h-[3px] bg-primary transition-opacity`} ></span>}
                    </h2>

                    <h2 className=" flex items-center justify-center relative w-3/12  cursor-pointer" onClick={() => StyleElement("Themes")} >
                        Thema's
                        {<span className={`${selectedBox === 'Themes' ? 'opacity-100': 'opacity-0'} absolute left-0 right-0 bottom-0 h-[3px] bg-primary transition-opacity`} ></span>}
                    </h2>
                </div>

                {
                    selectedBox ? <div className="bg-white">{RenderComponent()}</div> :
                        null
                }
            </div>

        </div>
    );
}


export default ProjectStyles;
import { useEffect, useState } from "react";
import IconButton from "../IconButton";
import { FaFileImport, FaPause, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import ToolBarCommon from "./ToolBarCommon";

function ToolBarSide({className}) {
    const [scrollOffset, setScrollOffset] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
            setScrollOffset(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])



    return (
        <div className={`${className} relative`}>

            <div className="bg-white border dark:bg-dark-default dark:border-dark-border rounded-lg shadow-lg absolute  transition-all ease-in-out delay-100"
                style={{ top: `${scrollOffset + 225}px` }}
            >
                <ToolBarCommon/>
            </div>
        </div>
    );
}


export default ToolBarSide;
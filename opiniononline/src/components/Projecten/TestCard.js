import { FaWpforms, FaChevronDown, FaShareAlt, FaEllipsisH, FaRegStar } from "react-icons/fa";
import StatusPicker from "./StatusPicker";
import IconButton from "../IconButton";
import { Link } from "react-router-dom";


function TestCard({ survey, isActive, onActivePicker }) {

    return (
        <div className="relative m-2">
            <div className="flex flex-col h-[290px] group bg-gray-light border border-gray-dark rounded-xl ">

                <div className="flex items-center gap-1 p-2 text-xl text-gray-darker overflow-hidden">
                    <FaWpforms className="text-primary-normal absolute" />
                    <p className="ml-6">{survey.title}</p>
                    <div className="hidden group-hover:flex items-center justify-center absolute right-2 h-8 w-8 p-1 bg-gray-200 border border-gray-200 rounded-2xl cursor-pointer">
                        <FaRegStar className="text-gray-400" />
                    </div>
                </div>

                <div className="flex-1 bg-white"></div>

                <div className="hidden group-hover:flex items-center justify-between p-2">

                    <Link to={`/Survey/${survey.id}`}>
                        <button className="bg-primary py-2 px-3 text-white rounded">Openen</button>
                    </Link>



                    <div className="flex gap-5 text-2xl text-gray-darker">
                        <IconButton icon={FaShareAlt} message={'Delen'} />
                        <IconButton icon={FaEllipsisH} message={'Meer'} />
                    </div>

                </div>

                <div className="flex items-center justify-between py-1 px-3 bg-gray-normal border-t border-gray-dark rounded-b-xl">
                    <div className="flex items-center gap-2">

                        <div className=" w-4 h-4 bg-blue-400 rounded-2xl"></div>
                        <p className="text-lg">Concept</p>

                    </div>
                    {/* <IconButton icon={FaChevronDown} onClick={() => onActivePicker()} /> */}

                </div>


            </div>

            <StatusPicker active={isActive} />

        </div>

    )

}


export default TestCard;
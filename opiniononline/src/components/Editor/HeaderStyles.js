import { FaChevronLeft } from "react-icons/fa";
import IconButton from "../IconButton";

function HeaderStyles({ title, onBack }) {
    return (
        <div className="flex items-center gap-3  border border-gray-dark dark:border-dark-border py-3 ps-3">
            <IconButton icon={FaChevronLeft} onClick={onBack} />
            <h3 className="font-semibold">{title}</h3>
        </div>
    )
}


export default HeaderStyles;
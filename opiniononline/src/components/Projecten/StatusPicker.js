import { useSelector } from "react-redux";

function StatusPicker({ onChangeStatus, active }) {
    const statuses = useSelector(state => state.surveys.surveyStatuses)

    return (
        <div className={`absolute w-full z-10 transition-all duration-200 ease-in-out ${active ? 'translate-y-0 opacity-100' : 'hidden'}  id =statusPickerDropdown `}>
            <div  className="bg-white dark:bg-dark-secondary border dark:border-dark-border shadow-lg rounded-md mx-2">
                <ul >
                    {
                        statuses.map((status) => (
                            <li 
                                onClick={() => onChangeStatus(status.id)} 
                                key={status.id} id={`statusOption-${status.id}`}
                                className="mt-2 px-5 py-1 hover:bg-gray-200 dark:hover:bg-dark-third"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-4 h-4 rounded-2xl ${status.color}`}></div>
                                    <p className="text-lg text-gray-900 dark:text-dark-text">{status.name}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default StatusPicker;

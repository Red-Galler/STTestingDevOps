import { Tooltip } from "@material-tailwind/react";

function IconButton({ icon, message = null, placement = 'top', className, onClick = () => {} }) {
    const Icon = icon

    function OnClick(e){
        e.stopPropagation();
        onClick(e);
    }
    return (

        <Tooltip content={message} placement={placement} className={`bg-gray-darker ${!message ? 'hidden': ''}`}>
            <button onClick={OnClick} className={`${className} z-10 hover:bg-gray-normal text-gray-darker dark:text-dark-text dark:hover:bg-dark-third hover:text-primary-normal p-2 rounded-md`}>
                <Icon />
            </button>
        </Tooltip>
    
    );
}


export default IconButton;
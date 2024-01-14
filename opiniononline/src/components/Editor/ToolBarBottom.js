import ToolBarCommon from "./ToolBarCommon";

function ToolBarBottom({className}){
    return (
        <div className={`${className} sticky bottom-0 w-10/12 mx-auto bg-white z-40 border border-gray-400 dark:bg-dark-default dark:border-dark-border rounded-t-xl`}>
            <ToolBarCommon className={'flex justify-around'}/>
        </div>
    );
}



export default ToolBarBottom;
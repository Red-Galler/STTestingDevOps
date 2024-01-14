function ProjectStyleBox({ className, title, content = null, onClick }) {
    return (
        <div onClick={onClick} className={`${className} flex flex-col h-48  p-3 border-gray-normal cursor-pointer`}>
            <p  className="text-start mb-2">{title}</p>

            <div  className="flex-1 flex items-center justify-center border border-gray-normal dark:border-dark-border shadow-md p-1 h-28">
                {content}
            </div>

        </div>
    );
}


export default ProjectStyleBox;
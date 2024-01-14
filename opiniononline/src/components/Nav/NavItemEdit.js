import { NavLink } from "react-router-dom";

import { FaRegQuestionCircle, FaCommentAlt, FaRegChartBar } from "react-icons/fa"

function NavItemEdit({ className, item }) {

    const iconsList = [
        { name: 'Edit', icon: FaRegQuestionCircle },
        { name: 'Answers', icon: FaCommentAlt },
        { name: 'Feedback', icon: FaRegChartBar }
    ];

    const renderIcon = (icon, item) => {
        if (icon.name === item.name) {
            const Icon = icon.icon;

            return (
                <div key={icon} className="flex gap-3">
                    <Icon/>
                </div>
            );
        }

    };


    return (

        <NavLink
            to={item.link}
            className={className}
        >
            {iconsList.map((icon) => renderIcon(icon, item))}
        </NavLink>
    );
}

export default NavItemEdit;
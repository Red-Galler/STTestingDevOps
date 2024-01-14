import { NavLink } from "react-router-dom";

function NavItemSimple({item, className}) {
    return (
        <NavLink
            to={item.link}
            className={className}
        >
            {item.name}
        </NavLink>
    )
}

export default NavItemSimple;
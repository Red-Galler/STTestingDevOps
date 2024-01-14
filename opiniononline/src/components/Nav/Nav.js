import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavItemSimple from "./NavItemSimple";
import NavItemEdit from "./NavItemEdit";

import { supabase } from "../../supabaseClient"



function Nav({ className, menuItems }) {
   

    const [activeLink, setActiveLink] = useState(null);


    // geeft een object terug die informatie heeft over de huidige actieve link
    const location = useLocation();

    // Iedere keer wanneer de url verandert wordt deze useEffect uitgevoerd. Deze zet dan activeLink gelijk aan de actieve pathname
    useEffect(() => {
        setActiveLink(location.pathname);

    }, [location]);


    const isIndexRoute = activeLink === ('/' || '/Edit');


    return (
        <div>
            <ul className={`${className}`}>
                {menuItems.map((item) => (

                    <li key={item.name}>
                        {
                            menuItems[0].link.includes('/Editor') ?
                                <div>
                                    <NavItemEdit item={item} className={`hidden lg:block text-gray-darker text-2xl p-6 border-b dark:border-dark-border dark:text-dark-text dark:hover:bg-primary ${(activeLink === item.link || (isIndexRoute && item.link === "/Editor")) ? 'bg-primary text-white' : ''}`} />

                                    <NavItemSimple item={item} className={`block lg:hidden text-start text-l p-6 border-b dark:border-dark-border dark:text-dark-text dark:hover:bg-primary ${(activeLink === item.link || (isIndexRoute && item.link === "/Editor")) ? 'bg-primary text-white' : ''}`} />
                                </div>

                                :

                                <NavItemSimple item={item} className={`block text-start text-l p-6 border-b dark:border-dark-border dark:text-dark-text dark:hover:bg-primary ${(activeLink === item.link) || (isIndexRoute && item.name === 'Projecten') ? 'bg-primary text-white' : ''}`} />
                        }



                    </li>
                ))}
                
            </ul>

        </div>

    );
}

export default Nav;

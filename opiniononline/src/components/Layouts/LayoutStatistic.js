import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav.js";

function LayoutCreate() {
    let menuItems = [
        { name: 'Statistic', link: '/Statistics' },
        { name: 'Vraag', link: '/Statistics/Answers' },
        { name: 'Individueel', link: '/Statistics/Individueel' },
    ]
    return (

        <div className="flex">
            <div className="h-[calc(100vh-5rem)] overflow-y-auto sticky top-20 hidden md:block w-50 border border-t-0 ">
                <Nav className="" menuItems={menuItems} />
            </div>
            <main className="flex-1 ">
                <Outlet/>
            </main>
        </div>

    );
}

export default LayoutCreate;
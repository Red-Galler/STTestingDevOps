import { Fragment, useState } from "react";
import { FaBars } from "react-icons/fa";

import {
    Drawer,
    Button,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import Nav from "./Nav/Nav.js";



function DrawerMenu({ menuItems, className }) {
    const [open, setOpen] = useState(false);

    const openDrawer = () => setOpen(true);

    const closeDrawer = () => setOpen(false);

    return (
        <div className={className}>
            <FaBars className="text-3xl text-gray-500 z-100 ms-4" onClick={openDrawer}/>

            <Drawer open={open} onClose={closeDrawer} className="p-4">
                <div className="">
                    <Nav className="" menuItems={menuItems} />
                </div>

            </Drawer>
        </div>
    );
}



export default DrawerMenu;
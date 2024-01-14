import React from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { FaPalette } from "react-icons/fa";
import {default as CustomIconButton} from "../IconButton"
import EditFont from "./EditFont";
import ProjectStyles from "./ProjectStyles";

function ProjectStylesDrawer({className}) {
    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <div className={`${className}`}>
            <CustomIconButton onClick={openDrawer} icon={FaPalette} message={"Stijl aanpassen"} placement="bottom"></CustomIconButton>
            <Drawer open={open} onClose={closeDrawer} className="p-4" placement="right" size={500}>
                <ProjectStyles  className={'text-xl'}/>
            </Drawer>
        </div>
    );
}


export default ProjectStylesDrawer;
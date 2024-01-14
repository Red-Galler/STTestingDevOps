import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import IconButton from "../IconButton";
import { FaPalette } from "react-icons/fa";
import EditFont from "./EditFont";
import ProjectStyles from "./ProjectStyles";

function ProjectStylesDialog({className}) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <div className={className}>
            <IconButton onClick={handleOpen} icon={FaPalette} message={"Stijl aanpassen"} placement="bottom"></IconButton>
            <Dialog open={open} handler={handleOpen} size="xxl">
                <DialogBody>
                    <ProjectStyles/>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleOpen} size="lg" className="bg-primary">Sluiten</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}


export default ProjectStylesDialog;

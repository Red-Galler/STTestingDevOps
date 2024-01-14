import { Fragment, useState } from "react";
import { FaBars } from "react-icons/fa";

import {
    Drawer, IconButton, Typography,
} from "@material-tailwind/react";



function DetailsDrawer({ survey, open, onClose }) {


    return (
        <div className={''}>

            <Drawer size={450} placement="right" open={open} onClose={onClose} className="p-10 !h-[calc(100vh-5rem)] top-20">

                <div className="flex items-center justify-between">

                    <Typography variant="h5" color="blue-gray">
                        {survey.title}
                    </Typography>

                    <IconButton variant="text" color="blue-gray" onClick={onClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>


            </Drawer>
        </div>
    );
}



export default DetailsDrawer;
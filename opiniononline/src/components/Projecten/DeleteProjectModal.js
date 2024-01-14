import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";

import { CiWarning } from "react-icons/ci";
import { supabase } from "../../supabaseClient";
import { useDispatch } from "react-redux";
import { deleteSurvey, setIsLoadingFalse, setIsLoadingTrue } from "../../slices/surveySlice";

function DeleteProjectModal({ surveyToDelete, open, onClose }) {
    const [canDelete, setCanDelete] = useState(false);
    const dispatch = useDispatch();

    async function DeleteProject() {
        try {
            dispatch(setIsLoadingTrue());

            const { error } = await supabase
                .from('Surveys2')
                .delete()
                .eq('id', surveyToDelete.id);

            if (error) throw error;

            dispatch(deleteSurvey(surveyToDelete.id));
            onClose();
            dispatch(setIsLoadingFalse());

        } catch (error) {
            dispatch(setIsLoadingFalse());
            console.log(error);
        }
    }

    return (
        <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-800">
            <DialogHeader className="font-semibold text-lg dark:text-white">Deze enquête verwijderen</DialogHeader>
            <DialogBody className="dark:bg-gray-800 dark:text-white">
                <div className="flex items-center gap-4 p-5 bg-red-100 border border-red-200 text-red-600 rounded-lg dark:bg-red-200 dark:border-red-300 dark:text-red-700">
                    <CiWarning className="text-4xl" />
                    <p className="text-lg">U kunt deze enquête niet meer herstellen nadat deze is verwijderd!</p>
                </div>
                <div className="mt-5">
                    <p className="text-lg mb-3 dark:text-white">Voer <span className="font-semibold">{surveyToDelete.title}</span> in om te bevestigen</p>
                    <Input size="lg" color="red" className="!text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => setCanDelete(e.target.value === surveyToDelete.title)} />
                </div>
            </DialogBody>
            <DialogFooter className="dark:bg-gray-800">
                <Button
                    variant="filled"
                    color="red"
                    className="w-full mt-5 dark:text-white"
                    disabled={!canDelete}
                    onClick={DeleteProject}
                >
                    Verwijder {surveyToDelete.title}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

export default DeleteProjectModal;

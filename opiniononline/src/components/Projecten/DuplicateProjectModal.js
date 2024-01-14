import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

function DuplicateProjectModal({ surveyToCopy, open, onClose }) {
    let [title, setTitle] = useState(`Kopie van ${surveyToCopy.title}`);
    const navigate = useNavigate();

    useEffect(() => {
        setTitle(`Kopie van ${surveyToCopy.title}`)
    }, [surveyToCopy])

    async function CopyFileSupabase(from, fileNameToCopy, fileNameDestination) {
        try {
            const { data, error } = await supabase
                .storage
                .from(from)
                .copy(fileNameToCopy, fileNameDestination);
        } catch (error) {
            console.log(error);
        }
    }

    async function CopySurvey() {
        try {
            const { data, error } = await supabase.rpc('copy_survey', {
                original_survey_id: surveyToCopy.id,
                new_title: title
            });

            if (error) throw error;

            if (data[0]) {
                CopyFileSupabase('survey_logos', `survey_${surveyToCopy.id}`, `survey_${data[0].id}`);
                CopyFileSupabase('survey_backgrounds', `survey_background_${surveyToCopy.id}`, `survey_background_${data[0].id}`);
            }

            navigate(`/Editor/${data[0].id}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Dialog open={open} handler={onClose} size="sm" className="dark:bg-dark-default">
                <DialogHeader className="font-semibold text-lg dark:text-dark-text">Geef de enquête een naam</DialogHeader>
                <DialogBody className="dark:bg-dark-secondary dark:text-dark-text">
                    <p className="text-lg mb-4">Voer een naam in voor deze enquête</p>
                    <Input
                        color="lightBlue"
                        size="lg"
                        className="w-full dark:bg-dark-third dark:border-dark-border dark:text-dark-text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </DialogBody>
                <DialogFooter className="dark:bg-dark-secondary">
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={onClose}
                        className="mr-1 dark:border-dark-border dark:text-dark-text"
                    >
                        Annuleren
                    </Button>
                    <Button
                        variant="filled"
                        color="green"
                        onClick={CopySurvey}
                        className="dark:bg-primary dark:text-white"
                    >
                        OK
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default DuplicateProjectModal;

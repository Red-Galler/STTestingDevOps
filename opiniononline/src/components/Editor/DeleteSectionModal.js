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
import { useDispatch, useSelector } from "react-redux";
import { deleteSection } from "../../slices/surveySlice";

function DeleteSectionModal({ sectionToDelete, open, onClose }) {

    const dispatch = useDispatch();

    const [isDeleting, setIsDeleting] = useState(false); // Add state to track saving status


    const survey = useSelector(state => state.surveys.survey)



    async function DeleteSection() {
        if (isDeleting) {
            return
        }

        setIsDeleting(true);

        try {

            const { errorDelete } = await supabase.from('Sections2').delete().eq('id', sectionToDelete.id)

            if (errorDelete) throw errorDelete

            // Runs a stored procedure that is store in Supabase. with rpc we can access the function.
            // The function subtracts 1 from the answerOrderNrs if it is greater then 'deleted_ordernr'
            // If the 'deleted_ordernr' is 1, it subtracts 1 from all the answers
            let { errorUpdate } = await supabase
                .rpc('subtract_section_order_nr', {
                    deleted_ordernr: sectionToDelete.sectionOrder,
                    survey_id: sectionToDelete.surveyId
                })


            if (errorUpdate) throw errorUpdate


            let instance = new Worker('/workers/FetchSurvey.js');

            const workerPromise = new Promise((resolve, reject) => {
                instance.onmessage = ({ data }) => {
                    console.log(data.data);
                    resolve(data.data); // Resolve the promise with the data received from the worker
                };
                instance.onerror = (error) => {
                    console.error('Worker error:', error);
                    reject(error); // Reject the promise in case of an error
                };
            });

            // Post message to worker
            instance.postMessage({ action: 'DELETESECTION', sections: survey.Sections2, deletedSection: sectionToDelete });

            const workerResponse = await workerPromise;


            console.log(workerResponse)

            dispatch(deleteSection(workerResponse))



            setIsDeleting(false);


        }
        catch (error) {
            setIsDeleting(true);
            console.log(error)
        }

    }




    return (
        <>

                    <Dialog open={open} handler={onClose} size="sm">
            <DialogHeader className="font-semibold text-lg bg-gray-100 p-4 rounded-t-lg">
                Vragen en sectie verwijderen?
            </DialogHeader>
            <DialogBody className="text-lg p-4">
                <p>Als je een sectie verwijdert, worden ook de vragen en antwoorden verwijderd die erin staan.</p>
            </DialogBody>
            <DialogFooter className="flex justify-end p-4">
                <Button variant="outlined" color="gray" onClick={onClose} className="mr-2">
                    Annuleren
                </Button>
                <Button variant="filled" color="red" onClick={DeleteSection}>
                    OK
                </Button>
            </DialogFooter>
        </Dialog>

        </>
    );
}


export default DeleteSectionModal;
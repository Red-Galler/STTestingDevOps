import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

function ChangePassWordModal({ open, onClose }) {

    const [currentPassword, setCurrentPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);

    const [canChange, setCanChange] = useState(false)

    const [error, setError] = useState(null)


    async function UpdatePassword() {

        if (!IsStrongPassword(newPassword)) {
            setError('Gelieve een sterkere wachtwoord te kiezen')
            return
        }

        try {

            const { data, error } = await supabase.rpc('change_user_password', {
                current_plain_password: currentPassword,
                new_plain_password: newPassword
            })


            if (error) throw error


            if(data.data){
                CloseModal();
            }
        }

        catch (error) {
            setError(error.message)
            console.log(error)
        }



    }


    function CloseModal(){
        setError(false)
        onClose();
    }



    function IsStrongPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }


    return (
        <Dialog open={open} handler={CloseModal} size="sm">
            <DialogHeader className="font-semibold text-lg bg-gray-100 dark:bg-dark-default dark:text-dark-text p-4 rounded-t-lg">
                Uw wachtwoord wijzigen
            </DialogHeader>
            <DialogBody className="text-lg p-4 dark:bg-dark-secondary dark:text-dark-text">
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2" htmlFor="huidigWachtwoord">
                        Huidig wachtwoord
                    </label>
                    <Input onChange={(e) => setCurrentPassword(e.target.value)} size="lg" color="lightBlue" id="huidigWachtwoord" type="password" outline={true} />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium  mb-2" htmlFor="nieuwWachtwoord">
                        Nieuw wachtwoord
                    </label>
                    <Input onChange={(e) => setNewPassword(e.target.value)} size="lg" color="lightBlue" id="nieuwWachtwoord" type="password" outline={true} />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2" htmlFor="nieuwWachtwoordBevestiging">
                        Nieuw wachtwoord bevestigen
                    </label>
                    <Input onChange={(e) => setCanChange(e.target.value === newPassword)} size="lg" color="lightBlue" id="nieuwWachtwoordBevestiging" type="password" outline={true} />
                </div>


                <p className="mt-4 text-red-400">{error}</p>

            </DialogBody>
            <DialogFooter className="block p-4 dark:bg-dark-secondary">
                <div className="flex justify-end text-end">

                    <Button  variant="outlined" color="gray" onClick={CloseModal} className="mr-2 dark:border-dark-border dark:text-dark-text">
                        Annuleren
                    </Button>
                    <Button disabled={!canChange} variant="filled" color="green" onClick={UpdatePassword}>
                        Wachtwoord wijzigen
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}

export default ChangePassWordModal;

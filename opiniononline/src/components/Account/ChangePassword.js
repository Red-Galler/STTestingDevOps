import { Button } from "@material-tailwind/react";
import { useState } from "react";
import ChangePassWordModal from "./ChangePasswordModal";

function ChangePassword({ className }) {
    const [isChangePasswordModalOpen, setisChangePasswordModalOpen] = useState(false);


    

    return (
        <div className={`${className} bg-white rounded-lg shadow-sm overflow-hidden`}>
            <div className="border-b px-7 py-4 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border">
                <p className="text-xl font-medium text-gray-700 dark:text-dark-text">Wachtwoord</p>
            </div>
            <div className="px-7 py-4 flex justify-center">
                <Button ripple="light" className="text-white dark:text-dark-text bg-primary py-3 px-6 rounded-md" onClick={() => setisChangePasswordModalOpen(true)}>
                    Wachtwoord wijzigen
                </Button>
            </div>



            <ChangePassWordModal open={isChangePasswordModalOpen} onClose={() => setisChangePasswordModalOpen(false)}/>
        </div>
    );
}

export default ChangePassword;

import React, { useState } from 'react';
import { Dialog, DialogBody, DialogFooter, DialogHeader, Input, Button, Tooltip, Switch } from "@material-tailwind/react";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy, FaCheck, FaEnvelope } from 'react-icons/fa';


function ShareModal({ open, onClose, survey, onMakePublic }) {
    const [copySuccess, setCopySuccess] = useState('');
    const baseUrl = 'localhost:3000/preview/';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${baseUrl}${survey.id}`).then(() => {
            setCopySuccess('Link is gekopieerd!');
            setTimeout(() => setCopySuccess(''), 3000);
        }, () => {
            setCopySuccess('Failed to copy!');
        });
    };

    const IconWithTooltip = ({ icon, message, onClick }) => (
        <Tooltip content={message} placement="bottom">
            <button onClick={onClick} className="text-2xl p-2 text-gray-600 hover:text-gray-800 dark:text-dark-default dark:hover:text-dark-text transition-colors duration-200">
                {icon}
            </button>
        </Tooltip>
    );

    // Email sharing link
    const emailSubject = encodeURIComponent('Doe mee aan mijn enquête!');
    const emailBody = encodeURIComponent(`Vul deze enquête in: ${`${baseUrl}${survey.id}`}`);
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;

    return (
        <Dialog open={open} handler={onClose} size="sm" className="dark:bg-dark-default">
            <DialogHeader className="font-semibold text-lg dark:text-dark-text">Deel je enquête</DialogHeader>
            <DialogBody className="dark:bg-dark-secondary dark:text-dark-text">

                <Switch className="h-full w-full" label={'Mag uitgevoerd worden'}
                    color="green"
                    labelProps={{
                        className: "text-xl dark:text-white",
                    }}
                    containerProps={{
                        className: 'w-11 h-6',
                    }}
                    circleProps={{
                        className: 'before:hidden left-0.5 border-none',
                    }}
                    checked={survey.isPublic}
                    onChange={(e) => onMakePublic(e.target.checked)}
                />
                <div className={`${!survey.isPublic ? 'opacity-50 pointer-events-none' : ''}`} >
                    <p className="mb-4 mt-3">Kopieer deze link en deel hem met anderen om de enquête in te vullen:</p>
                    <Input 
                        placeholder={survey.isPublic ? `${baseUrl}${survey.id}` : ''} 
                        type="text" 
                        readOnly 
                        className="mb-2 dark:bg-dark-third dark:border-dark-border dark:text-dark-text"
                    />
                    {copySuccess && <div className="text-green-500 mt-2 dark:text-green-400">{copySuccess}</div>}
                    <div className="flex justify-start gap-4 mt-4">
                        <IconWithTooltip icon={copySuccess ? <FaCheck className='dark:text-dark-text' /> : <FaCopy />} message={copySuccess ? "Copied" : "Copy Link"} onClick={copyToClipboard} />
                        {/* Email sharing icon */}
                        <IconWithTooltip icon={<FaEnvelope />} message="Share via Email" onClick={() => window.location.href = mailtoLink} />
                    </div>
                </div>

            </DialogBody>
            <DialogFooter className="dark:bg-dark-secondary">
                <Button color="red" onClick={onClose} ripple="dark" className="dark:text-white">Sluiten</Button>
            </DialogFooter>
        </Dialog>
    );
}

export default ShareModal;

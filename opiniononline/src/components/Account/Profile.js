import React, { useEffect, useRef, useState } from "react";
import ProfilePictureChangeHandler from "./ProfilePictureChangeHandler";
import { supabase } from "../../supabaseClient";
import { Avatar, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

function Profile({ className, user }) {

    const [updatedUser, setUpdatedUser] = useState(user);
    const imageUrl = useSelector(state => state.surveys.profilePictureLoggedInUser);

    async function UpdateUser(user) {
        try {
            const { error } = await supabase.from('Users2').update(user).eq('id', user.id)
            if (error) throw error
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setUpdatedUser(user)
    }, [user])

    return (
        <div className={`${className} bg-white rounded-lg shadow-sm overflow-hidden`}>
            <div className="border-b px-7 py-4 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border">
                <p className="text-xl font-medium text-gray-700 dark:text-dark-text">Profiel</p>
            </div>
            <div className="px-7 py-5">
                <form className="md:flex items-center justify-between">
                    <div className="flex justify-center mb-6 md:mb-0">
                        <div>
                            <div className="flex justify-center mb-4">
                                <Avatar
                                    variant="circular"
                                    size='xxl'
                                    alt="avatar"
                                    className="cursor-pointer"
                                    src={imageUrl ? imageUrl : '/default-avatar.png'}
                                />
                            </div>
                            <ProfilePictureChangeHandler currentUser={user} />
                        </div>
                    </div>
                    <div className="md:w-9/12">
                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700 dark:text-dark-text mb-2" htmlFor="voornaam">
                                Voornaam
                            </label>
                            <input value={updatedUser?.first_name} onChange={(e) => setUpdatedUser(prev => ({ ...prev, first_name: e.target.value }))}
                                   className="text-lg shadow-sm border rounded w-full py-2 px-3 leading-tight dark:bg-dark-third dark:text-dark-text dark:border-dark-border dark:focus:outline-none" id="voornaam" type="text" />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 dark:text-dark-text mb-2" htmlFor="familienaam">
                                Familienaam
                            </label>
                            <input value={updatedUser?.last_name} onChange={(e) => setUpdatedUser(prev => ({ ...prev, last_name: e.target.value }))}
                                   className="text-lg shadow-sm border rounded w-full py-2 px-3 leading-tight dark:bg-dark-third dark:text-dark-text dark:border-dark-border dark:focus:outline-none" id="familienaam" type="text" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => UpdateUser(updatedUser)} className="bg-primary mt-6 dark:bg-dark-primary">Opslaan</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;

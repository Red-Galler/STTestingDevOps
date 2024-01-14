import React, { useContext, useState } from "react";
import { supabase } from '../../supabaseClient';
import { userContext } from "../../App";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "../../slices/surveySlice";

function ProfilePicture({ currentUser }) {
    const [loading, setLoading] = useState(false);

    const userId = useContext(userContext).id; // Get the user UID using the hook

    const dispatch = useDispatch();


    async function HandleImageUpdate(e) {
        let file = e.target.files[0];
        let filename = `profile_${userId}`





        // Check if a file is selected
        if (!file) return;

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }



        UploadImage(filename, file)

    }



    async function UploadImage(filename, file) {

        try {
            const { data, error } = await supabase
                .storage
                .from('user_profile_pictures')
                .upload(filename, file, {
                    cacheControl: '0',
                    upsert: true
                })


            if (error) throw error




            let publicUrl = await FetchPicture(filename)

            console.log(publicUrl)


            dispatch(updateProfilePicture(`${publicUrl}?cb=${new Date().getTime()}`));



        }

        catch (error) {
            console.log(error)
        }



    }


    async function FetchPicture(filename) {
        try {
            const { data, error } = supabase
                .storage
                .from('user_profile_pictures')
                .getPublicUrl(filename);

            if (error) throw error

            return data.publicUrl

        }
        catch (error) {
            console.log(error)
        }


    }












    return (
        <div className="text-center mt-4">
            <input type="file" onChange={HandleImageUpdate} className="hidden" id="fileUpload" />
            {loading ? (
                <div className="py-2 text-blue-500">Laden...</div>
            ) : (
                <button onClick={(e) => { e.preventDefault(); document.getElementById("fileUpload").click(); }}
                    className="cursor-pointer rounded-lg bg-primary text-white font-semibold py-2 px-4 duration-200 
                                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    disabled={loading}
                >
                    Wijzig Profielfoto
                </button>
            )}
        </div>
    );
}

export default ProfilePicture;

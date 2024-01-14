import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
} from "@material-tailwind/react";

import { useDispatch, useSelector } from "react-redux";

import { FaArrowRightToBracket, FaCircleUser, FaImage } from "react-icons/fa6";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture } from "../../slices/surveySlice";
import { useContext } from "react";
import { userContext } from "../../App";


function ProfileMenu() {
    const imageUrl = useSelector(state => state.surveys.profilePictureLoggedInUser);


    const navigate = useNavigate();

    

    const user = useContext(userContext); // Get the user UID using the hook


    const dispatch = useDispatch();


    async function HandleImageUpdate(e) {

        
        let file = e.target.files[0];
        let filename = `profile_${user.id}`





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


    async function LogOut() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error

            localStorage.removeItem('redirectTo')

            navigate('/Login')
        } catch (error) {
            console.log(error);
        }
    }


    return (

        <Menu>

            <MenuHandler>
                <Avatar
                    variant="circular"
                    size='lg'
                    alt="avatar"
                    className="cursor-pointer"
                    src={imageUrl ? imageUrl : '/default-avatar.png'}
                />
            </MenuHandler>
            <MenuList className="dark:bg-dark-secondary dark:text-dark-text dark:border-dark-border">
                <MenuItem onClick={() => navigate('/Account')} className="flex items-center gap-2">

                    <FaCircleUser className="text-lg" />
                    <Typography variant="small" className="font-medium">
                        Mijn account
                    </Typography>
                </MenuItem>
                <MenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.getElementById("fileUploadHeader").click(); }} className="flex items-center gap-2">

                    <FaImage className="text-lg" />
                    <Typography variant="small" className="font-medium">
                        Foto bijwerken
                    </Typography>



                </MenuItem>

                <hr className="my-2 border-blue-gray-50" />
                <MenuItem onClick={LogOut} className="flex items-center gap-2 ">
                    <FaArrowRightToBracket className="text-lg" />
                    <Typography variant="small" className="font-medium">
                        Uitloggen
                    </Typography>
                </MenuItem>
            </MenuList>

            <input className="hidden" type="file" onChange={HandleImageUpdate} id="fileUploadHeader" />

        </Menu>
    );
}

export default ProfileMenu;
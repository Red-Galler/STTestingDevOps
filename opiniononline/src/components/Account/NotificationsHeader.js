import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    IconButton,
    Avatar,
    Typography,
} from "@material-tailwind/react";
import { FaBell } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import Notification from "./Notification";
import NotificationsHeaderItem from "./NotificationsHeaderItem";


function NotificationsMenuHeader() {

    const user = useContext(userContext); // Get the user UID using the hook


    const [notifications, setNotifications] = useState([]);

    async function GetNotifications() {
        try {
            console.log(user.id)
            const { data, error } = await supabase.from('Notifications2').select('*, Users2!Notifications2_surveyTaker_fkey(*), Surveys2(*)').eq('ownerId', user.id)

            if (error) throw error

            if (data) {
                console.log(data)
                setNotifications(data)
            }
        }

        catch (error) {
            console.log(error)
        }


    }



    useEffect(() => {
        GetNotifications();
    }, [])



    async function onDelete(notificationId){
        
        try {
            const {error} = await supabase.from('Notifications2').delete().eq('id', notificationId)

            if(error) throw error

            setNotifications(prev => prev.filter((notification) => notification.id !== notificationId))

        }
        catch(error){
            console.log(error)
        }
        

    }
    return (
        <Menu>
            <MenuHandler>
                <IconButton variant="text">
                    <FaBell className="text-gray-500 text-3xl" />
                </IconButton>
            </MenuHandler>

            <Notification/>

            <MenuList className="flex flex-col gap-2">
                {
                    notifications.length > 0 ? 
                    notifications.map((notification) => {
                        return (

                            <NotificationsHeaderItem notification={notification} onDelete={()=> onDelete(notification.id)}/>
                        )
                    })

                    :

                    <MenuItem>Nog geen meldingen</MenuItem>
                }
            </MenuList>
        </Menu>
    );
}

export default NotificationsMenuHeader;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { supabase } from "./supabaseClient";
import { useContext } from "react";
import { userContext } from "./App";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtAo3HeCa5aWyHNp94TFem4dT66LEdkjY",
    authDomain: "opineonline-409807.firebaseapp.com",
    projectId: "opineonline-409807",
    storageBucket: "opineonline-409807.appspot.com",
    messagingSenderId: "2388936452",
    appId: "1:2388936452:web:c24b84bb39733fc7fa7251"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);



async function InsertTokenInDb(userId, token) {
    try {
        console.log(userId)
        const { error } = await supabase.from('Users2').update({fcm_token: token}).eq('id', userId)

        console.log(error)
        if (error) throw error;


    }
    catch (error) {
        console.log(error)
    }

}

export const requestPermission = async (userId) => {

    console.log("Requesting User Permission......");


    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification User Permission Granted.");

            const currentToken = await getToken(messaging, { vapidKey: `BJmNAe8ViSfbZZYbKx4fsNlVc0dUUrQ9klurIp5mYvgYRt7z9pdJstAUt3pEVTR1BZ1iMqRGxEaZkWyJQivMZsY` });
            if (currentToken) {
                await InsertTokenInDb(userId, currentToken);
                console.log('Client Token: ', currentToken);
            } else {
                console.log('Failed to generate the app registration token.');
            }
        } else {
            console.log("User Permission Denied.");
        }
    } catch (err) {
        console.log('An error occurred when requesting to receive the token.', err);
    }
};


requestPermission();


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
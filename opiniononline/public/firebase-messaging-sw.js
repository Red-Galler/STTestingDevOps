importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

 //the Firebase config object 
 const firebaseConfig = {
    apiKey: "AIzaSyBtAo3HeCa5aWyHNp94TFem4dT66LEdkjY",
    authDomain: "opineonline-409807.firebaseapp.com",
    projectId: "opineonline-409807",
    storageBucket: "opineonline-409807.appspot.com",
    messagingSenderId: "2388936452",
    appId: "1:2388936452:web:c24b84bb39733fc7fa7251"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
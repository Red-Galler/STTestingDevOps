import React, { useState, useEffect, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { requestPermission, onMessageListener } from '../../firebase';
import { userContext } from '../../App';

function Notification() {
    const user = useContext(userContext);

  const [notification, setNotification] = useState({ title: '', body: '' });
  useEffect(() => {
    
    requestPermission(user?.id);
    const unsubscribe = onMessageListener().then((payload) => {

      if(payload.data.ownerId !== user.id) return

      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
      const toastId = toast.success(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
        duration: 60000, 
        position: 'top-right',
      });


            // If you want to dismiss the toast after some time or conditionally:
            setTimeout(() => {
              toast.dismiss(toastId);
            }, 10000); // Dismiss after 10 seconds, for example
      
});
    return () => {
      unsubscribe.catch((err) => console.log('failed: ', err));
    };
  }, []);
  return (
    <div>
      <Toaster />
    </div>
  );
}
export default Notification;
import { useContext, useEffect, useState } from "react";

import { userContext } from '../App';
import AccountInformation from "../components/Account/AccountInformation";
import Profile from "../components/Account/Profile";
import ChangePassword from "../components/Account/ChangePassword";
import ChangeTheme from "../components/Account/ChangeTheme";
import ChangeNotifications from "../components/Account/ChangeNotifications";
import { supabase } from "../supabaseClient";

function Account() {
  const user = useContext(userContext);

  const [canChangePassword, setCanChangePassword] = useState(user.identities.some(identity => identity.provider === 'google'));
  const [publicUser, setPublicUser] = useState();

  async function GetUser() {
    try {
      const { data, error } = await supabase.from('Users2').select('*').eq('id', user.id).single();

      if (error) throw error;

      if (data) {
        setPublicUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetUser();
  }, []);

  return (
    <div className='p-6 bg-gray-light dark:bg-dark-default'>
      <AccountInformation user={publicUser} className='border xl:w-8/12 rounded-lg mt-10 bg-white dark:bg-dark-secondary dark:border-dark-border' />
      <Profile user={publicUser} className='border xl:w-8/12 rounded-lg mt-10 bg-white dark:bg-dark-secondary dark:border-dark-border' />
      {!canChangePassword && <ChangePassword className='border xl:w-8/12 rounded-lg mt-10 bg-white dark:bg-dark-secondary dark:border-dark-border' />}
      <ChangeTheme className='border xl:w-8/12 rounded-lg mt-10 bg-white dark:bg-dark-secondary dark:border-dark-border' />
      <ChangeNotifications className='border xl:w-8/12 rounded-lg mt-10 bg-white dark:bg-dark-secondary dark:border-dark-border' />
    </div>
  );
}

export default Account;

import React, { useEffect, useState, createContext, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './pages/Login';
import Edit from './pages/Edit';
import Projecten from './pages/Projecten';
import Testen from './pages/Testen';
import Statistics from './pages/Statistics';
import Account from './pages/Account';
import Answers from './pages/Answers';
import LayoutDashboard from './components/Layouts/LayoutDashboard';
import LayoutEdit from './components/Layouts/LayoutEditor';
import LayoutStatistic from './components/Layouts/LayoutStatistic';
import { supabase } from './supabaseClient';
import Preview from './pages/Preview';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPassword from './pages/ResetPassword';
import LayoutDefault from './components/Layouts/LayoutDefault';
import { useDispatch } from 'react-redux';
import { updateProfilePicture } from './slices/surveySlice';
import RegisterPage from './pages/RegisterPage';
import AfterRegistrationSuccess from './pages/AfterRegistrationSuccess';
import { Spinner } from '@material-tailwind/react';
import NotFoundPage from './pages/NotFoundPage';
import AboutUs from './pages/AboutUs';
import TutorialPage from './pages/TutorialPage';
import Feedback from './pages/Feedback';
import { requestPermission } from './firebase';
import Notification from './components/Account/Notification';


import Survey from './pages/Survey';


export const userContext = createContext();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const dispatch = useDispatch();


  useEffect(() => {

    const theme = localStorage.getItem('theme')

    console.log(theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  async function FetchProfilePicture(filename) {
    try {
      const { data, error } = await supabase
        .storage
        .from('user_profile_pictures')
        .getPublicUrl(filename);

      if (error) throw error;

      const response = await fetch(data.publicUrl);
      if (response.ok) {
        dispatch(updateProfilePicture(`${data.publicUrl}?cb=${new Date().getTime()}`));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await FetchProfilePicture(`profile_${session.user.id}`);
      }
      setLoading(false); // Set loading to false once the session check is done
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await FetchProfilePicture(`profile_${session.user.id}`);

        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // this means we loggen in with Google, the redirect link from google is '/'.
    //if(window.location.pathname === '/') return

    localStorage.setItem('redirectTo', window.location.pathname)

  }, [])



  console.log(session)

  if (loading) {
    // Replace this with your loading spinner or loading component
    return (

      <div className="fixed left-2/12 w-10/12 h-full  flex justify-center items-center z-50 backdrop-blur-sm">
        <Spinner color="green" className="h-32 w-32" />
      </div>


    );
  }






  return (
    <userContext.Provider value={session?.user}>
      <BrowserRouter>
        <div className="App dark:bg-dark-default dark:text-dark-text">
          {session && <Header />}
          <Routes>
            <Route path="/Login" element={
              !session
                ? <Login />
                : <Navigate
                  to={localStorage.getItem('redirectTo') && localStorage.getItem('redirectTo') !== '/Login' ? localStorage.getItem('redirectTo') : '/'}
                />
            } />          <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/Success" element={<AfterRegistrationSuccess />} />

            {session ? (
              <>
                <Route path="/" element={<LayoutDashboard />}>
                  <Route index element={<Projecten />} />
                  <Route path="Projecten" index element={<Projecten />} />
                  <Route path="Account" element={<Account />} />
                  <Route path="Overons" element={<AboutUs />} />
                  <Route path="Tutorial" element={<TutorialPage />} />
                  <Route path='/Testen' index element={<Testen />} />
                </Route>
                <Route path="/Statistics/:id" element={<LayoutStatistic />}>
                  <Route index element={<Statistics />} />
                  <Route path="Overzicht" element={<Statistics />} />
                </Route>
                <Route path="/Editor/:id" element={<LayoutEdit />}>
                  <Route index element={<Edit />} />
                  <Route path="Edit" element={<Edit />} />
                  <Route path="Answers" element={<Statistics />} />
                  <Route path="Feedback" element={<Feedback />} />

                </Route>
                <Route path="/Preview/:id" element={<LayoutDefault />}>
                  <Route index element={<Preview />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/Login" />} />
            )}

            <Route path='/Survey/:id' element={<Survey />} />


          </Routes>
        </div>
      </BrowserRouter >
    </userContext.Provider >
  );
}

export default App;

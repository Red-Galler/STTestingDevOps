import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaTimes } from 'react-icons/fa';

import SearchBox from './SearchBox';
import DrawerMenu from '../DrawerMenu';
import IconButton from '../IconButton';

import ProfilePicture from '../Account/ProfilePicture';
import { supabase } from '../../supabaseClient';

import AccountMenuHeader from "../Account/AccountMenuHeader";
import NotificationsMenuHeader from '../Account/NotificationsHeader';

import LogoSmall from '../../logoSmall.png';

function Header() {
    const [showSearch, setShowSearch] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    let [menuItems, setMenuItems] = useState([]);
    let EditOrDashboard = useRef(null);

    useEffect(() => {
        if (location.pathname.includes('/Editor')) {
            setMenuItems([
                { name: 'Edit', link: '/Editor/Edit' },
                { name: 'Answers', link: '/Editor/Answers' },
                { name: 'Statistics', link: '/Editor/Statistics' },
            ]);

            EditOrDashboard.current = 'Edit';
        } else {
            setMenuItems([
                { name: 'Projecten', link: '/Projecten' },
                { name: 'Account', link: '/Account' },
                { name: 'Tutorial', link: '/Tutorial' },
                { name: 'Over ons', link: '/OverOns' },
            ]);

            EditOrDashboard.current = 'Dashboard';
        }
    }, [location]);

    return (
        <header className="sticky top-0 z-20 flex justify-between items-center w-full border-b bg-secondary dark:bg-dark-default dark:border-dark-border">
            <div
                className={`${EditOrDashboard.current === 'Edit' ? 'w-50' : 'w-2/12'
                    } flex items-center justify-center ${showSearch ? 'hidden sm:flex' : ''} dark:text-dark-text`}
            >
                <DrawerMenu menuItems={menuItems} className={'lg:hidden'} />
                <img
                    onClick={() => navigate('/')}
                    src={LogoSmall}
                    alt="logo"
                    className="w-20 h-full p-2 cursor-pointer"
                ></img>
            </div>

            <FaSearch
                className={`sm:hidden text-3xl mr-6 text-gray-500 ${showSearch ? 'hidden' : ''
                    } dark:text-white`}
                onClick={() => setShowSearch(!showSearch)}
            />

            {showSearch && (
                <div className="sm:hidden w-full flex items-center p-2 dark:bg-dark-default">
                    <IconButton
                        icon={FaTimes}
                        className={'m-2 text-2xl dark:text-dark-text'}
                        onClick={() => setShowSearch(false)}
                    />
                    <SearchBox />
                </div>
            )}

            <div className="hidden sm:flex items-center justify-end flex-1 space-x-5 px-5 p-2 dark:bg-dark-default dark:text-dark-text">
                <SearchBox />
                <NotificationsMenuHeader/>
                <AccountMenuHeader/>
            </div>
        </header>
    );
}

export default Header;

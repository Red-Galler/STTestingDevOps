import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav"
import { Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


function LayoutDashboard() {

    const menuItemsDashboard = [
        { name: 'Projecten', link: '/Projecten' },
        { name: 'Account', link: '/Account' },
        { name: 'Tutorial', link: '/Tutorial' },
        { name: 'Over ons', link: '/Overons' },
    ];


    const isLoading = useSelector(state => state.surveys.isLoading)


    return (
        <div className="">

            <div className="flex ">
                <div className="hidden lg:block w-2/12 border border-t-0 dark:border-dark-border h-[calc(100vh-5rem)] overflow-y-auto sticky top-20">
                    <Nav className="" menuItems={menuItemsDashboard} />
                </div>
                <main className="flex-1 relative">
                    {isLoading &&
                        <div className="fixed left-2/12 w-10/12 h-full  flex justify-center items-center z-50 backdrop-blur-sm">
                            <Spinner color="green" className="h-32 w-32" />
                        </div>}

                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default LayoutDashboard;
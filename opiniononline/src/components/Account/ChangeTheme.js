import { Option, Select } from "@material-tailwind/react";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";

function ChangeTheme({ className }) {

    const [theme, setTheme] = useState();


    useEffect(() => {
        const theme = localStorage.getItem('theme');
        setTheme(theme ? theme : 'light')
    }, [])

    function UpdateTheme(theme) {
        if (theme === "dark") {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add("dark");
        } else {
            localStorage.setItem('theme', 'light')

            document.documentElement.classList.remove("dark");
        }
    }


    return (
        <div className={`${className} bg-white rounded-lg shadow-sm`}>
            <div className="border-b px-7 py-4 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border">
                <p className="text-xl font-medium dark:text-dark-text">Thema</p>
            </div>
            <div className="px-7 py-4">
                <div className="sm:flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 dark:text-dark-text mb-2 sm:mb-0">
                        Interface Thema
                    </label>
                    <div className="w-full md:w-8/12 h-full">
                        <Select labelProps={{
                            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
                        }}
                            value={theme} onChange={(selectedValue) => UpdateTheme(selectedValue)} color="lightBlue" size="lg" className="w-full text-gray-700 dark:text-dark-text"

                        >
                            <Option value="light" color="blueGray">Light</Option>
                            <Option value="dark" color="blueGray">Dark</Option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeTheme;

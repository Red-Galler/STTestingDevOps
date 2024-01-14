import { FaBell, FaSearch, FaTimes } from "react-icons/fa";
import SearchboxMenu from "./SearchBoxMenu"
import { useState } from "react";

function SearchBox() {
    const [inputSearch, setInputSearch] = useState('');

    return (
        <div className="relative w-full">

            <div className="w-full flex justify-center">
                <div className="flex w-full sm:w-11/12 lg:w-6/12">
                    <input
                        onChange={(e) => setInputSearch(e.target.value)}
                        type="text"
                        placeholder="Document zoeken"
                        className="w-full px-4 py-3 rounded-md rounded-r-none border focus:shadow-md  focus:border-dark- dark:border-dark-border focus:outline-none border-gray-300 dark:bg-dark-secondary dark:text-dark-text dark:placeholder-gray-400 transition duration-150 ease-in-out"
                    />

                </div>
            </div>

            <SearchboxMenu searchInput={inputSearch} /> {/* Ensure SearchboxMenu also supports dark mode */}
        </div>
    )
}

export default SearchBox;

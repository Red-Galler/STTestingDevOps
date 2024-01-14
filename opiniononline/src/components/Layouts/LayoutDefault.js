import { Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function LayoutDefault() {

    const isLoading = useSelector(state => state.surveys.isLoading)

    return (
        <div>
            <main className="flex-1 relative">
                {isLoading &&
                    <div className="fixed w-full h-full  flex justify-center items-center z-50 backdrop-blur-sm">
                        <Spinner color="green" className="h-32 w-32" />
                    </div>}

                <Outlet />
            </main>        </div>
    )
}


export default LayoutDefault;
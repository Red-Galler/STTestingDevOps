import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-dark-default text-gray-800 dark:text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl mt-3">Page Not Found</p>
            <p className="mt-2">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="mt-6 text-primary-normal hover:text-primary-dark dark:text-dark-text dark:hover:text-gray-300 px-4 py-2 rounded-md border border-primary-normal hover:border-primary-dark transition duration-300">
                Go Home
            </Link>
        </div>
    );
}


export default NotFoundPage;
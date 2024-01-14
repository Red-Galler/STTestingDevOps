function AccountInformation({ user, className }) {
    return (
        <div className={`${className} bg-white rounded-lg shadow-md overflow-hidden`}>
            <div className="border-b px-7 py-4 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border">
                <p className="text-xl font-medium text-gray-700 dark:text-dark-text">Account Informatie</p>
            </div>
            <div className="px-7 py-5">
                <div>
                    <div className="flex items-center justify-between my-3">
                        <label className="block text-lg font-medium text-gray-700 dark:text-dark-text" htmlFor="email">
                            Email
                        </label>
                        <input disabled value={user?.email} className="text-lg shadow-sm border rounded w-8/12 py-2 px-3 text-gray-700 dark:bg-dark-third dark:text-dark-text dark:border-dark-border leading-tight" id="email" type="text" />
                    </div>

                    <div className="flex items-center justify-between my-3">
                        <label className="block text-lg font-medium text-gray-700 dark:text-dark-text" htmlFor="memberSince">
                            Lid sinds
                        </label>
                        <input disabled value={new Date(user?.member_since).toLocaleDateString()}
                            className="text-lg shadow-sm border rounded w-8/12 py-2 px-3 text-gray-700 dark:bg-dark-third dark:text-dark-text dark:border-dark-border leading-tight" id="memberSince" type="text" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountInformation;

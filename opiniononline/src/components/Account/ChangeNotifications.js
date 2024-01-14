import { Switch } from "@material-tailwind/react";

function ChangeNotifications({ className }) {
    return (
        <div className={`${className} bg-white rounded-lg shadow-sm`}>
            <div className='border-b p-3 px-7 py-4 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border'>
                <p className='text-xl font-semibold dark:text-dark-text'>Email Notificaties</p>
            </div>
            <div className='px-7 py-4'>
                <div className="my-4">
                    <div className='flex items-center justify-between'>
                        <label className='block text-lg font-medium text-gray-700 dark:text-dark-text' htmlFor="newsletter">
                            Nieuwsletter Subscriptie
                        </label>
                        <Switch color="green" className='h-full w-full'
                                containerProps={{
                                    className: 'w-11 h-6',
                                }}
                                circleProps={{
                                    className: 'before:hidden left-0.5 border-none',
                                }}
                            ></Switch>
                    </div>
                    <p className='text-sm text-gray-600 mt-2 dark:text-dark-text'>Ontvang nieuws over onze nieuwste functies.</p>
                </div>

                <div className="my-4">
                    <div className='flex items-center justify-between'>
                        <label className='block text-lg font-medium text-gray-700 dark:text-dark-text' htmlFor="completed">
                            Uitgevoerd
                        </label>
                        <Switch color="green" className='h-full w-full'
                                containerProps={{
                                    className: 'w-11 h-6',
                                }}
                                circleProps={{
                                    className: 'before:hidden left-0.5 border-none',
                                }}
                            ></Switch>
                    </div>
                    <p className='text-sm text-gray-600 mt-2 dark:text-dark-text'>Ontvang een melding wanneer een gebruiker uw enquête heeft ingevuld.</p>
                </div>
            </div>
        </div>
    );
}

export default ChangeNotifications;

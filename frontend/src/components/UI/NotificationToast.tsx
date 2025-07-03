import React from 'react';
import { Transition } from '@headlessui/react';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../hooks/useNotifications';
import type { NotificationType } from '../../types';

const NotificationToast: React.FC = () => {
    const { notifications, removeNotification } = useNotifications();

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-success-400" />;
            case 'error':
                return <XCircleIcon className="h-6 w-6 text-danger-400" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-6 w-6 text-warning-400" />;
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-primary-400" />;
            default:
                return <InformationCircleIcon className="h-6 w-6 text-primary-400" />;
        }
    };

    const getBackgroundColor = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'bg-success-50 border-success-200';
            case 'error':
                return 'bg-danger-50 border-danger-200';
            case 'warning':
                return 'bg-warning-50 border-warning-200';
            case 'info':
                return 'bg-primary-50 border-primary-200';
            default:
                return 'bg-primary-50 border-primary-200';
        }
    };

    const getTextColor = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'text-success-800';
            case 'error':
                return 'text-danger-800';
            case 'warning':
                return 'text-warning-800';
            case 'info':
                return 'text-primary-800';
            default:
                return 'text-primary-800';
        }
    };

    return (
        <div className="fixed bottom-0 right-0 z-50 p-6 pointer-events-none ">
            <div className="flex flex-col space-y-4">
                {notifications.map((notification) => (
                    <Transition
                        key={notification.id}
                        show={true}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className={`w-96 shadow-lg rounded-lg pointer-events-auto border ${getBackgroundColor(
                                notification.type
                            )}`}
                        >
                            <div className="p-5">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="ml-4 w-0 flex-1 pt-0.5">
                                        <p
                                            className={`text-sm font-medium ${getTextColor(notification.type)}`}
                                            style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}
                                        >
                                            {notification.title}
                                        </p>
                                        <p
                                            className={`mt-2 text-sm ${getTextColor(notification.type)} opacity-75`}
                                            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                        >
                                            {notification.message}
                                        </p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            className={`rounded-md inline-flex ${getTextColor(
                                                notification.type
                                            )} hover:${getTextColor(notification.type)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                            onClick={() => removeNotification(notification.id)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                ))}
            </div>
        </div>
    );
};

export default NotificationToast; 
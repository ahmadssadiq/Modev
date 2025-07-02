import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Notification, NotificationType } from '../types';

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
    children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((
        type: NotificationType,
        title: string,
        message: string,
        duration: number = 5000
    ) => {
        const id = Math.random().toString(36).substr(2, 9);

        const notification: Notification = {
            id,
            type,
            title,
            message,
            duration,
        };

        setNotifications(prev => [...prev, notification]);

        // Auto remove notification after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const value: NotificationsContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = (): NotificationsContextType => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};

// Convenience hooks for different notification types
export const useNotify = () => {
    const { addNotification } = useNotifications();

    return {
        success: (title: string, message: string, duration?: number) =>
            addNotification('success', title, message, duration),
        error: (title: string, message: string, duration?: number) =>
            addNotification('error', title, message, duration),
        warning: (title: string, message: string, duration?: number) =>
            addNotification('warning', title, message, duration),
        info: (title: string, message: string, duration?: number) =>
            addNotification('info', title, message, duration),
    };
};

export default useNotifications; 
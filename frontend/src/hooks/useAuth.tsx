import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import apiService from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
    clearError: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Check if user is authenticated on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = apiService.getToken();
            setToken(storedToken);

            if (storedToken && apiService.isAuthenticated()) {
                try {
                    const userData = await apiService.getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    // Token might be invalid, clear it
                    apiService.clearAuth();
                    setToken(null);
                    console.error('Failed to fetch user data:', err);
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            const authResponse = await apiService.login(credentials);

            if (authResponse.access_token) {
                setToken(authResponse.access_token);
                const userData = await apiService.getCurrentUser();
                setUser(userData);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            setLoading(true);
            setError(null);

            await apiService.register(userData);

            // Auto-login after registration
            await login({
                email: userData.email,
                password: userData.password,
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        apiService.clearAuth();
        setUser(null);
        setToken(null);
        setError(null);
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            setError(null);
            const updatedUser = await apiService.updateProfile(userData);
            setUser(updatedUser);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to update profile.';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const isAuthenticated = !!user && apiService.isAuthenticated();

    const value: AuthContextType = {
        user,
        loading,
        error,
        token,
        login,
        register,
        logout,
        updateUser,
        clearError,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC for protecting routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => {
        const { isAuthenticated, loading } = useAuth();

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            window.location.href = '/login';
            return null;
        }

        return <Component {...props} />;
    };
};

export default useAuth; 
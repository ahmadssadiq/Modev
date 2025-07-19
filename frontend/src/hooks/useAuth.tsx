import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import apiService from '../services/api';
import { supabase } from '../lib/supabaseClient';

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
            try {
                // Get current session from Supabase
                const { data: { session }, error } = await supabase.auth.getSession();

                if (session && !error) {
                    setToken(session.access_token);

                    // Get user data from our API
                    try {
                        const userData = await apiService.getCurrentUser();
                        setUser(userData);
                    } catch (apiError) {
                        // If API call fails, create user object from Supabase data
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                            setUser({
                                id: parseInt(user.id),
                                email: user.email || '',
                                full_name: user.user_metadata?.full_name || '',
                                is_active: true,
                                is_verified: !!user.email_confirmed_at,
                                plan: user.user_metadata?.plan || 'free',
                                created_at: user.created_at
                            });
                        }
                    }
                } else {
                    // Clear any stored tokens
                    apiService.clearAuth();
                    setToken(null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                apiService.clearAuth();
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
            if (event === 'SIGNED_IN' && session) {
                setToken(session.access_token);
                // Update user data
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser({
                        id: parseInt(user.id),
                        email: user.email || '',
                        full_name: user.user_metadata?.full_name || '',
                        is_active: true,
                        is_verified: !!user.email_confirmed_at,
                        plan: user.user_metadata?.plan || 'free',
                        created_at: user.created_at
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setToken(null);
                apiService.clearAuth();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            // Use Supabase auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (error) {
                throw new Error(error.message);
            }

            if (data.user && data.session) {
                setToken(data.session.access_token);

                // Get user data from our API
                try {
                    const userData = await apiService.getCurrentUser();
                    setUser(userData);
                } catch (apiError) {
                    // If API call fails, create user object from Supabase data
                    setUser({
                        id: parseInt(data.user.id),
                        email: data.user.email || '',
                        full_name: data.user.user_metadata?.full_name || '',
                        is_active: true,
                        is_verified: !!data.user.email_confirmed_at,
                        plan: data.user.user_metadata?.plan || 'free',
                        created_at: data.user.created_at
                    });
                }
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed. Please try again.';
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

            // Use Supabase auth for registration
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.full_name,
                        plan: 'free'
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            if (data.user && data.session) {
                setToken(data.session.access_token);

                // Create user object from Supabase data
                setUser({
                    id: parseInt(data.user.id),
                    email: data.user.email || '',
                    full_name: data.user.user_metadata?.full_name || '',
                    is_active: true,
                    is_verified: !!data.user.email_confirmed_at,
                    plan: data.user.user_metadata?.plan || 'free',
                    created_at: data.user.created_at
                });
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            apiService.clearAuth();
            setUser(null);
            setToken(null);
            setError(null);
        }
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
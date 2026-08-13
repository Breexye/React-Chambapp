import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/src/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    userId: string | null;
    userRole: string;
    userName: string | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string>('cliente');
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserProfile = async (currentUser: User) => {
        const { data, error } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', currentUser.id)
            .single();

        if (error) {
            console.warn('No se pudo obtener el perfil:', error.message);
        }

        setUserRole(data?.role || 'cliente');
        setUserName(data?.name || currentUser.email?.split('@')[0] || null);
    };

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchUserProfile(currentUser);
            } else {
                setUserRole('cliente');
                setUserName(null);
            }
            setLoading(false);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // ✅ Ahora el login vive aquí, una sola vez, para toda la app
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // No hace falta hacer nada más:
        // onAuthStateChange se dispara solo y actualiza user/userRole/userName
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userId: user?.id || null,
                userRole,
                userName,
                loading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

    export const useAuth = () => useContext(AuthContext);
/**
 * AuthContext in the form of ContextProvider object
 * that will be used across all pages to carry the 
 * JWT token in order to make sure only authenticated
 * users can access restricted pages, but also that
 * they dont have to login in every single page they visit.
 */

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthWrapper({ children }) {
    const [accessToken, setAccessToken] = useState('NULL');
    const [refreshToken, setRefreshToken] = useState('NULL');

    const sharedState = {
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken
    };

    return(
        <AuthContext.Provider value={sharedState}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
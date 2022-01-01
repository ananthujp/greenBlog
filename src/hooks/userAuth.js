import React,{createContext,useContext,useState,useMemo} from 'react';
const AuthContext = createContext({});

export const AuthProvider  = ({children}) => {
    const [user,setUser]=useState(null);
    
    const authUser=(user)=>{
        setUser(user);
    }
    const memoedValue = useMemo(() =>({
        user,
        authUser,
    }),[user])
    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>

);
};

export default function useAuth() {
    return useContext(AuthContext);
}


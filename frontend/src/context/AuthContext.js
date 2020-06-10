import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    });
    //Need to check if user is logged in
    //every time the App is rendered
    useEffect(() => {
        const checkLoggedIn = async () => {
            const url = "http://localhost:5000/api/users/token";
            let token = localStorage.getItem("auth-token");
            //when user is not logged in
            if(token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            //need to validate the token if it exists
            const tokenResponse = await axios.post(url, null, {
                headers: { "x-auth-token": token }
            });
            //if token is valid, collect user data 
            if(tokenResponse.data){
                setUserData({
                    token,
                    user: tokenResponse.data
                })
            }
        }
        checkLoggedIn();                
    }, []);

    return (
        <AuthContext.Provider value={{userData, setUserData}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
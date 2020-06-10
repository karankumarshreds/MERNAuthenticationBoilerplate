import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AuthToggle = () => {
    const history = useHistory();
    //will be used to toggle login/logout
    const { userData, setUserData } = useContext(AuthContext);
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
    }
    const redirect = (e) => {
        //incase of logout
        if(`${e.target.name}` === '/') logout();
        //common for all
        history.push(`${e.target.name}`);
    }
    return (
        <div>
            {
                userData.user ? 
                <button onClick={redirect} name="/">logout</button>
                :
                <><button onClick={redirect}  name="/login">login</button>
                <button onClick={redirect} name="/register">register</button> </> 
            }
        </div>
    )
}

export default AuthToggle;
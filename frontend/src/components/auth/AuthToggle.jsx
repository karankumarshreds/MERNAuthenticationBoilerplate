import React from 'react';
import { useHistory } from 'react-router-dom';


const AuthToggle = () => {
    const history = useHistory();
    const redirect = (e) => {
        history.push(`${e.target.name}`);
    } 
    return (
        <div>
            <button onClick={redirect}  name="/login">login</button>
            <button onClick={redirect} name="/register">register</button>
            <button onClick={redirect} name="/">logout</button>
        </div>
    )
}

export default AuthToggle;
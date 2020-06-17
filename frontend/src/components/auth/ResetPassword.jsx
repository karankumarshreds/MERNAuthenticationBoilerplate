import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ResetPassword = (props) => {
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(null)
    const token = props.token.match.params.id;
    const history = useHistory();
    const submit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/api/users/reset-password/${token}`;
        const data = { password: password};
        try {
            const res = await axios.post(url, data);
            if (res.status === 200){
                history.push("/login");
            }
        } catch (error) {
            setErr(error.response.data.err);
        };
    };
    return (
        <>
        <h1>Password Reset Page</h1>
        <h5>{err}</h5>
        <form onSubmit={submit}>
        <input type="password" required="true" minLength={6} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Change Password</button>
        </form>
        
        </>
    )
}

export default ResetPassword;
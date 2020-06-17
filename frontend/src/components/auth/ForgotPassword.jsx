import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [err, setError] = useState('');
    const submit = async (e) => {
        e.preventDefault();
        setEmail('');
        const url = 'http://localhost:5000/api/users/forgot-password';
        const data = { email: email};
        try {
            const res = await axios.post(url, data);    
            setError('Password reset link sent on your email. Link expires in 10 minutes.');
        } catch (error) {
            setError(error.response.data.err);
        }
    }
    useEffect(() => {
    }, [email])
    return (
        <>  
            {err}
            <form onSubmit={submit}>
                <input type="email" value={email} required="true" onChange={(e) => setEmail(e.target.value)}/>
                <button type="submit">Send password reset link</button>
            </form>
        </>
    )
}

export default ForgotPassword;
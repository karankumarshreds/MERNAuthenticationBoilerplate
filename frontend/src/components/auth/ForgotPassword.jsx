import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [err, setError] = useState('');
    const submit = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:5000/api/users/forgot-password';
        const data = { email: email};
        try {
            const res = await axios.post(url, data);    
            setError(res.data.response);
        } catch (error) {
            setError(error.response.data.err);
        }
    }
    return (
        <>  
            {err}
            <form onSubmit={submit}>
                <input type="email" required="true" onChange={(e) => setEmail(e.target.value)}/>
                <button type="submit">Send password reset link</button>
            </form>
        </>
    )
}

export default ForgotPassword;
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [err, setErr] = useState();

    const { setUserData } = useContext(AuthContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        if(password && email) {
            const url = "http://localhost:5000/api/users/login";
            const loginData = { email, password};
            try {
                const res = await axios.post(url, loginData); 
                setUserData({
                    token: res.data.token,
                    user: res.data.user
                });
                localStorage.setItem("auth-token", res.data.token);
                history.push("/"); 
            } catch (err_) {
                setErr(err_.response.data.err);
            } 
        } else {
            return setErr("Both fields required")
        }
    }

    return (
        <div>
            <h5>{err}</h5>
            <form onSubmit={submit}>
            <input onChange={(e) => setEmail(e.target.value)} name="email" type="email"/>
            <input onChange={(e) => setPassword(e.target.value)} name="password" type="password" />
            <button type="submit">Login</button>
            <Link to="forgot-password">Forgot Password?</Link>
            </form>
        </div>
    )
}

export default Login;
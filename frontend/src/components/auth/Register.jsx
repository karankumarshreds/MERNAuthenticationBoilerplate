import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [err, setErr] = useState();

    const { setUserData } = useContext(AuthContext);
    const history = useHistory();
    const submit = async (e) => {
        e.preventDefault();
        if(password !== password2){
            setErr("Passwords do not match")
        };
        const userData = { name, email, password };
        const url = "http://localhost:5000/api/users/";
        try {
            await axios.post(`${url}signup`, userData);
            const loginData = { email, password } 
            const res =  await axios.post(`${url}login`, loginData);
            setUserData({
                token: res.data.token,
                user: res.data.user
            });
            localStorage.setItem("auth-token", res.data.token);
            history.push("/");
        } catch (err_) {
            setErr(err_.response.data.err);
        };
    };

    return (
        <div>
            <form onSubmit={submit}> 
                <h5>{err}</h5>
                <input onChange={(e) => setName(e.target.value)} 
                  name="name" type="name" placeholder="name" />
                <input onChange={(e) => setEmail(e.target.value)} 
                  name="email" type="email" placeholder="email" />
                <input onChange={(e) => setPassword(e.target.value)}
                  name="password" type="password" placeholder="password" />
                <input onChange={(e) => setPassword2(e.target.value)}
                  name="password2" type="password" placeholder="password" />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;
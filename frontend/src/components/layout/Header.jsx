import React from 'react';
import {Link} from 'react-router-dom';
import AuthToggle from '../auth/AuthToggle';

const Header = () => {
    return (
        <div style={{backgroundColor: "blue"}}>
            Header <Link to="/"><button>home</button></Link>
            <AuthToggle />
        </div>
    )
}

export default Header;
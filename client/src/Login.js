import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import auth from './components/clientAuth.js';
import './Login.css';

function Login() {

    const [loginSuccess, setLoginSuccess] = useState();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function inputChange(e) {
        // reset login success status if user is making a new attempt
        setLoginSuccess(undefined);
        const value = e.target.value;
        const field = e.target.id;

        switch (field) {
            case 'username':
                setUserName(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                console.error('unknown field');
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const res = await auth.login(username, password);
            if (res) {
                console.log('Success! Redirect');
                setLoginSuccess(true);
            } else {
                // set redirect explicitely to false, 
                // to indicate failed login
                setLoginSuccess(false);
            }
        } catch (e) {
            console.log(`in catch: ${e}`);
        }
    }

    return (
        <div>
            <form>
                <input className="mdl-textfield__input" value={username} type="text" placeholder="Username"
                    onChange={inputChange} name="username" id="username" required/>
                <input className="mdl-textfield__input" value={password} type="password" placeholder="Password"
                    onChange={inputChange} name="password" id="password" required/>
                <input type="submit" value="Submit" onClick={onSubmit}/>                       
            </form>
            { loginSuccess === false ? <div className="error">Login failed. Please check username and password</div> : ''}
            <Link to="/register">Register</Link>

            { loginSuccess ? <Redirect to="/data/vasts" /> : ''}
        </div>
    );
}

export default Login;
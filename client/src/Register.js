import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import auth from './components/clientAuth.js';

export default function Register() {

    const [registerSuccess, setRegisterSuccess] = useState();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    function inputChange(e) {
        // reset login success status if user is making a new attempt
        setRegisterSuccess(undefined);
        const value = e.target.value;
        const field = e.target.id;

        switch (field) {
            case 'username':
                setUserName(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'email':
                setEmail(value);
                break;
            default:
                console.error('unknown field');
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const res = await auth.register(email, username, password);
            if (res) {
                console.log('Success! Redirect');
                setRegisterSuccess(true);
            } else {
                // set redirect explicitely to false, 
                // to indicate failed registration
                setRegisterSuccess(false);
                // TODO: Add error message to explain why registration failed (instead of guessing)
            }
        } catch (e) {
            console.log(`in catch: ${e}`);
        }
    }

    return (
        <div>
            <form>
                <input className="mdl-textfield__input" value={email} type="text" placeholder="e-mail"
                    onChange={inputChange} name="email" id="email" required/>
                <input className="mdl-textfield__input" value={username} type="text" placeholder="Username"
                    onChange={inputChange} name="username" id="username" required/>
                <input className="mdl-textfield__input" value={password} type="password" place="Password"
                    onChange={inputChange} name="password" id="password" required/>
                <input type="submit" value="Submit" onClick={onSubmit}/>                       
            </form>
            <Link to="/login" >Login</Link>
            { registerSuccess === false ? <div className="error">Registration failed. Try a different username</div> : ''}
            { registerSuccess ? <Redirect to="/login" /> : ''}
        </div>
    )
}
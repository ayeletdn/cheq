import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Data from './Data.js';
import Login from './Login.js';
import auth from './components/clientAuth.js';
import Register from './Register.js';
import './App.css';

function App() {

    const [loggedIn, setLogin] = useState();

    useEffect(() => {
        async function checkLogin() {
            const login = await auth.isLoggedIn();
            console.log(`checked login: ${login}`);
            setLogin(login);    
        }

        checkLogin();
    }, [loggedIn]);

    return (
        <Router>
            <div className="app">
                {loggedIn === false ? <Redirect to="/login"/> : ""}
                <Switch>
                    <Route path="/data" component={Data} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
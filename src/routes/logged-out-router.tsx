import React from "react";
import {useForm} from "react-hook-form";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Login} from "../pages/login";
import {CreateAccount} from "../pages/create-account";


export const LoggedOutRouter = () => {
    return <Router>
        <Route>
            <Switch>
                <Route path="/create-account">
                    <CreateAccount/>
                </Route>
                <Route path="/">
                    <Login/>
                </Route>
            </Switch>
        </Route>
    </Router>
}
    

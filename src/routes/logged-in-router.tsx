import React from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import {Restaurants} from "../pages/client/restaurants";
import {Header} from "../components/header";
import {useMe} from "../hooks/useMe";
import {NotFound} from "../pages/404";
import {ConfirmEmail} from "../user/confirm-email";
import {EditProfile} from "../user/edit-profile";
import {AllCategories} from "../pages/client/all-categories";
import {Search} from "../pages/client/search";

const ClientRoutes = [
    <Route path="/" key={1} exact>
        <Restaurants/>
    </Route>,
    <Route path="/confirm" key={2} exact>
        <ConfirmEmail/>
    </Route>,
    <Route path="/edit-profile" key={3} exact>
        <EditProfile/>
    </Route>,
    <Route path="/all-categories" key={4} exact>
        <AllCategories/>
    </Route>,
    <Route path="/search" key={4} exact>
        <Search/>
    </Route>,
];

export const LoggedInRouter = () => {
    const {data, loading, error} = useMe();
    if (loading || error || !data) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className={"font-medium text-xl tracking-wide"}>Loading...</span>
            </div>
        );
    }

    return (
        <Router>
            <Header/>
            <Switch>
                {data.me.role === "Client" && ClientRoutes}
                <Route>
                    <NotFound/>
                </Route>
            </Switch>
        </Router>
    );
};

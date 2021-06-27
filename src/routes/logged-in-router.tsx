import React from "react";
import {
    BrowserRouter as Router,
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
import {Category} from "../pages/client/category";
import {Restaurant} from "../pages/client/restaurant";

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
    <Route path="/search" key={5} exact>
        <Search/>
    </Route>,
    <Route path="/category/:slug" key={6} exact>
        <Category/>
    </Route>,
    <Route path="/restaurant/:id" key={7} exact>
        <Restaurant/>
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

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
import {MyRestaurant} from "../pages/owner/my-restaurant";
import {AddRestaurant} from "../pages/owner/add-restaurant";


const clientRoutes = [
    {
        path: "/",
        component: <Restaurants/>
    }, {
        path: "/search",
        component: <Search/>
    }, {
        path: "/category/:slug",
        component: <Category/>
    }, {
        path: "/restaurant/:id",
        component: <Restaurant/>
    }, {
        path: "/all-categories",
        component: <AllCategories/>
    },
]

const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail/>
    }, {
        path: "/edit-profile",
        component: <EditProfile/>
    },
]


const RestaurantRoutes = [
    {
        path: "/",
        component: <MyRestaurant/>
    },
    {
        path: "/add-restaurant",
        component: <AddRestaurant/>
    },
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
                {data.me.role === "Client" && clientRoutes.map(route =>
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>)}
                {data.me.role === "Owner" && RestaurantRoutes.map(route =>
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>)}
                {commonRoutes.map((route) => (
                    <Route key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                ))}
                <Route>
                    <NotFound/>
                </Route>
            </Switch>
        </Router>
    );
};

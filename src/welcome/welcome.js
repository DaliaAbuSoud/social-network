import React from "react";
import Registration from "./register";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Resetpass from "./resetpass";
import Navbar from "../app/navbar";

export default function Welcome() {
    return (
        <div className="welcomeContainer">
            <Navbar />

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpass" component={Resetpass} />
                </div>
            </HashRouter>
        </div>
    );
}

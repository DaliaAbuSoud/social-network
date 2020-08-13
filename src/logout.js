// very similar to register here and in petition
import React from "react";
import axios from "./axios";

export default class Logout extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    logout() {
        axios.post("/logout").then((res) => {
            console.log("LOGOUT RESPONSE: ", res);
            location.replace("/welcome#/login");
        });
    }

    render() {
        return (
            <div className="columns is-centered">
                <div className="column is-one-third">
                    {this.state.error && (
                        <div className="errorMsg">Log In Failed!</div>
                    )}
                    <div className="field">
                        <p className="control">
                            <a
                                className="navbar-item navbarItem"
                                onClick={() => this.logout()}
                            >
                                Logout
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

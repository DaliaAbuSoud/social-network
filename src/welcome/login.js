// very similar to register here and in petition
import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        console.log("e.target.value:", e.target.value);
        console.log("e.target.name:", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.setState:", this.state)
        ); /* we put here a callback function to be able to console.log the (this.setState) becuase setState is Asinc and it will go away immediatly and we cant see the results in the connole.*/
    }

    login() {
        console.log("about to login:", this.state);
        axios.post("./login", this.state).then((response) => {
            console.log("LOGIN RESPONSE: ", response);
            location.replace("/myprofile");
        });
    }

    render() {
        return (
            <div className="columns is-centered">
                <div className="column is-one-third">
                    <h4 className="title is-4 has-text-white-ter">Login</h4>
                    {this.state.error && (
                        <div className="errorMsg">Log In Failed!</div>
                    )}
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input
                                className="input"
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="icon is-small is-left icon has-has-text-grey-light">
                                <i className="fas fa-envelope"></i>
                            </span>
                            <span className="icon is-small is-right icon has-has-text-grey-light">
                                <i className="fas fa-check"></i>
                            </span>
                        </p>
                    </div>

                    <div className="field">
                        <p className="control has-icons-left">
                            <input
                                className="input"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="icon is-small is-left icon has-has-text-grey-light">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>

                    <div className="field">
                        <p className="control">
                            <button
                                className="button is-success"
                                onClick={() => this.login()}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                    <Link to="/resetpass">Forgot Your Password?</Link>
                </div>
            </div>
        );
    }
}

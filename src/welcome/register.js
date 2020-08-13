import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        // console.log("e.target.value:", e.target.value);
        // console.log("e.target.name:", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.setState:", this.state)
        ); /* we put here a callback function to be able to console.log the (this.setState) becuase setState is Async and it will go away immediatly and we cant see the results in the connole.*/
    }

    submit() {
        console.log("about to submit:", this.state);
        axios.post("/register", this.state).then((response) => {
            // console.log("data: ", data);
            if (response.data.success) {
                location.replace("#/login");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div>
                {/*we can use form instead but then we have to put prevent default*/}
                <h3>Register</h3>
                {this.state.error && (
                    <div className="errorMsg">Ooops Something Went Wrong!</div>
                )}
                {/* only appears if the condition is true */}
                <input
                    name="firstname"
                    placeholder="firstname"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="lastname"
                    placeholder="lastname"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>Register</button>
                <p>
                    Already A Member?
                    <Link to="/login">Log in</Link>
                </p>
            </div>
        );
    }
}

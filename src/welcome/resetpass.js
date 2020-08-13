import React from "react";
import axios from "../axios";

export default class ResetPassword extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            step: 1,
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

    sendCode() {
        console.log("about to send code:", this.state);
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                console.log("RESET PASS DATA: ", data);
                this.setState({
                    step: 2,
                });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                });
                console.log("ERROR UNABLE TO SENT CODE: ", error);
            });
    }

    updatePass() {
        console.log("about to update pass:", this.state);
        axios.post("/password/reset/verify", this.state).then(({ data }) => {
            console.log("data: ", data);
            if (data.success) {
                location.replace("/");
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
                {this.state.step == 1 && (
                    <div>
                        <h1>Reset Password</h1>
                        <h2>Please Enter Your Registered Email</h2>
                        <input
                            name="email"
                            placeholder="email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button onClick={() => this.sendCode()}>
                            Send Code
                        </button>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div>
                        <h1>Reset Password</h1>
                        <h2>Please Enter The Code You Recieved Via Email</h2>
                        <input
                            name="code"
                            placeholder="Code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button onClick={() => this.updatePass()}>
                            Update Password
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

import React from "react";
import Logo from "./logo";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import axios from "../axios";
import Logout from "../logout";

export default class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            userData: {},
            userDataAvailable: false,
            uploaderIsVisible: false,
        };
    }

    componentDidMount(e) {
        axios
            .post("/userdata")
            .then((response) => {
                console.log("RESPONSEEEEEEE: ", response);
                this.setState({
                    userData: response.data.userData[0],
                    userDataAvailable: true,
                });
            })
            .catch((error) => {
                console.log("ERROR IN ADD IN APP: ", error);
            });
    }

    toggleModalInApp() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
        console.log("TOGGLE MODEL FUNCTION IS RUNNING!");
    }

    render() {
        const { userData } = this.state;
        return (
            <div className="mainNavbar">
                <nav className="navbar is-dark">
                    <div className="navbar-brand">
                        <a className="navbar-item">
                            <Logo />
                        </a>
                    </div>

                    <div
                        id="navbarExampleTransparentExample"
                        className="navbar-menu"
                    >
                        <div className="navbar-start">
                            <a className="navbar-item navbarItem" href="/">
                                Home
                            </a>
                            {this.state.userDataAvailable && (
                                <a
                                    className="navbar-item navbarItem"
                                    href="/mynetwork"
                                >
                                    My Network
                                </a>
                            )}
                            {this.state.userDataAvailable && (
                                <a
                                    className="navbar-item navbarItem"
                                    href="/search"
                                >
                                    Find Experiences
                                </a>
                            )}
                        </div>

                        <div className="navbar-end">
                            {this.state.userDataAvailable && (
                                <a
                                    className="navbar-item navbarItem"
                                    href="/messages"
                                >
                                    Messages
                                </a>
                            )}

                            <div className="navbar-item has-dropdown is-hoverable">
                                {this.state.userDataAvailable && (
                                    <a
                                        className="navbar-item navbarItem"
                                        href="/myprofile"
                                    >
                                        My Profile
                                    </a>
                                )}

                                <div className="navbar-dropdown is-dark">
                                    {this.state.userDataAvailable && (
                                        <a className="navbar-item navbarItem">
                                            Edit Profile
                                        </a>
                                    )}

                                    <hr className="navbar-divider" />
                                    {this.state.userDataAvailable && <Logout />}
                                </div>
                            </div>
                            <Profilepic
                                className="navbar-item navbarProfilePic"
                                profilepic={userData.profilepic}
                                toggleModalInApp={() => this.toggleModalInApp()}
                            />
                            {this.state.uploaderIsVisible &&
                                this.state.userDataAvailable && (
                                    <Uploader
                                        toggleModalInApp={() =>
                                            this.toggleModalInApp()
                                        } //parent to child
                                        picAdded={(pic) => {
                                            this.setState({
                                                profilepic: pic,
                                            });
                                        }}
                                    />
                                )}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

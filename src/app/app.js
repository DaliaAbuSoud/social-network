import React from "react";
import Navbar from "./navbar";
import Profile from "./profile";
import axios from "../axios";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route } from "react-router-dom";
import Search from "./search";
import Mynetwork from "./mynetwork";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            userData: {},
            userDataAvailable: false,
            bioBtnText: "",
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

                console.log("userData.Length:", this.state.userData.bio.length);
            })
            .catch((error) => {
                console.log("ERROR IN ADD IN APP: ", error);
            });
    }

    render() {
        const { userData } = this.state;
        return (
            <div>
                <Navbar />
                <div className="wrapper">
                    <BrowserRouter>
                        <div className="usersProfilesCards">
                            {this.state.userDataAvailable && (
                                <Route
                                    exact
                                    path="/myprofile"
                                    render={() => (
                                        <Profile
                                            firstname={userData.firstname}
                                            lastname={userData.lastname}
                                            profilepic={userData.profilepic}
                                            bio={userData.bio}
                                            email={userData.email}
                                        />
                                    )}
                                />
                            )}
                            <Route
                                exact
                                path="/user/:id"
                                component={OtherProfile}
                            />

                            <Route
                                exact
                                path="/search"
                                render={() => (
                                    <Search
                                        firstname={userData.firstname}
                                        lastname={userData.lastname}
                                        profilepic={userData.profilepic}
                                        email={userData.email}
                                        city={userData.city}
                                        country={userData.country}
                                        jobtitle={userData.jobtitle}
                                    />
                                )}
                            />

                            <Route
                                exact
                                path="/mynetwork"
                                render={() => (
                                    <Mynetwork
                                        firstname={userData.firstname}
                                        lastname={userData.lastname}
                                        profilepic={userData.profilepic}
                                        email={userData.email}
                                        city={userData.city}
                                        country={userData.country}
                                        jobtitle={userData.jobtitle}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/chat"
                                render={() => (
                                    <Chat
                                    // firstname={userData.firstname}
                                    // lastname={userData.lastname}
                                    // profilepic={userData.profilepic}
                                    // bio={userData.bio}
                                    // email={userData.email}
                                    />
                                )}
                            />
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

import React, { Component, Fragment } from "react";
import axios from "../axios";
import UserInfo from "./userinfo";
import Friendshipbtn from "./friendshipbtn";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            userDataAvailable: false,
        };
    }
    componentDidMount() {
        console.log("OTHER USER ID: ", this.props);
        axios
            .post("/userdata", { otherUserId: this.props.match.params.id })
            .then((response) => {
                console.log("OTHER PROFILE AXIOS RESPONSE:", response);
                this.setState({
                    userData: response.data.userData[0],
                    userDataAvailable: true,
                });
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: error.response.data.message,
                    userDataAvailable: false,
                });
            });
    }
    render() {
        const { userData } = this.state;
        return (
            <Fragment>
                {this.state.userDataAvailable && (
                    <div className="columns">
                        {/* ******************** ProfilePic Section ******************** */}
                        <div className="column is-one-fifth">
                            <img
                                onClick={() => this.modalIsActive()}
                                src={userData.profilepic}
                                alt="Placeholder image"
                            ></img>
                        </div>
                        {/* ******************** Big Image Model ******************** */}
                        <div className="modal">
                            <div className="modal-background"></div>
                            <div className="modal-content">
                                <p className="image is-4by3">
                                    <img
                                        alt={`${userData.firstname} ${userData.lastname}'s image`}
                                        src={userData.profilepic}
                                    />
                                </p>
                            </div>
                            <button
                                onClick={() => this.closeModal()}
                                className="modal-close is-large"
                                aria-label="close"
                            ></button>
                        </div>
                        {/* ******************** User Information Section ******************** */}
                        <div className="column is-two-fifths userData">
                            <UserInfo
                                firstname={userData.firstname}
                                lastname={userData.lastname}
                                email={userData.email}
                                bio={userData.bio}
                                city={userData.city}
                                country={userData.country}
                                jobtitle={userData.jobtitle}
                            />
                        </div>
                        {/* **************************************************** */}
                        <div className="media-right">
                            <Friendshipbtn otherUserId={userData.id} />
                        </div>
                    </div>
                )}
                {this.state.error && (
                    <div className="message error">
                        {this.state.errorMessage}
                    </div>
                )}
            </Fragment>
        );
    }
}
export default OtherProfile;

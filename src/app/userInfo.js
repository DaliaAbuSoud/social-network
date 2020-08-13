import React from "react";
import Experiences from "./experiences";
import Cv from "./cv";
import Cvuploader from "./cvuploader";

export default class UserInfo extends React.Component {
    constructor(props) {
        super();
        this.state = {
            userData: {},
            cvUploaderIsVisible: false,
        };
    }
    toggleCvInApp() {
        this.setState({
            cvUploaderIsVisible: !this.state.cvUploaderIsVisible,
        });
        console.log("TOGGLE CV FUNCTION IS RUNNING!");
    }

    render() {
        const {
            firstname,
            lastname,
            email,
            bio,
            city,
            country,
            jobtitle,
            cv,
        } = this.props;

        return (
            <div className="userInfoContainer">
                <p className="title is-4">
                    {firstname} {lastname}
                </p>
                <p className="subtitle is-6">Job Title {jobtitle}</p>
                <p className="subtitle is-6">
                    City{city}, Country{country}
                </p>
                <p className="subtitle is-6 icons">
                    <span className="icon has-has-text-grey-light">
                        <i className="fas fa-envelope-open"></i>
                    </span>
                    {email}
                    <br></br>
                    <span className="icon has-has-text-grey-light">
                        <i className="fab fa-facebook"></i>
                    </span>
                    <span className="icon has-has-text-grey-light">
                        <i className="fab fa-twitter"></i>
                    </span>
                    <span className="icon has-has-text-grey-light">
                        <i className="fab fa-github"></i>
                    </span>
                    <span className="icon has-has-text-grey-light">
                        <i className="fab fa-instagram"></i>
                    </span>
                </p>
                <br />
                <p className="subtitle is-6">Bio: {bio}</p>
                <br />
                {/* ******************** Experiences Section ******************** */}

                <Experiences className="experiences" />

                {/* ******************** CV & Video Section ******************** */}
                <Cv
                    firstname={firstname}
                    lastname={lastname}
                    cv={cv}
                    toggleCvInApp={() => this.toggleCvInApp()} //parent to child
                />
                {this.state.cvUploaderIsVisible && (
                    <Cvuploader
                        toggleCvInApp={() => this.toggleCvInApp()} //parent to child
                        cvAdded={(cv) => {
                            this.setState({
                                cv: cv,
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}

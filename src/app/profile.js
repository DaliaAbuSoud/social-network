import React from "react";
import UserInfo from "./userinfo";
import Bio from "./bio";
import Cv from "./cv";

export default class Profile extends React.Component {
    constructor(props) {
        super();
        this.state = {
            bioLink: "",
            bio: props.bio,
            bioIsVisible: false,
        };
    }

    componentDidMount() {
        const { bio } = this.props;
        this.handleBioLinkText(bio);
        this.closeModal();
    }
    enableBioText() {
        this.setState({
            bioIsVisible: !this.state.bioIsVisible,
        });
        console.log("TEXT AREA ENABLED!");
    }

    handleBioLinkText(bioText) {
        if (bioText && bioText.length > 0) {
            this.setState({
                bioLink: "Edit Bio",
            });
        } else {
            this.setState({
                bioLink: "Add Bio",
            });
        }
    }

    modalIsActive() {
        document.querySelector(".modal").classList.add("is-active");
    }

    closeModal() {
        document.querySelector(".modal").classList.remove("is-active");
    }

    render() {
        const {
            firstname,
            lastname,
            email,
            profilepic,
            city,
            country,
            jobtitle,
            cv,
        } = this.props;
        const { bio, bioLink, bioIsVisible } = this.state;

        return (
            <>
                <div className="columns">
                    {/* ******************** ProfilePic Section ******************** */}

                    <div className="column is-one-fifth">
                        {/* <figure className="image is-256x256"> */}
                        <img
                            onClick={() => this.modalIsActive()}
                            src={profilepic}
                            alt="Placeholder image"
                        ></img>
                        {/* </figure> */}
                    </div>

                    {/* ******************** Big Image Model ******************** */}
                    <div className="modal">
                        <div className="modal-background"></div>
                        <div className="modal-content">
                            <p className="image is-4by3">
                                <img src={profilepic} alt="profilePic"></img>
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
                            firstname={firstname}
                            lastname={lastname}
                            email={email}
                            bio={bio}
                            city={city}
                            country={country}
                            jobtitle={jobtitle}
                            cv={cv}
                        />
                        <section className="bioSection">
                            <p>Bio: {bio}</p>
                            <button
                                onClick={() => this.enableBioText()}
                                className="button is-text editBioBtn has-text-grey-light"
                                type="button"
                            >
                                {bioLink}
                            </button>
                            {/* ******************** Bio Section ******************** */}
                            {bioIsVisible && (
                                <Bio
                                    bioValue={bio}
                                    bioUpdateCompleted={(updatedBioText) => {
                                        this.handleBioLinkText(updatedBioText);
                                        this.setState({
                                            bio: updatedBioText,
                                            bioIsVisible: false,
                                        });
                                    }}
                                />
                            )}
                        </section>
                    </div>
                </div>
            </>
        );
    }
}

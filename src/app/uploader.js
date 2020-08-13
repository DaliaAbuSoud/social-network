import React from "react";
import axios from "../axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            profilepic: "",
        };
    }

    addProfilePic(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.profilepic);
        this.loadingPicBtn();

        axios.post("/addprofilepic", formData).then((response) => {
            console.log("PROFILE PIC AXIOS RESPONSE:", response);
            if (response.data.success) {
                this.setState({
                    profilepic: response.data.profilepic,
                });

                console.log("ProfilePic Added Successfully!");

                this.props.picAdded(response.data.profilepic);
                this.closeModal();
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }
    handleChange(event) {
        // Monitor input file and save e.target.files[0] to state.image
        this.setState({
            profilepic: event.target.files[0],
        });
    }
    closeModal() {
        // Calls this.props.toggleModalInApp()
        this.props.toggleModalInApp();
    }
    loadingPicBtn() {
        console.log("LOOOOAAAADDDIIINNNGGGG");
        document.querySelector(".is-light").classList.add("is-loading");
    }

    render() {
        return (
            <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <form
                        className="file has-name is-right is-small uploaderForm"
                        onSubmit={(e) => this.addProfilePic(e)}
                    >
                        <h1 className="uploaderTitle">
                            Change Profile Picture
                        </h1>
                        <label className="file-label">
                            <input
                                className="file-input"
                                type="file"
                                name="resume"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <span className="file-cta">
                                <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                </span>
                                <span className="file-label">
                                    Choose a file…
                                </span>
                            </span>
                            <span className="file-name">
                                Screen Shot 2017-07-29 at 15.54.25.png
                            </span>
                        </label>
                        <button
                            className="uploaderSubmit button is-light"
                            onSubmit={(e) => this.addProfilePic(e)}
                        >
                            Submit
                        </button>
                    </form>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={() => this.closeModal()}
                ></button>
            </div>
        );
    }
}

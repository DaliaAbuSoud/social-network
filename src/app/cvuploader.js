import React from "react";
import axios from "../axios";

export default class CvUploader extends React.Component {
    constructor() {
        super();
        this.state = {
            cv: "",
        };
    }

    addCv(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.cv);
        this.loadingCvBtn();

        axios.post("/addcv", formData).then((response) => {
            console.log("CV AXIOS RESPONSE:", response);
            if (response.data.success) {
                this.setState({
                    cv: response.data.cv,
                });

                console.log("CV Added Successfully!");

                this.props.cvAdded(response.data.cv);
                this.closeModal();
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }
    handleChange(event) {
        this.setState({
            cv: event.target.files[0],
        });
    }
    closeModal() {
        this.props.toggleCvInApp();
    }
    loadingCvBtn() {
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
                        onSubmit={(e) => this.addCvPic(e)}
                    >
                        <h1 className="uploaderTitle">Change Your CV</h1>
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
                                CV 2017-07-29 at 15.54.25.pdf
                            </span>
                        </label>
                        <button
                            className="uploaderSubmit button is-light"
                            onSubmit={(e) => this.addCvPic(e)}
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

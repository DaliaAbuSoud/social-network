import React from "react";
import axios from "../axios";

export default class Bio extends React.Component {
    constructor(props) {
        console.log("PROPS IN BIO", props);
        super();
        this.state = {
            bio: props.bioValue,
            buttonText: "",
        };
    }
    componentDidMount() {
        const { bioValue } = this.props;
        if (bioValue && bioValue.length > 0) {
            this.setState({
                buttonText: "Edit Bio",
            });
        } else {
            this.setState({
                buttonText: "Add Bio",
            });
        }
    }
    handleChange(e) {
        this.setState(
            {
                bio: e.target.value,
            },
            () => console.log("this.setState:", this.state)
        );
    }

    addBio(e) {
        e.preventDefault();
        const dataToSend = {
            bio: this.state.bio,
        };
        axios.post("/addbio", dataToSend).then((response) => {
            console.log("BIO AXIOS RESPONSE:", response);
            if (response.data.success) {
                this.setState({
                    bio: response.data.bio,
                });
                this.closeModal(response.data.bio);

                console.log("Bio Added Successfully!");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }
    closeModal(bio) {
        this.props.bioUpdateCompleted(bio);
    }

    handleBioText(bioText) {
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

    render() {
        return (
            <div className="modal is-active ">
                <div className="modal-background"></div>
                <form
                    className="modal-content"
                    onSubmit={(e) => this.addBio(e)}
                >
                    <div className="bioContainer">
                        <textarea
                            className="textarea bioTextarea"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="User Bio"
                            name="userBio"
                            defaultValue={this.props.bioValue}
                            disabled={this.state.disabledTextArea}
                        ></textarea>

                        <button className="button" type="submit">
                            {this.state.buttonText}
                        </button>
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                    ></button>
                </form>
            </div>
        );
    }
}

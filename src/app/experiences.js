import React from "react";

export default class Experiences extends React.Component {
    constructor(props) {
        super();
        this.state = {};
    }

    render() {
        const { firstname, lastname, email, profilepic, bio } = this.props;

        return (
            <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                    <p className="tag is-primary has-text-dark">Technology</p>
                </div>
                <div className="control">
                    <p className="tag is-primary has-text-dark">Technology</p>
                </div>
                <div className="control">
                    <p className="tag is-primary has-text-dark">Technology</p>
                </div>
                <div className="control">
                    <p className="tag is-primary has-text-dark">Technology</p>
                </div>
                <div className="control">
                    <p className="tag is-primary has-text-dark">Technology</p>
                </div>
            </div>
        );
    }
}

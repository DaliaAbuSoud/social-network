import React from "react";

export default function Cv({ firstname, lastname, cv, toggleCvInApp }) {
    cv = cv;

    return (
        <div className="cvContainer">
            <a onClick={toggleCvInApp}>Update Your CV</a>
            <br />
            <a className="CV" src="assets/feathers6.png" alt="CV">
                {firstname} {lastname}'s CV: {cv}
            </a>
        </div>
    );
}

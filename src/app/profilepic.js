import React from "react";

export default function ProfilePic({ profilepic, toggleModalInApp }) {
    profilepic = profilepic || "/assets/default.svg"; // this is incase the use did not upload a profile picture then the page reders the default pic.

    //in order to access the data passed from parent to child we have to use props
    // console.log("PROPS IN PROFILE PIC :", { imageUrl }); // here we get the object data we set inthe app (firstname, lastname, imageUrl)

    return (
        <div className="profilePicContainer">
            <img
                className="profilePic"
                src={profilepic}
                alt="profilePic"
                onClick={toggleModalInApp}
            ></img>
        </div>
    );
}

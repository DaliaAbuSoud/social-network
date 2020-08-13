import React from "react";

export default function Logo({ logo }) {
    //in order to access the data passed from parent to child we have to use props
    console.log("PROPS IN PROFILE PIC :", { logo }); // here we get the object data we set inthe app (firstname, lastname, imageUrl)

    return (
        <div className="logoContainer">
            <img className="logo" src="/assets/feathers8.png" alt="logo"></img>
        </div>
    );
}

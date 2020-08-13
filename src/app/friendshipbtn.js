import React, { useState, useEffect } from "react";
import Axios from "../axios";

export default function Friendshipbtn({ otherUserId }) {
    console.log("otherUserId: ", otherUserId);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("I am the friendship Component Mounting");
        Axios.get(`/connectionstatus/${otherUserId}`).then((response) => {
            console.log("USEEFFECT AXIOS RES :", response);
            setButtonText(response.data.buttonText);
        });
    }, []);
    function submit() {
        console.log(
            "I click on the button! and the button text is",
            buttonText
        );
        Axios.post("/connectionstatus", { otherUserId, buttonText })
            .then((response) => {
                console.log("CONNECTION AXIOS DATA:", response);
                setButtonText(response.data.buttonText);
            })
            .catch((error) => {
                console.log("ERROR IN CONNECTION AXIOS POST: ", error);
            });
    }
    return (
        <div>
            <button
                className="friedshipBtn button is-primary is-outlined is-hovered"
                onClick={submit}
            >
                {buttonText}
            </button>
        </div>
    );
}

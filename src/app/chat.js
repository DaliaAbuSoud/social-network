import React, { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef; // to make the chat msgs scroll down and show the end once the page renders.
    const chatMsgs = useSelector((state) => state && state.chatMsgs);

    useEffect(() => {
        // console.log("Chat Hooks Has Routed");
        // console.log("elemRef: ", elemRef);
        // console.log("Scroll Top: ", elemRef.current.scrollTop); // how much we scrolled from the top
        // console.log("Client Height: ", elemRef.current.clientHeight); //our fixed height of our chat contaainer
        // console.log("Scroll Height: ", elemRef.current.scrollHeight); // is the chat container and any extra height we have that is hidden because of extra msgs.

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    console.log("here are my last 10 chat msgs", chatMsgs);
    //we can see this console.log after we finsihs all the data flow.

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); //prevent going to next line inside the textarea when pressing enter
            console.log("value: ", e.target.value);
            socket.emit("My Chat Msg", e.target.value);
            e.target.value = ""; //to clear the textarea after writting the msg
        }
    };

    return (
        <div className="columns is-centered">
            <div className="column is-one-third">
                <p className="title is-3 has-text-white-ter">Welcome To Chat</p>
                <div className="chatBox" ref={elemRef}>
                    Chat Msgs will go here
                </div>
                <textarea
                    placeholder="add your msg here"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}

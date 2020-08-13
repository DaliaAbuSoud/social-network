import * as io from "socket.io-client";

//ehiele working on this we have to uncommit the three lines below:
// import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // socket.on("chatMsgs", (msgs) => store.dispatch(chatMessages(msgs)));

        // socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));

        //listening to index.js:
        socket.on("addChatMsg", (msg) => {
            console.log(
                `Got a message in the client ! i', about to start whole redux process by dispatching here. My Msg is ${msg}`
            );
        });
    }
};

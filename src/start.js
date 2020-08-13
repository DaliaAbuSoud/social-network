import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome/welcome";
import App from "./app/app";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
//giving socket.js access to redux
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

//if the user is logged in
let elem;

const userLoggedIn = location.pathname != "/welcome";
// console.log("LOCATION: ", location.pathname);

if (userLoggedIn) {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));

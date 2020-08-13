//one array that has all friends.
import React, { useEffect } from "react";
import {
    getConnectionsAndWannabes,
    acceptConnectionsRequest,
    declineConnectionRequest,
    disconnect,
} from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Mynetwork() {
    const wannabes = useSelector(
        (state) =>
            state.connectionsAndWannabesList &&
            state.connectionsAndWannabesList.filter(
                (allConnections) => !allConnections.accepted
            )
    );
    const alreadyConnected = useSelector(
        (state) =>
            state.connectionsAndWannabesList &&
            state.connectionsAndWannabesList.filter(
                (allConnections) => allConnections.accepted
            )
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getConnectionsAndWannabes(dispatch));
    }, []);

    console.log("WANNABES: ", wannabes);
    console.log("ALREADY CONNECTED: ", alreadyConnected);

    if (!wannabes) {
        console.log("NO WANNABES");
        return "NO WANNABES";
    }

    return (
        <div className="columns is-centered">
            <div className="column is-one-quarter">
                {wannabes &&
                    wannabes.length == 0 &&
                    alreadyConnected.length == 0 && <h2>No Connections</h2>}
                {wannabes && wannabes.length > 0 && (
                    <h2 className="has-text-white-ter">Connection Requests</h2>
                )}
                {wannabes &&
                    wannabes.map((allConnections) => (
                        <div key={`wannabes-${allConnections?.id}`}>
                            <div>
                                <h2 className="has-text-white-ter">
                                    {allConnections.id}
                                    {allConnections.accepted}
                                </h2>
                                {/* 
                                {/* 
                                {/* 
                                */}

                                <div className="media-content searchContent">
                                    <div className="content ">
                                        <p className="searchResultsData">
                                            <Link
                                                className="has-text-white-ter"
                                                to={
                                                    "/user/" + allConnections.id
                                                }
                                            >
                                                <img
                                                    src={
                                                        allConnections.userData
                                                            .profilepic
                                                    }
                                                />
                                                <strong>
                                                    {
                                                        allConnections.userData
                                                            .firstname
                                                    }{" "}
                                                    {
                                                        allConnections.userData
                                                            .lastname
                                                    }
                                                </strong>
                                            </Link>
                                            <br />
                                            <small>
                                                {
                                                    allConnections.userData
                                                        .jobtitle
                                                }
                                            </small>
                                            <br />
                                            <small>
                                                {allConnections.userData.city},
                                                {
                                                    allConnections.userData
                                                        .country
                                                }
                                            </small>
                                        </p>
                                    </div>
                                </div>

                                {/* 
                                {/* 
                                {/* 
                                */}
                            </div>
                            <button
                                className="button is-primary is-outlined is-hovered"
                                onClick={() =>
                                    dispatch(
                                        acceptConnectionsRequest(
                                            allConnections.id,
                                            dispatch
                                        )
                                    )
                                }
                            >
                                Accept Connection Request
                            </button>
                            <button
                                className="button is-primary is-outlined is-hovered"
                                onClick={() =>
                                    dispatch(
                                        declineConnectionRequest(
                                            allConnections.id,
                                            dispatch
                                        )
                                    )
                                }
                            >
                                Decline Connection Request
                            </button>
                        </div>
                    ))}
            </div>
            <div className="column is-one-quarter">
                {alreadyConnected && alreadyConnected.length > 0 && (
                    <h2 className="has-text-white-ter"> Connections </h2>
                )}
                {alreadyConnected.map((allConnections) => (
                    <div key={`alreadyConnected-${allConnections?.id}`}>
                        <div>
                            <h2 className="has-text-white-ter">
                                {allConnections.id} {allConnections.accepted}
                            </h2>
                            {/* 
                            
                         */}
                            <div className="media-content searchContent">
                                <div className="content ">
                                    <p className="searchResultsData">
                                        <Link
                                            className="has-text-white-ter"
                                            to={"/user/" + allConnections.id}
                                        >
                                            <img
                                                src={
                                                    allConnections.userData
                                                        .profilepic
                                                }
                                            />
                                            <strong>
                                                {
                                                    allConnections.userData
                                                        .firstname
                                                }{" "}
                                                {
                                                    allConnections.userData
                                                        .lastname
                                                }
                                            </strong>
                                        </Link>
                                        <br />
                                        <small>
                                            {allConnections.userData.jobtitle}
                                        </small>
                                        <br />
                                        <small>
                                            {allConnections.userData.city},
                                            {allConnections.userData.country}
                                        </small>
                                    </p>
                                </div>
                            </div>
                            {/* 
                            
                         */}
                        </div>
                        <button
                            className="button is-primary is-outlined is-hovered"
                            onClick={() =>
                                dispatch(
                                    disconnect(allConnections.id, dispatch)
                                )
                            }
                        >
                            Disconnect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

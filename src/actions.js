export const ActionTypes = {
    SAVE_CONNECTIONS_LIST: "SAVE_CONNECTIONS_LIST",
    GET_CONNECTIONS_AND_WANNABES: "GET_CONNECTIONS_AND_WANNABES",
    ACCEPT_CONNECTIONS_REQUEST: "ACCEPT_CONNECTIONS_REQUEST",
    DECLINE_CONNECTIONS_REQUEST: "DECLINE_CONNECTIONS_REQUEST",
    DISCONNECT: "DISCONNECT",
};

export function saveConnectionsList(list) {
    return {
        type: ActionTypes.SAVE_CONNECTIONS_LIST,
        list,
    };
}

export function getConnectionsAndWannabes(dispatch) {
    return {
        type: ActionTypes.GET_CONNECTIONS_AND_WANNABES,
        dispatch,
    };
}

export function acceptConnectionsRequest(otherUserId, dispatch) {
    console.log("THE ACCEPT BTN OTHER USER ID", otherUserId);

    return {
        type: ActionTypes.ACCEPT_CONNECTIONS_REQUEST,
        otherUserId,
        dispatch,
    };
}

export function declineConnectionRequest(otherUserId, dispatch) {
    return {
        type: ActionTypes.DECLINE_CONNECTIONS_REQUEST,
        otherUserId,
        dispatch,
    };
}

export function disconnect(otherUserId, dispatch) {
    return {
        type: ActionTypes.DISCONNECT,
        otherUserId,
        dispatch,
    };
}

//the first time the reducer runs the state will be empty.
//the action describes the change that we will do to state.
import {
    ActionTypes,
    saveConnectionsList,
    getConnectionsAndWannabes,
} from "./actions";
import {
    getConnectionsAndWannabesApi,
    acceptConnectionsRequestApi,
    declineConnectionRequestApi,
    disconnectApi,
} from "./api";

const INITAL_STATE = {
    connectionsAndWannabesList: [],
};

export default function Reducer(state = INITAL_STATE, action) {
    console.log("ACTION: ", action);
    //
    //
    //
    if (action.type === ActionTypes.GET_CONNECTIONS_AND_WANNABES) {
        getConnectionsAndWannabesApi().then((response) => {
            console.log("GET ALL CONNNECTIONS & WANNABES RESPONSE :", response);
            const allConnections = response.data.response;
            console.log("ACTION IS ", action);
            console.log("&&&&&&AllConnections IS ", allConnections);

            action.dispatch(saveConnectionsList(allConnections));
        });
        return state;
    }
    //
    //
    //
    else if (action.type == ActionTypes.SAVE_CONNECTIONS_LIST) {
        return { ...state, connectionsAndWannabesList: action.list };
    }
    //
    //
    //
    else if (action.type == ActionTypes.ACCEPT_CONNECTIONS_REQUEST) {
        console.log("********");
        acceptConnectionsRequestApi(action.otherUserId).then((response) => {
            console.log("ACCEPT CONNECTION REQUEST RESPONSE :", response);
            action.dispatch(getConnectionsAndWannabes(action.dispatch));
        });
    }
    //
    //
    //
    else if (action.type == ActionTypes.DECLINE_CONNECTIONS_REQUEST) {
        declineConnectionRequestApi(action.otherUserId).then((response) => {
            console.log("DECLINE CONNECTION REQUEST RESPONSE :", response);
            action.dispatch(getConnectionsAndWannabes(action.dispatch));
        });
    }
    //
    //
    //
    else if (action.type == ActionTypes.DISCONNECT) {
        disconnectApi(action.otherUserId).then((response) => {
            console.log("DISCONNECT REQUEST RESPONSE :", response);
            action.dispatch(getConnectionsAndWannabes(action.dispatch));
        });
    }
    return state;
}

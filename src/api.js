import axios from "./axios";

export function getConnectionsAndWannabesApi() {
    return axios.get("/connectionsandwannabes");
}

export function acceptConnectionsRequestApi(id) {
    console.log("*********** API");

    return axios.post("/connectionsandwannabes", {
        buttonText: "Accept Connection Request",
        otherUserId: id,
    });
}

export function declineConnectionRequestApi(id) {
    return axios.post("/connectionsandwannabes", {
        buttonText: "Decline Connection Request",
        otherUserId: id,
    });
}

export function disconnectApi(id) {
    return axios.post("/connectionstatus", {
        buttonText: "Disconnect",
        otherUserId: id,
    });
}

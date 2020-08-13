import axios from "axios";

var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token",
});

instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common.Accept = "application/json";

export default instance;

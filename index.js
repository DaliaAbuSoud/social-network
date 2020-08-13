//*************************CONFIGURING MULTER********************* */
// it handles the images , upload them and give them a uniqie name
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// ************************ CONSTs *******************************

const express = require("express");
const app = express();
//socket io
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
//
const compression = require("compression");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const ses = require("./ses");
const s3 = require("./s3");

// ******************* MIDDLEWARES ***************************

app.use(compression());
//stoing cookie session in a variable and we pass this varable in socket.
//we only use this method when we r using socket io.
//if not socket we just use app.cookieSession.
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(express.json());
app.use(express.static("./public"));

app.use((req, res, next) => {
    // console.log("**************");
    // console.log("ran: " + req.method);
    // console.log("at route: " + req.url);
    // console.log("**************");
    next(); //makes sure we exit the middleware function and our code continues to run
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//******************* csurf securit *********************

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//**************** /WELCOME *******************

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//**************** /REGISTER *******************

app.post("/register", (req, res) => {
    // console.log("req.body", req.body);
    const { firstname, lastname, email, password } = req.body;

    hash(password)
        .then((hashedPass) => {
            // console.log("PASSWORD HAS BEEN HASHED", hashedPass);
            return hashedPass;
        })
        .then((hashedPass) => {
            db.addUserData(firstname, lastname, email, hashedPass)
                .then((response) => {
                    req.session.userId = response.rows[0].id;
                    // console.log("REQUEST.SESSION.USERID", req.session.userId);
                    res.json({ success: true });
                })
                .catch((error) => {
                    console.log("REGISTRATION ROUT ERROR (/register)", error);
                    res.json({
                        success: false,
                        msg: "Email already registered",
                    });
                });
            // console.log("USER HAS REGISTERED");
        });
});

//**************** /LOGIN *******************

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("LOGIN REQ.BODY: ", req.body);
    if (email !== "" && password !== "") {
        let userID;
        db.getEmail(email)
            .then((response) => {
                console.log("TTTTTTTTTTEST: ", response);
                if (response.rows.length > 0) {
                    let dbPass = response.rows[0].password;
                    // console.log("***********DB PASS: ", dbPass);
                    userID = response.rows[0].id;
                    // console.log(userID);
                    return dbPass;
                } else {
                    res.status(401).send({
                        message: "Your Email doesn't exist, please sign up!",
                    });
                }
            })
            .then((dbPass) => {
                return compare(password, dbPass.toString("utf8")).then(
                    (comparedPass) => {
                        return comparedPass;
                    }
                );
            })
            .then((comparedPass) => {
                if (comparedPass) {
                    req.session.userId = userID;
                    // res.status(200).redirect("/login");
                    res.status(200).send({
                        message: "User logged in successfully",
                    });

                    // console.log("USER LOGGED IN SUCCESSFULLY");
                } else if (!comparedPass) {
                    res.status(401).send({
                        message: "Your Password is incorrect",
                    });
                    console.log("INCORRECT PASSWORD");
                }
            })
            .catch((error) => {
                console.log("LOGIN ERROR: ", error);
                res.status(401).send({
                    message: "Something went wrong!",
                });
            });
    }
});

//**************** /PASSWORD/RESET/START *******************

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    // console.log("EMAIL: ", email);
    if (email && email !== "") {
        db.getEmail(email)
            .then((response) => {
                console.log("RESPONSE GENERATED SECRET CODE: ", response.rows);
                const selectedEmail = response.rows[0].email;
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.addSecretCode(selectedEmail, secretCode)
                    .then((response) => {
                        const to = response.rows[0].email;
                        const subject = "Feathers: Reset your password";
                        const text = response.rows[0].code;
                        ses.sendEmail(to, subject, text).then(() => {
                            res.status(200).send({
                                message:
                                    "Password reset email sent successfully.",
                            });
                        });
                    })
                    .catch((error) => {
                        res.status(401).send({
                            message: "Code could not be stored!",
                        });
                    });
            })

            .catch((error) => {
                console.log("RESET PASS ERROR: ", error);
                res.status(401).send({
                    message: "Something went wrong!",
                });
            });
    }
});

//**************** /PASSWORD/RESET/VERIFY *******************

app.post("/password/reset/verify", (req, res) => {
    let { email, code, password } = req.body;

    db.authorizeCode(code)
        .then((response) => {
            // console.log("Authorize code response", response);
            if (response.rows.length > 0 && response.rows[0].email === email) {
                hash(password)
                    .then((hashedPass) => {
                        db.updateUserPass(email, hashedPass)
                            .then(() => {
                                res.status(200).send({
                                    message: "Password Updated successfully.",
                                });
                            })
                            .catch((error) => {
                                console.log("ERROR IN UPDATING PASS: ", error);
                            });
                    })
                    .catch((error) => {
                        console.log("ERROR IN HASHED PASS: ", error);
                    });
            } else {
                res.status(404).send({
                    message: "Code doesn't exist",
                });
            }
        })
        .catch((error) => {
            console.log("ERROR", error);
        });
});

//**************** /ADDPROFILEPIC *******************

app.post("/addprofilepic", uploader.single("file"), s3.upload, (req, res) => {
    const { userId } = req.session;
    if (req.file) {
        let filename = req.file.filename;

        return db
            .addProfilePic(
                "https://s3.amazonaws.com/daliaabusoud/" + filename,
                userId
            )
            .then((response) => {
                // console.log("DB.ADD PROFILE PIC RESPONSE: ", response);
                if (response.rows.length > 0) {
                    res.status(200).send({
                        message: "Your profile picture has been uploaded 🎉",
                        success: true,
                        profilepic: response.rows[0].profilepic,
                    });
                } else {
                    res.status(404).send({
                        message: "Something went wrong!",
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("DB.ADD PROFILE PIC ERROR: ", error);
            });
    } else {
        res.json({ success: false });
    }
});

//**************** ADD CV *******************

app.post("/addcv", uploader.single("file"), s3.upload, (req, res) => {
    const { userId } = req.session;
    if (req.file) {
        let filename = req.file.filename;

        return db
            .addCv("https://s3.amazonaws.com/daliaabusoud/" + filename, userId)
            .then((response) => {
                // console.log("DB.ADD PROFILE PIC RESPONSE: ", response);
                if (response.rows.length > 0) {
                    res.status(200).send({
                        message: "Your profile picture has been uploaded 🎉",
                        success: true,
                        cv: response.rows[0].cv,
                    });
                } else {
                    res.status(404).send({
                        message: "Something went wrong!",
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("DB.ADD CV PIC ERROR: ", error);
            });
    } else {
        res.json({ success: false });
    }
});

//**************** /USERDATA *******************

app.post("/userdata", (req, res) => {
    let userId = req.session.userId;
    const { otherUserId } = req.body;

    if (userId) {
        if (otherUserId) {
            userId = otherUserId;
        }
        db.getUserData(userId)
            .then((response) => {
                // console.log("DB.GET USER DATA RESPONSE: ", response);
                if (response.rows.length > 0) {
                    res.status(200).send({
                        success: true,
                        message: "User Available!",
                        userData: response.rows,
                    });
                } else {
                    res.status(404).send({
                        message: "User Not found!",
                    });
                }
            })
            .catch((error) => {
                console.log("DB.GET USER DATA ERROR: ", error);
            });
    }
});

//**************** /ADDBIO *******************

app.post("/addbio", (req, res) => {
    const { userId } = req.session;
    const { bio } = req.body;
    // console.log("**********", req.body);
    db.addBio(bio, userId)
        .then((response) => {
            // console.log("DB.ADD BIO RESPONSE: ", response);
            if (response.rows.length > 0) {
                res.status(200).send({
                    message: "Your Bio Has Been Uploaded 🎉",
                    success: true,
                    bio: response.rows[0].bio,
                });
            } else {
                res.status(404).send({
                    message: "Something went wrong!",
                    error: true,
                });
            }
        })
        .catch((error) => {
            console.log("DB.ADD BIO ERROR: ", error);
        });
});

//**************** /LASTJOINEDUSERS *******************

app.get("/lastJoinedUsers", (req, res) => {
    let userId = req.session.userId;
    // console.log("USERID TEST: ", userId);

    db.getLastJoinedUsers()
        .then((response) => {
            // console.log("DB.GET LAST JOINED USER DATA RESPONSE: ", response);
            if (response.rows.length > 0) {
                const filteredUserData = response.rows.filter(
                    (user) => user.id !== userId
                );
                res.status(200).send({
                    success: true,
                    message: "User Available!",
                    userData: filteredUserData,
                });
            } else {
                res.status(404).send({
                    message: "User Not found!",
                });
            }
        })
        .catch((error) => {
            console.log("DB.GET LAST JOINED USER DATA ERROR: ", error);
        });
});

app.get("/findpeople", (req, res) => {
    // console.log("SEARCH QUERY: ", req.query.q);
    db.getMatchSearchResults(req.query.q).then((response) => {
        // console.log("RRRRRRR: ", response);
        res.send(response.rows);
    });
});

// **************** GET.CONNECTION STATUS ****************

app.get("/connectionstatus/:otherUserId", (req, res) => {
    const otherUserId = req.params.otherUserId;
    const activeUserID = req.session.userId;
    console.log("otherUserId", otherUserId);
    console.log("activeUserID", activeUserID);

    return db
        .getConnectionStatus(otherUserId, activeUserID)
        .then((response) => {
            console.log("FRIENDSHIP STATUS: ", response.rows);
            if (!response.rows.length) {
                res.status(200).send({
                    success: true,
                    buttonText: "Connect",
                });
            } else if (response.rows[0].accepted === false) {
                res.status(200).send({
                    success: true,
                    buttonText: "Connect",
                });
            } else if (response.rows[0].accepted === true) {
                res.status(200).send({
                    success: true,
                    buttonText: "Disconnect",
                });
            }
        });
});

// **************** POST.CONNECTION STATUS ****************

app.post("/connectionstatus", (req, res) => {
    console.log("******REQ: ", req.body);
    const otherUserId = req.body.otherUserId;
    const activeUser = req.session.userId;
    const buttonText = req.body.buttonText;
    if (buttonText === "Connect") {
        return db
            .sendConnectionRequest(otherUserId, activeUser)
            .then((response) => {
                console.log("BTN AXIOS POST RESPONSE: ", response);
                res.status(200).send({
                    message: "Connection Request Sent",
                    success: true,
                    buttonText: "Pending Request",
                });
                console.log("DB.SEND CONNECTION REQUEST: ", response.rows);
            })
            .catch((error) => {
                res.status(404).send({
                    error: true,
                    message: "ERROR: Connection Request Sent",
                });
            });
    }

    if (buttonText === "Disconnect") {
        return db
            .disconnect(otherUserId, activeUser)
            .then((response) => {
                res.status(200).send({
                    message: "  Connection Disconnected",
                    success: true,
                    otherUserId: otherUserId,
                    buttonText: "Connect",
                });
                console.log("DB.DISCONNECT: ", response.rows);
            })
            .catch((error) => {
                res.status(404).send({
                    error: true,
                    message: "ERROR: In Disconnecting",
                });
            });
    }
});
//**************** GET /CONNECTIONS AND WANNA BES *******************

app.get("/connectionsandwannabes", (req, res) => {
    const activeUser = req.session.userId;
    console.log("activeUser: ", activeUser);
    return db
        .connectionsAndWannaBes(activeUser)
        .then((response) => {
            const friendShipData = response.rows;
            console.log(
                "GET CONNECTIONS AND WANNABES RESPONSE.ROWS",
                friendShipData
            );

            let promises = [];
            friendShipData.forEach((element) => {
                promises.push(db.getUserData(element.id));
            });

            Promise.all(promises).then((result) => {
                console.log("***All resolved ", result);
                let resultElements = [];
                result.forEach((element) => {
                    const userData = element.rows[0];
                    const filteredFriendShip = friendShipData.filter(
                        (status) => status.id === userData.id
                    );

                    console.log(
                        "*******RESULT FOR EACH filteredFriendShip",
                        filteredFriendShip,
                        element.rows
                    );
                    resultElements.push({
                        id: filteredFriendShip[0].id,
                        accepted: filteredFriendShip[0].accepted,
                        userData,
                    });
                });
                res.status(200).json({
                    response: resultElements,
                    message: "Getting All Connections And Wanna Bes",
                    success: true,
                });
            });
        })
        .catch((error) => {
            console.log("CONNECTION ERROR", error);
            res.status(404).json({
                error: true,
                message: "ERROR: Getting All Connections And Wanna Bes ",
            });
        });
});

//**************** POST /CONNECTIONS AND WANNA BES *******************

app.post("/connectionsandwannabes", (req, res) => {
    console.log("REQ>BODY*****: ", req.body);
    const otherUserId = req.body.otherUserId;
    const activeUser = req.session.userId;
    const buttonText = req.body.buttonText;

    if (buttonText === "Accept Connection Request") {
        return db
            .acceptConnectionRequest(activeUser, otherUserId)
            .then((response) => {
                res.status(200).json({
                    message: "  Connection Request Accepted",
                    success: true,
                    otherUserId: otherUserId,
                    buttonText: "Disconnect",
                    response: response,
                });
                console.log("DB.ACCEPT CONNECTION REQUEST: ", response.rows);
            })
            .catch((error) => {
                res.status(404).send({
                    error: true,
                    message: "ERROR: Accept Conection Request",
                });
            });
    }

    if (buttonText === "Decline Connection Request") {
        return db
            .declineConnectionRequest(otherUserId, activeUser)
            .then((response) => {
                res.status(200).json({
                    message: "  Connection Request Declined",
                    success: true,
                    otherUserId: otherUserId,
                    buttonText: "Connect",
                });
                console.log("DB.DECLINE CONNECTION REQUEST: ", response.rows);
            })
            .catch((error) => {
                res.status(404).send({
                    error: true,
                    message: "ERROR: Decline Conection Request",
                });
            });
    }
});

//**************** APP.GET("*") *******************

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//**************** /LOGOUT *******************

app.post("/logout", (req, res) => {
    req.session.csrfSecret = null;
    req.session.userId = null;
    console.log("LOGOUT RESPONSE :", req.session);
    res.status(200).send({
        message: "Logged Out Successfully",
        success: true,
        csrfSecret: req.session.csrfSecret,
        userId: req.session.userId,
    });
});

// *************** APP.LISTEN ***********************
//we only say server.listen when we are using socket.io
//if we dont use socket io we leave it as app.listen.
server.listen(8080, function () {
    console.log(
        "*********************************I'm listening*********************************"
    );
});

// **************** SOCKET IO ****************

// connection is like an event listener, whenever we connect this function will run.

// io.on("connection", function (socket) {
//     console.log(`socket with id ${socket.id} is now connected`);

//if user is not logged in, disconnect them from socket. they're not allowed to use socket.
// if (!socket.request.session.userId) {
//     //the user id tis the same one we use in the cookie.
//     return socket.discoonect(true);
// }
// const userId = socket.request.session.userId;
//this is a good place to go get the last 10 msgs.
//you'll need to make a new table for chats.

// db.getLastTenMsgs().then((data) => {
//     console.log(data.rows);
//     // in here is where we need to send the chat back to the user through socket io
//     io.sockets.emit("chatMsgs", data.rows);
//     //emit takes two arguments, the first arguement is the msg we want to emit(we can right nay string we like) and it should be the same string we use in socket.js line 12.
//     //the sedond arguemnt is the actula data msgs
// });

// the db query for getting the last 10 msgs will need to be a join as we get data from different tables.
//most recent msg should be in the bottom.

// how to work with the order of the chat. we can work in the order in the query and reverse it.
// or we can order them in the server i the method.

//     socket.on("My Chat Msg", (newMsg) => {
//         //newMsg, is what the user is tryping
//         console.log("This msg is coming from chat.js component :", newMsg);
//         //who is the user who sent the msg
//         console.log("user who sent the msg: ", userId); //from line 617 above
//         // use this user/id to get the info of the user

//         //do a db query to STORE the new chat msg in the chat table
//         // do a new db query to GET the user info
//         //once we have this info we want to emit our chat obj to everyone to see it immediately.

//         io.sockets.emit("addChatMsg", newMsg);
//         //we should send alot more, not only newMsg. the msg and all the user info and the time stamp.
//         //here we should talk to socket.js
//     });
// });

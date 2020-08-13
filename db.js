const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/SN_DB"
);

// ********************* ADD USER DATA ****************************

module.exports.addUserData = (firstname, lastname, email, password) => {
    return db.query(
        `
    INSERT INTO users (firstname, lastname, email, password)
    VALUES($1, $2, $3, $4) RETURNING id`,
        [firstname, lastname, email, password]
    );
};

// ******************** GET USER DATA  *******************************
module.exports.getUserData = (userId) => {
    return db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
};

// ******************** GET EMAIL  *******************************

module.exports.getEmail = (email) => {
    return db.query(`SELECT email, password, id FROM users WHERE email=$1`, [
        email,
    ]);
};
// ******** CHECKING CODE FOR RESET PASS AUTHORIZATION  ****************
module.exports.authorizeCode = (secretCode) => {
    console.log("AUTHORIZE SECRET KEY FROM DATA BASE", secretCode);
    return db.query(
        `SELECT * FROM reset_codes
WHERE (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes') AND (code = $1);`,
        [secretCode]
    );
};

// ************************ ADD SECRET CODE **************************

module.exports.addSecretCode = (email, secretCode) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING email, code;`,
        [email, secretCode]
    );
};

// *************** UPDATE USER PASSWORD  ***********************
module.exports.updateUserPass = (hashedPass, email) => {
    return db.query(`UPDATE users SET password=$1 WHERE email=$2;`, [
        hashedPass,
        email,
    ]);
};

// *************** UPDATE USER BIO  ***********************

module.exports.addBio = (bio, userId) => {
    return db.query(`UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio`, [
        bio,
        userId,
    ]);
};

// ******************* UPDATE PROFILE PIC *************************

module.exports.addProfilePic = (profilepic, userId) => {
    return db.query(
        `UPDATE users SET profilepic=$1 WHERE id=$2 RETURNING profilepic`,
        [profilepic, userId]
    );
};

// ******************* UPDATE CV *************************

module.exports.addCv = (cv, userId) => {
    return db.query(`UPDATE users SET cv=$1 WHERE id=$2 RETURNING cv`, [
        cv,
        userId,
    ]);
};

// ******************* GET LAST JOINED 13 USERS *************************

module.exports.getLastJoinedUsers = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 13`);
};

// ******************* GET MATCH SEARCH RESULTS *************************

module.exports.getMatchSearchResults = (val) => {
    return db.query(
        `SELECT * FROM users 
        WHERE firstname 
        ILIKE $1;`,
        [val + "%"]
    );
};

// ******************* CHECK CONNECTION STATUS *************************

module.exports.getConnectionStatus = (receiver_id, sender_id) => {
    return db.query(
        `SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

// ******************* SEND CONNECTION REQUEST *************************

module.exports.sendConnectionRequest = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) 
        VALUES ($1, $2) RETURNING *;`,
        [receiver_id, sender_id]
    );
};

// ******************* ACCEPT CONNECTION REQUEST *************************

module.exports.acceptConnectionRequest = (receiver_id, sender_id) => {
    return db.query(
        `UPDATE friendships SET accepted = TRUE 
        WHERE (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

// ******************* DECLINE REQUEST *************************

module.exports.declineConnectionRequest = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE 
        (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

// ******************* DISCONNECT *************************

module.exports.disconnect = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE 
        (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

// ******************* SEND ALL CONNECTIONS & WANNA BES *************************

module.exports.connectionsAndWannaBes = (receiver_id) => {
    return db.query(
        `
      SELECT users.id, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
  `,
        [receiver_id]
    );
};

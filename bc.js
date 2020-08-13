const bcrypt = require("bcryptjs");
const { promisify } = require("util");
let { genSalt, hash, compare } = bcrypt;

genSalt = promisify(genSalt); //generate salt
hash = promisify(hash); //password & a salt as args
compare = promisify(compare); //text & hash compared value as args

module.exports.compare = compare;
module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));

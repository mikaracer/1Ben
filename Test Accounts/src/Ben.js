require('dotenv').config();
const Mongoose = require('mongoose');
const Users = require('./Account');
const Bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

Mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DataBase connected'));

const saltRounds = 10;

function hasher(password, saltRounds) {
    ben = Bcrypt.hashSync(password, saltRounds);
    return ben
}

async function accountcreate(email, password) {
    //promt email
    //promt password
    var user_uuid = uuidv4()
    var hashed_pass = hasher(password, saltRounds)
    console.log(hashed_pass)
    Users.create({
        email: email,
        user_uuid: user_uuid,
        password_hash: hashed_pass
    })

}
async function log_in(eml, psw) {
    const search = await Users.findOne({
        email: eml
    })
    var compare = await Bcrypt.compare(psw, search.password_hash)
    if (compare) {
        console.log('Logged in!')
    }
    else {
        console.log('Not logged in :(')
    }
}
//log_in('bendover@gmail.com', 'SickoMode123')
//accountcreate('bendover@gmail.com', 'SickoMode123')
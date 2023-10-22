

const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const initializePassport = (passport)=>{
    passport.use(new LocalStrategy((username, password, done) => {
        console.log(username,password);
        // const user = await User.findOne({ username: username, password: password })
    
    }))
    passport.serializeUser((user, done) => {
    
       done(null,user.id)
    })
    passport.deserializeUser((id) => {
       console.log(id);
    })
}

module.exports = initializePassport
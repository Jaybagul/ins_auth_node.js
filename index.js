    const express = require('express')
    const passport = require("passport")
    const InstagramStrategy = require('passport-instagram').Strategy;
    const cookieSession = require("cookie-session")
    require('dotenv').config()


    const app = express()

    //for connect to linkedin api
    //LinkedIn App Credentials 

    const INSTAGRAM_CLIENT_ID = `${process.env.INSTAGRAM_CLIENT_ID}`
    const INSTAGRAM_CLIENT_SECRET = `${process.env.INSTAGRAM_CLIENT_SECRET}`




    //passport configuration( linked in stratergy set up karna)

    passport.use(new InstagramStrategy({
        clientID: `${INSTAGRAM_CLIENT_ID}`,
        clientSecret: `${INSTAGRAM_CLIENT_SECRET}`,
        callbackURL: "http://localhost:3000/auth/instagram/callback"
    }, function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));

    //Serialize aur deserialize(session me data save aur recover karna )
    //Serialize :- user data ko session id me badlakar save karta hain

    passport.serializeUser((user, done) => done(null, user))
        // Deserialize: Session ID से यूज़र डेटा वापस लाता है।
    passport.deserializeUser((user, done) => done(null, user));


    // middleware setup

    app.use(
        cookieSession({
            name: 'session', //session name
            keys: ["secret keys"], //session ko encrypt karne ke liye ,
            maxAge: 24 * 60 * 60 * 1000
        })
    )

    app.use(passport.initialize()); //passport ko intialixe karta hain
    app.use(passport.session()) // pasport ke liye session middle ware se jodna


    //routes

    app.get("/", (req, res) => {
            res.send(`<h1>Home </h1> <a href="/auth/instagram">Login With Instagram</a>`)
        })
        //login routes

    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }), (req, res) => res.redirect('/profile'));


    //profile page pr user info show karne ke liye

    app.get("/profile", (req, res) => {
        if (!req.user) res.redirect("/") // agar user login nahi hai to home  page par bhejo
        res.send(`<h1>Welcome${req.user.displayName}</h1>`)
    })

    //logout karna hai toh

    app.get("/logout", (req, res) => {
        req.logout(() => {
            res.redirect("/") // logout hone ke bad home page pe
        })
    })

    app.listen(3000)
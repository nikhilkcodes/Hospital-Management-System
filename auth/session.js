const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgSession = require('connect-pg-simple')(session);
const db = require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const user = require('./models/userModel');

app.use(
	session({
		store: new pgSession({
			pool: pool, // Your database connection pool
		}),
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

				if (!user || user.rows.length === 0) {
					return done(null, false, { message: 'Incorrect email.' });
				}

				const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

				if (!passwordMatch) {
					return done(null, false, { message: 'Incorrect password.' });
				}

				return done(null, user.rows[0]);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

		if (!user || user.rows.length === 0) {
			return done(null, false, { message: 'User not found.' });
		}

		done(null, user.rows[0]);
	} catch (error) {
		done(error);
	}
});

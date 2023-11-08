const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const pg = require('pg');

const pool = new pg.Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const createUser = (email, password, callback) => {
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			return callback(err);
		}
		pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash], (error, results) => {
			callback(error, results);
		});
	});
};

const findUser = (email, password, callback) => {
	pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (error, results) => {
		callback(error, results);
	});
};


module.exports = { createUser, findUser };

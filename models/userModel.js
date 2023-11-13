const bcrypt = require('bcrypt');
const pool = require('../controller/pool');

async function createUser(email, password) {
	const hashedPassword = await bcrypt.hash(password, 10);
	const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
	return result.rows[0];
}

async function getUserByEmail(email) {
	const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
	console.log(result);
	return result.rows[0];
}

async function getUserById(id) {
	const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
	return result.rows[0];
}

module.exports = {
	createUser,
	getUserByEmail,
	getUserById,
};

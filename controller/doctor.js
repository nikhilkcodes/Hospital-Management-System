const pool = require('./pool');

// Create a new doctor
const createDoctor = async (doctorData) => {
	const { name, specialization, contact, appointment } = doctorData;
	const query = `INSERT INTO doctor (name, specialization, contact, appointment)
	VALUES ($1, $2, $3, $4)
	RETURNING id;
	`;
	const values = [name, specialization, contact, appointment];
	const result = await pool.query(query, values);
	return result.rows[0].id;
};

// Retrieve all doctors
const getAlldoctors = async (id) => {
	try {
		const query = `SELECT * FROM doctor`;
		const result = await pool.query(query);
		return result.rows;
	} catch (error) {
		console.error('Error in fetching doctors:', error);
		throw error;
	}
}

const getDoctorById = async (id) => {
	try {
		const query = 'SELECT * FROM doctor WHERE id = $1;';
		const result = await pool.query(query, [id]);
		return result.rows;
	} catch (error) {
		console.error('Error in fetching id:', error);
		throw error;
	}
}

const updateDoctor = async (id, updatedData) => {
	const { name, specialization, contact, appointment } = updatedData;
	const query = `
		UPDATE doctor
		SET name = $2, specialization = $3, contact = $4, appointment = $5
		WHERE id = $1`;
	const values = [id, name, specialization, contact, appointment];
	await pool.query(query, values);
};

const deleteDoctor = async (id) => {
	const deleteQuery = 'DELETE FROM doctor WHERE id = $1';
	const resetSequenceQuery = 'ALTER SEQUENCE doctor_id_seq RESTART WITH 1';

	try {
		await pool.query(deleteQuery, [id]);
		await pool.query(resetSequenceQuery);

		// You can log a message here to indicate the successful deletion and sequence reset
		console.log(`doctor with ID ${id} deleted, and the sequence is reset.`);
	} catch (error) {
		console.error('Error deleting doctor:', error);
		throw error; // Rethrow the error for proper error handling
	}
};

module.exports = {
	createDoctor,
	getAlldoctors,
	getDoctorById,
	updateDoctor,
	deleteDoctor,
};

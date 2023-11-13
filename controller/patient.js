const pool = require('./pool')
// Create a new patient
const createPatient = async (patientData) => {
	const { date, name, age, gender, contact, disease, doctor } = patientData;
	const query = `
    INSERT INTO patient (date, name, age, gender, contact, disease, doctor)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
  `;
	const values = [date, name, age, gender, contact, disease, doctor];
	const result = await pool.query(query, values);
	return result.rows[0].id;
};

// Retrieve all patients
const getAllPatients = async () => {
	try {
		const query = 'SELECT * FROM patient;';
		const result = await pool.query(query);
		return result.rows;
	} catch (error) {
		console.error('Error fetching patients:', error);
		throw error;
	}
};

const getPatientById = async (id) => {
	try {
		const query = 'SELECT * FROM patient WHERE id = $1;';
		const result = await pool.query(query, [id]);
		return result.rows;
	} catch (error) {
		console.error('Error in fetching id:', error);
		throw error;
	}
}

// Update a patient
const updatePatient = async (id, updatedData) => {
	const { date, name, age, gender, contact, disease, doctor } = updatedData;
	const query = `
    UPDATE patient
    SET date = $2, name = $3, age = $4, gender = $5, contact = $6, disease = $7, doctor = $8
	WHERE id = $1`;
	const values = [id, date, name, age, gender, contact, disease, doctor];
	await pool.query(query, values);
};

// Delete a patient
const deletePatient = async (id) => {
	const deleteQuery = 'DELETE FROM patient WHERE id = $1';
	const resetSequenceQuery = 'ALTER SEQUENCE patient_id_seq RESTART WITH 1'; // Replace 'patient_id_seq' with your actual sequence name

	try {
		await pool.query(deleteQuery, [id]);
		await pool.query(resetSequenceQuery);

		// You can log a message here to indicate the successful deletion and sequence reset
		console.log(`Patient with ID ${id} deleted, and the sequence is reset.`);
	} catch (error) {
		console.error('Error deleting patient:', error);
		throw error; // Rethrow the error for proper error handling
	}
};

module.exports = {
	createPatient,
	getAllPatients,
	getPatientById,
	updatePatient,
	deletePatient,
};

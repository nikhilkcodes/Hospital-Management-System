const pool = require('./pool');
// Retrieve all appointment
const getAllAppointment = async (id) => {
	try {
		const query = `SELECT * FROM appointment`;
		const result = await pool.query(query);
		return result.rows;
	} catch (error) {
		console.error('Error in fetching appointment:', error);
		throw error;
	}
}
// create an appointment
const createAppointment = async (appointmentData) => {
	const { patient_id, doctor_id, appointment_date } = appointmentData;
	const query = `INSERT INTO appointment (patient_id, doctor_id, appointment_date)
	VALUES ($1, $2, $3)
	RETURNING id;
	`;
	const values = [patient_id, doctor_id, appointment_date];
	const result = await pool.query(query, values);
	return result.rows[0].id;
};


const getAppointmentById = async (id) => {
	try {
		const query = 'SELECT * FROM appointment WHERE id = $1;';
		const result = await pool.query(query, [id]);
		return result.rows;
	} catch (error) {
		console.error('Error in fetching id:', error);
		throw error;
	}
}

const updateAppointment = async (id, updatedData) => {
	const { patient_id, doctor_id, appointment_date } = updatedData;
	const query = `
		UPDATE appointment
		SET patient_id = $2, doctor_id = $3, appointment_date = $4
		WHERE id = $1`;
	const values = [id, patient_id, doctor_id, appointment_date];
	await pool.query(query, values);
};

const deleteAppointment = async (id) => {
	const deleteQuery = 'DELETE FROM appointment WHERE id = $1';
	const resetSequenceQuery = 'ALTER SEQUENCE appointment_id_seq RESTART WITH 1';

	try {
		await pool.query(deleteQuery, [id]);
		await pool.query(resetSequenceQuery);

		// You can log a message here to indicate the successful deletion and sequence reset
		console.log(`appointment with ID ${id} deleted, and the sequence is reset.`);
	} catch (error) {
		console.error('Error deleting appointment:', error);
		throw error; // Rethrow the error for proper error handling
	}
};

module.exports = {
	createAppointment,
	getAllAppointment,
	getAppointmentById,
	updateAppointment,
	deleteAppointment,
};

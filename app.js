const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const pg = require('pg');
const user = require('./models/userModel');
require('dotenv').config();
const patient = require('./controller/patient');
const { log } = require('console');

const port = process.env.PORT;
const app = express();
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;

	user.findUser(username, password, (err, result) => {
		if (err) {
			return res.redirect('/');
		}
		if (result.rows.length === 1) {
			// Render the "dashboard.ejs" view
			res.render('home', { /* any data you want to pass to the view */ });
		} else {
			return res.redirect('/');
		}
	});
});

app.post('/signup', (req, res) => {
	const { email, newPassword, confirmPassword } = req.body;

	if (newPassword !== confirmPassword) {
		// Use res.send() to send a message to the client
		return res.send('New and old passwords do not match');
	}

	user.createUser(email, newPassword, (err, result) => {
		if (err) {
			return res.redirect('/');
		}
		res.redirect('/');
	});
});

// Retrieve all patients
app.get('/patient', async (req, res) => {
	const data = await patient.getAllPatients();
	res.render('patient', { data });
});

// Create a new patient
app.post('/patient', async (req, res) => {
	const patientData = req.body;
	const id = await patient.createPatient(patientData);
	res.redirect('/patient');
});

app.get('/edit/:id', async (req, res) => {
	// Retrieve data by ID or any other means
	const id = req.params.id;
	const data = await patient.getPatientById(id);
	//console.log(data);
	res.render('editPatient', { data });
});

app.get('/close', (req, res) => {
	res.redirect('/patient')
})

app.post('/edit/:id', async (req, res) => {
	//const id = parseInt(req.params.id, 10);
	//console.log(id);
	const data = req.body;
	console.log(data);
	try {
		await patient.updatePatient(data);
		res.redirect('/patient');
	} catch (error) {
		console.log('Error updating patient:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Delete a patient
app.get('/delete/:id', async (req, res) => {
	const id = req.params.id;
	try {
		await patient.deletePatient(id);
		res.redirect('/patient'); // Redirect to the patient list page after the delete
	} catch (error) {
		console.error('Error deleting patient:', error);
		res.status(500).send('Internal Server Error'); // Handle the error gracefully
	}
});


app.listen(port, () => {
	console.log(`Server is running on Port ${port}`);
});

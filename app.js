const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const pg = require('pg');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const { createUser, getUserByEmail, getUserById } = require('./models/userModel');
require('dotenv').config();
const patient = require('./controller/patient');
const doctor = require('./controller/doctor');
const appointment = require('./controller/appointment');
const pool = require('./controller/pool');
const { log } = require('console');
const bcrypt = require('bcrypt');

const port = process.env.PORT;
const app = express();
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/appointment', express.static(path.join(__dirname, 'public')));
app.use('/doctor', express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
}, async (email, password, done) => {
	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return done(null, false, { message: 'Incorrect email.' });
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			return done(null, false, { message: 'Incorrect password.' });
		}

		return done(null, user);
	} catch (error) {
		return done(error);
	}
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await getUserById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/home');
	}

	console.log('User is not authenticated');
	res.render('login');
});

app.post('/signup', async (req, res) => {
	const { email, password, confirmPassword } = req.body;
	console.log(email, password, confirmPassword);

	if (password !== confirmPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('/');
	}

	try {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			req.flash('error', 'Email is already in use. Please choose another.');
			return res.redirect('/');
		}

		const user = await createUser(email, password);
		req.flash('success', 'Account created successfully. You can now log in.');
		res.redirect('/');
	} catch (error) {
		console.error(error);
		req.flash('error', 'An error occurred. Please try again.');
		res.redirect('/');
	}
});

app.post('/',
	passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true,
	})
);

app.get('/home', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	const appointmentData = await appointment.getAllAppointment();
	const totalAppointment = appointmentData.length;
	const doctorData = await doctor.getAlldoctors();
	const totalDoctors = doctorData.length;
	const data = await patient.getAllPatients(); // for fetching total patient data
	const totalPatient = data.length;
	res.render('home', { totalPatient, totalDoctors, totalAppointment });
});

app.get('/logout', (req, res) => {
	// Using req.logout() with a callback function
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});
// Assuming you have some kind of error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});


/**Doctors ops*/
// retrieve all doctors
app.get('/doctor', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	const data = await doctor.getAlldoctors();
	const totalDoctors = data.length;
	res.render('doctor', { data, totalDoctors });
});
app.post('/doctor', async (req, res) => {
	const doctorData = req.body;
	const id = await doctor.createDoctor(doctorData);
	res.redirect('/doctor');
});

app.get('/doctor/edit/:id', async (req, res) => {
	const id = req.params.id;
	//console.log(id);
	const data = await doctor.getDoctorById(id);
	res.render('editDoctor', { data });
});
//update doctor
app.post('/doctor/edit/:id', async (req, res) => {
	const id = req.params.id;
	const updatedData = req.body;
	try {
		await doctor.updateDoctor(id, updatedData);
		res.redirect('/doctor');
	} catch (error) {
		console.log('Error updating doctor:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/doctor/close', (req, res) => {
	res.redirect('/doctor');
});


app.get('/doctor/delete/:id', async (req, res) => {
	const id = req.params.id;
	try {
		await doctor.deleteDoctor(id);
		res.redirect('/doctor');
	} catch (error) {
		console.error('Error deleting Doctor:', error);
		res.status(500).send('Internal Server Error');
	}
})

/** patients ops */
// Retrieve all patients
app.get('/patient', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	const data = await patient.getAllPatients();
	const totalPatient = data.length;
	res.render('patient', { data, totalPatient });
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
	const id = req.params.id;
	const updatedData = req.body;
	console.log(updatedData);
	try {
		await patient.updatePatient(id, updatedData);
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

/** Appointment ops */
// retrieve all appointments
app.get('/appointment', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	const data = await appointment.getAllAppointment();
	const totalAppointment = data.length;
	res.render('appointment', { data, totalAppointment });
});
app.post('/appointment', async (req, res) => {
	const appointmentData = req.body;
	const id = await appointment.createAppointment(appointmentData);
	res.redirect('/appointment');
});

app.get('/appointment/edit/:id', async (req, res) => {
	const id = req.params.id;
	//console.log(id)
	const data = await appointment.getAppointmentById(id);
	res.render('editAppointment', { data });
});
//update doctor
app.post('/appointment/edit/:id', async (req, res) => {
	const id = req.params.id;
	const updatedData = req.body;
	try {
		await appointment.updateAppointment(id, updatedData);
		res.redirect('/appointment');
	} catch (error) {
		console.log('Error updating appointment:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/appointment/close', (req, res) => {
	res.redirect('/appointment');
});
app.get('/appointment/delete/:id', async (req, res) => {
	const id = req.params.id;
	try {
		await appointment.deleteAppointment(id);
		res.redirect('/appointment');
	} catch (error) {
		console.error('Error deleting appointment:', error);
		res.status(500).send('Internal Server Error');
	}
})


app.listen(port, () => {
	console.log(`Server is running on Port ${port}`);
});

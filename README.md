<h4> <span> · </span> <a href="https://github.com/nikhilkcodes/Hospital-Management-System/blob/master/README.md"> Documentation </a> <span> · </span> <a href="https://github.com/nikhilkcodes/Hospital-Management-System/issues"> Report Bug </a> <span> · </span> <a href="https://github.com/nikhilkcodes/Hospital-Management-System/issues"> Request Feature </a> </h4>


# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
- [Contributing](#wave-contributing)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)


## :star2: About the Project
<details> <summary>Server</summary> <ul>
<li><a href="">Express.js</a></li>
</ul> </details>
<details> <summary>Database</summary> <ul>
<li><a href="">Postgres</a></li>
</ul> </details>

### :dart: Features
- Doctor Management
- Patient Management
- Appointment Management
- User Authentication


### :key: Environment Variables
To run this project, you will need to add the following environment variables to your .env file
`PORT=3000` 
`DB_USER=postgres`
`DB_HOST=localhost` 
`DB_NAME=hospital-management-system` 
`DB_PASSWORD=your_db_password`
`DB_PORT=5432`
`SECRET_KEY=your_secret_key`



## :toolbox: Getting Started

### :bangbang: Prerequisites

- Node.js<a href="https://nodejs.org/en/"> Here</a>
- npm
```bash
npm init
```
- pg admin<a href="https://www.pgadmin.org/"> Here</a>

## :toolbox: sql queries to create tables :
## Database setup

```sql
CREATE TABLE IF NOT EXISTS public.appointment
(
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    doctor_id INTEGER,
    appointment_date DATE
);

CREATE TABLE IF NOT EXISTS public.doctor
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    contact VARCHAR(255),
    appointment VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS public.patient
(
    id SERIAL PRIMARY KEY,
    date DATE,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    disease VARCHAR(255) NOT NULL,
    doctor VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT users_email_key UNIQUE (email)
);
```
### 🗝️ ERD model of database :

![hospital_management_erd](https://github.com/nikhilkcodes/Hospital-Management-System/assets/86142267/5bc044c2-025b-4048-85f5-29557697741b)


### :test_tube: Running Tests

Node test command
```bash
node app.js
```


### :running: Run Locally

Clone the project

```bash
https://github.com/nikhilkcodes/Hospital-Management-System.git
```
Go to the project
```bash
cd Hospital-Management-System
```
Install dependecies
```bash
npm install
```


## :wave: Contributing

<a href="https://github.com/nikhilkcodes/Hospital-Management-System.git/graphs/contributors"> <img src="https://contrib.rocks/image?repo=Louis3797/awesome-readme-template" /> </a>

Contributions are always welcome!

see `contributing.md` for ways to get started

## :grey_question: FAQ

- Do I need to create database tables before running the application?
- Yes. Before running the Hospital Management System, ensure that you have created the required database tables.
- How do i make database tables ?
- You have to create seprate database tables for with name "users" , "patient", "appointment" and "doctor"


## :warning: License

Distributed under the no License. See LICENSE.txt for more information.

## :handshake: Contact

Nikhil Singh - [@twitter_handle](https://twitter.com/mainikhilhun) - nikhilsingh.cc@gmail.com

Project Link: [https://github.com/nikhilkcodes/Hospital-Management-System.git](https://github.com/nikhilkcodes/Hospital-Management-System.git)

## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Express.js](https://expressjs.com/)
- [Passport.js](https://www.passportjs.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [pg pool](https://node-postgres.com/apis/pool)

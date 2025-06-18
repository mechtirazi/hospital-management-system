const express = require('express');
const axios = require('axios');
const https = require('https');
const methodOverride = require('method-override');


const cors = require('cors');
const path = require('path');

const app = express();
app.use(methodOverride('_method')); // Activates the method override feature
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submission

const port = 3000;

app.use(cors());

// Set up the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Ensure correct path to views


app.get('/acceuil', (req, res) => {
    res.render('accueil'); // Renders the login.ejs file
  });
// Default route for the root path ('/')
app.get('/', (req, res) => {
    res.render('Login');
});
  
  // Route for handling login submission
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(password,"AAAAAAAAAAAAAAAAAAAAA");

    try {
      // Fetch user data from the external API
      const response = await axios.get('https://localhost:7071/api/users', { httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
      const users = response.data; // Array of users
  
      // Find the user by email
      const user = users.find(user => user.email === email);
      //:dima ma t5demch 
  
      if (!user || user.passwordHash !== password) {
        // If user doesn't exist or password is incorrect
        console.log(user.passwordHash,password)
        return res.render('Login', { errorMessage: 'Incorrect email or password. Please try again.' });
      }
  
      // Redirect to the home page after successful login
      res.redirect('/acceuil');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

// Route to fetch and display the list of doctors from external API
const MedecinsRouter=require("./routes/Medecins.Router")
app.use('/api/medecins',MedecinsRouter);
//Rendez-Vous
const RendezVous=require("./routes/RendezVous.Router")
app.use('/api/RendezVous',RendezVous)
// Patient
const PatientRouter=require("./routes/Patient.router")
app.use('/api/patient',PatientRouter)
const ExamenRouter=require("./routes/Examens.Router")
app.use('/api/examen',ExamenRouter)

app.get('/notification', (req, res) => {
    res.render('notification');
});
app.get('/Listemploye', (req, res) => {
    res.render('Listemploye');
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

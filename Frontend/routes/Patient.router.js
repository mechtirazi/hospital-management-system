var express = require('express');
var app = express(); // Use express() instead of express.Router()
const axios = require('axios');
const https = require('https');
const router = express.Router();

router.get('/patients', async (req, res) => {
    try {
        const response = await axios.get('https://localhost:7071/api/Patients', {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const patients = response.data;
        console.log(patients);

        res.render('patients', { patients });
    } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
        res.status(500).send('Erreur lors de la récupération des patients');
    }
});
router.get('/add-patient', (req, res) => {
    res.render('add-patient'); // Renders the EJS form
});
// Route for adding a new exam for a specific patient




router.post('/add-patients', async (req, res) => {
    try {
        const { nom, prenom, dateNaissance, email, telephone, adresse } = req.body;

        // Log the incoming data
        console.log('Received patient data:', { nom, prenom, dateNaissance, email, telephone, adresse });

        // Step 1: Add the patient with httpsAgent that ignores SSL errors
        const response = await axios.post('https://localhost:7071/api/Patients', {
            nom,
            prenom,
            dateNaissance,
            email,
            telephone,
            adresse
        }, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL verification
        });

        // Log the response from the backend
        console.log('Patient added, response:', response.data);

        const patientId = response.data.id;  // Get the patient's ID from the response

        // Log the patient ID
        console.log('Patient ID:', patientId);

        // Step 2: Redirect to the "Ajouter Examen" page with the patient ID
        res.render('ajouter-examen', { patientId });


    } catch (error) {
        // Log any errors
        console.error('Error adding patient:', error);
        res.status(500).send('Error adding patient');
    }
});


























module.exports = router;
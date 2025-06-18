var express = require('express');
var app = express(); // Use express() instead of express.Router()
const axios = require('axios');
const https = require('https');
const router = express.Router();
router.get('/Listexamenspossible', async (req, res) => {

    const examensResponse = await axios.get(`https://localhost:7071/api/Examens/Patient?patientId=${patientId}`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
    });

    
    res.render('examens', { examens: examensResponse.data 
    });
});
router.get('/ajouter-examen', async (req, res) => {
    res.render('ajouter-examen', );
});
//REndez-Vous







router.get('/examens', async (req, res) => {
    const { patientId } = req.query; 
    console.log('Patient ID reçu:', patientId); // 🔍 Vérifier si patientId est bien récupéré

    if (!patientId) {
        return res.status(400).send('Erreur: patientId est requis');
    }

    try {
        const patientResponse = await axios.get(`https://localhost:7071/api/Patients/${patientId}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const examensResponse = await axios.get(`https://localhost:7071/api/Examens/Patient?patientId=${patientId}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
        });

        console.log('Examens récupérés:', examensResponse.data);
        
        res.render('examens', { 
            patient: patientResponse.data, 
            examens: examensResponse.data 
        });

    } catch (error) {
        console.error('Erreur lors du chargement des examens:', error.response ? error.response.data : error.message);
        res.status(500).send('Erreur lors du chargement des examens');
    }
});
router.get('/ajouter-examen', async (req, res) => {
    const { patientId } = req.query;  // ✅ Get patientId from the URL query

    if (!patientId) {
        return res.status(400).send('Erreur: patientId est requis');  // 🛑 Stop if patientId is missing
    }

    try {
        // (Optional) Fetch patient details
        const patientResponse = await axios.get(`https://localhost:7071/api/Patients/${patientId}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
        });

        console.log('Patient ID:', patientId);  // ✅ Debugging log

        // ✅ Render the EJS page and pass patientId
        res.render('ajouter-examen', { patientId });
    } catch (error) {
        console.error('Erreur lors du chargement du patient:', error);
        res.status(500).send('Erreur lors du chargement du patient');
    }
});


router.get('/ajouter-examen-de-patient', async (req, res) => {
    const { patientId } = req.query;

    if (!patientId) {
        return res.status(400).send('Erreur: patientId est requis');
    }

    try {
        // Fetch patient details based on the patientId
        const patientResponse = await axios.get(`https://localhost:7071/api/Patients/${patientId}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL validation
        });

        const patient = patientResponse.data;

        // Render the page with the patient's details
        res.render('ajouter-examen', { patientId: patient.id, patientName: `${patient.nom} ${patient.prenom}` });
    } catch (error) {
        console.error('Erreur lors du chargement du patient:', error);
        res.status(500).send('Erreur lors du chargement du patient');
    }
});

// POST route for adding the exam details
router.post('/ajouter-examen-de-patient', async (req, res) => {
    const { PatientId, TypeExamen, DateExamen, Resultat } = req.body;

    console.log('Données envoyées pour l’examen:', { PatientId, TypeExamen, DateExamen, Resultat });

    try {
        const response = await axios.post(`https://localhost:7071/api/Examens`, {
            PatientId: PatientId,
            TypeExamen: TypeExamen,
            DateExamen: DateExamen,
            Resultat: Resultat
        }, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL validation
        });

        console.log('Examen ajouté:', response.data);
        res.redirect(`/examens?patientId=${PatientId}`); // Redirect to the exams page for the patient
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’examen:', error.response ? error.response.data : error);
        res.status(500).send('Erreur lors de l’ajout de l’examen');
    }
});


router.post('/ajouter-examen', async (req, res) => {
    const { PatientId, TypeExamen, DateExamen, Resultat } = req.body;

    console.log('Données envoyées pour l’examen:', { PatientId, TypeExamen, DateExamen, Resultat });

    try {
        const response = await axios.post(`https://localhost:7071/api/Examens`, {
            PatientId: PatientId,
            TypeExamen: TypeExamen,
            DateExamen: DateExamen,
            Resultat: Resultat
        }, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        console.log('Examen ajouté:', response.data);
        res.redirect(`/api/examen/examens?patientId=${PatientId}`);
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’examen:', error.response ? error.response.data : error);
        res.status(500).send('Erreur lors de l’ajout de l’examen');
    }
});
router.get('/listExamen', async (req, res) => {
    try {
        const response = await axios.get('https://localhost:7071/api/Examens', {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const exams = response.data;

        // Group exams by typeExamen
        const groupedExams = exams.reduce((acc, exam) => {
            if (!acc[exam.typeExamen]) {
                acc[exam.typeExamen] = [];
            }
            acc[exam.typeExamen].push(exam);
            return acc;
        }, {});

        // Render the exams page with grouped exams (only unique exam types)
        res.render('ListExamenpossible', { groupedExams });
    } catch (error) {
        console.error('Erreur lors du chargement des examens:', error);
        res.status(500).send('Erreur lors du chargement des examens');
    }
});
module.exports = router;
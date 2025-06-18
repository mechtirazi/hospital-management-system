var express = require('express');
var app = express(); // Use express() instead of express.Router()
const methodOverride = require('method-override'); // 🔥 Ajoute ceci en haut du fichier
const axios = require('axios');
const https = require('https');
const router = express.Router();
app.use(methodOverride('_method')); // Active les méthodes PUT et DELETE
app.use(express.urlencoded({ extended: true })); // Permet de récupérer les données des formulaires
app.use(express.json()); // Permet de traiter les requêtes JSON


router.get('/rendezvous', async (req, res) => {
    try {
        // Fetch data from the external API
        const response = await axios.get('https://localhost:7071/api/RendezVous', { 
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
        });

        const rendezvous = response.data;

        // Log the data received to ensure it's being fetched
        console.log('API Response:', rendezvous);

        // Render the 'rendezvous' view and pass data
        res.render('rendezvous', { rendezvous });

    } catch (error) {
        console.error('Error fetching rendezvous from API:', error);
        res.status(500).send('Error fetching rendezvous');
    }
});
router.post("/rendezvous", async (req, res) => {
    try {
        const { nomPatient, nomMedecin, dateRendezVous } = req.body;

        // Validate request data
        if (!nomPatient || !nomMedecin || !dateRendezVous) {
            return res.status(400).send("Tous les champs sont requis.");
        }
        const rendezvousData = {
            nomPatient: nomPatient,
            nomMedecin: nomMedecin,
            dateRendezVous: dateRendezVous
        };

        // Send data to the external API
        const response = await axios.post(
           'https://localhost:7071/api/RendezVous',
           rendezvousData,
            { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
        );

        console.log("Nouveau rendez-vous ajouté:", response.data);

        // Redirect back to the appointments page after successful creation
        res.redirect("/api/RendezVous/rendezvous");
    } catch (error) {
        console.error("Erreur lors de l'ajout du rendez-vous:", error);
        res.status(500).send("Erreur lors de l'ajout du rendez-vous");
    }
});
// Route to view details of a specific appointment
router.get('/viewrendezvous/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch appointment details using the provided ID
        const response = await axios.get(`https://localhost:7071/api/RendezVous/${id}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
        });

        console.log('Fetched RendezVous:', response.data);  // Log the response to check the data

        const rendezvous = response.data;

        // Render the 'viewrendezvous' view with the fetched appointment data
        res.render('viewrendezvous', { rendezvous });

    } catch (error) {
        console.error('Error fetching rendezvous details:', error);
        res.status(500).send('Error fetching rendezvous details');
    }
});
router.delete('/rendezvous/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await axios.delete(`https://localhost:7071/api/RendezVous/${id}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        console.log(`Rendez-vous ${id} supprimé`);
        res.redirect('/api/RendezVous//rendezvous');
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).send("Erreur lors de la suppression du rendez-vous");
    }
});

router.put('/rendezvous/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;
    
        // Afficher les données reçues pour la modification
        console.log('Données reçues pour la modification:', updatedData);
    
        // Vérification des champs requis
        if (!updatedData.nomPatient || !updatedData.nomMedecin || !updatedData.dateRendezVous) {
            console.log("Erreur: Tous les champs sont requis.");
            return res.status(400).send("Tous les champs sont requis.");
        }
    
        // Conversion de la date
        updatedData.dateRendezVous = new Date(updatedData.dateRendezVous + ':00Z'); // Ajout des secondes et du fuseau horaire

        // Requête PUT à l'API externe
        const response = await axios.put(`https://localhost:7071/api/RendezVous/${id}`, updatedData, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
    
        console.log(`Rendez-vous ${id} modifié:`, response.data);
        res.redirect('/api/RendezVous/rendezvous');
    } catch (error) {
        console.error("Erreur lors de la modification du rendez-vous:", error.response ? error.response.data : error.message);
        res.status(500).send("Erreur lors de la modification du rendez-vous");
    }
});





module.exports = router;
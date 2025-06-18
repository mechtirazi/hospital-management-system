var express = require('express');

var app = express(); // Use express() instead of express.Router()

const axios = require('axios');
const https = require('https');
const router = express.Router();
const agent = new https.Agent({  
    rejectUnauthorized: false  // This bypasses SSL certificate verification (use only for local/dev environment)
  });

// Define routes like router.get(), router.post(), etc.



router.get('/Listmedecins', async (req, res) => {
    try {
        // Fetch data from the external API
        const response = await axios.get('https://localhost:7071/api/Medecins', { httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        const medecins = response.data;

        // Log the data received to ensure it's being fetched
        console.log('API Response:', medecins);

        // Render the 'medecins' view and pass data
        res.render('Listmedecins', { medecins });

    } catch (error) {
        console.error('Error fetching medecins from API:', error);
        res.status(500).send('Error fetching medecins');
    }
});
router.delete('/deletemedecin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.delete(`https://localhost:7071/api/Medecins/${id}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        console.log(`Médecin avec ID ${id} supprimé.`);
        res.status(200).json({ message: 'Médecin supprimé avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression du médecin:', error.response ? error.response.data : error.message);
        res.status(500).send('Erreur lors de la suppression du médecin');
    }
});
router.get("/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`https://localhost:7071/api/Medecins/edit/${id}`, {
        httpsAgent: new (require('https').Agent)({  
          rejectUnauthorized: false
        })
      });
      
      console.log("Fetching medecin with ID:", id);

      res.render("edit", { medecin: response.data });
    } catch (error) {
      console.error("Error fetching medecin for edit:", error);
      res.status(500).send("Error fetching medecin for edit");
    }
  });
  
  // Update a medecin
  // Update a medecin
  router.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { nom, specialite, email, adresse } = req.body;

    console.log("Received PUT request for ID:", id);
    console.log("Request body:", req.body);

    if (!nom || !specialite || !email || !adresse) {
        console.error("Missing fields:", req.body);
        return res.status(400).json({ error: "Données invalides." });
    }

    try {
        // Attempt to call the C# API directly and log the response
        console.log(`Sending PUT request to C# API: http://localhost:7071/api/medecins/edit/${id}`);
        
        const response = await axios.put(`https://localhost:7071/api/Medecins/edit/${id}`, {
            nom,
            specialite,
            email,
            adresse
        },  {
            httpsAgent: agent, // Add the agent to bypass SSL check
            headers: { "Content-Type": "application/json" },
            timeout: 20000
        });

        console.log("C# API response:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error during C# API call:", error.message);
        if (error.response) {
            console.error("C# API response error:", error.response.data);
        }
        res.status(error.response?.status || 500).json({
            error: "Erreur lors de la mise à jour du médecin",
            details: error.response?.data || error.message
        });
    }
});



router.get('/ajouteMedecin', (req, res) => {
    res.render('ajouterMedecin');  // Renders the ajouterMedecin.ejs view
});
router.post('/ajouteMedecin', async (req, res) => {
    const { nom, specialite, email, adresse } = req.body;

    // Log the body to verify data is coming through correctly
    console.log('Request body:', req.body);

    try {
        const response = await axios.post('https://localhost:7071/api/Medecins', {
            nom, 
            specialite, 
            email, 
            adresse 
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false  // Ignore certificate validation for development
            })
        });

        console.log("Médecin ajouté avec succès:", response.data);
        res.redirect('/api/medecins/Listmedecins');
    } catch (error) {
        console.error("Erreur lors de l'ajout du médecin:", error.response?.data || error.message);
        res.status(500).json({ error: "Erreur lors de l'ajout du médecin", details: error.response?.data });
    }
});
router.get('/view/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const response = await axios.get(`https://localhost:7071/api/Medecins/${code}`,{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        console.log('Fetched Medecin:', response.data);  // Log the response to check the data
        const medecin = response.data;
        res.render('viewmedecin', { medecin });
    } catch (error) {
        console.error('Error fetching medecin details:', error);
        res.status(500).send('Error fetching medecin details');
    }
});
module.exports = router;
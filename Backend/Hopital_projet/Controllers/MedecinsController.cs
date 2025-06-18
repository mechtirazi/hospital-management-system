using Microsoft.AspNetCore.Mvc;
using Hopital_projet.Models;

namespace Hopital_projet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedecinsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the database context
        public MedecinsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/medecins
        [HttpGet]
        public IActionResult Index()
        {
            var medecins = _context.Medecins.ToList(); // Fetch list of doctors from DB
            return Ok(medecins); // Return the list as a JSON response
        }

        // POST: api/medecins
        [HttpPost]
        public IActionResult Ajoutemedicins([FromBody] Medecin medecin)
        {
            if (medecin == null)
            {
                return BadRequest("Medecin data is required."); // Return 400 if data is invalid
            }

            _context.Medecins.Add(medecin);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Details), new { id = medecin.Code }, medecin); // 201 Created response
        }

        // DELETE: api/medecins/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var medecin = _context.Medecins.FirstOrDefault(m => m.Code == id);
            if (medecin == null)
            {
                return NotFound(); // Return 404 if Medecin is not found
            }

            _context.Medecins.Remove(medecin);
            _context.SaveChanges();

            return NoContent(); // Return 204 No Content on successful deletion
        }

        // GET: api/medecins/{id}
        [HttpGet("{id}")]
        public IActionResult Details(int id)
        {
            var medecin = _context.Medecins.FirstOrDefault(m => m.Code == id);
            if (medecin == null)
            {
                return NotFound(); // Return 404 if the Medecin is not found
            }
            return Ok(medecin); // Return the Medecin data as JSON
        }

        // GET: api/medecins/edit/{id}
        [HttpGet("edit/{id}")]
        public IActionResult Modifier(int id)
        {
            var medecin = _context.Medecins.FirstOrDefault(m => m.Code == id);
            if (medecin == null)
            {
                return NotFound(); // Return 404 if the Medecin is not found
            }
            return Ok(medecin); // Return the Medecin data to edit
        }

        // POST: api/medecins/edit/{id}
        // PUT: api/medecins/edit/{id}
        [HttpPut("edit/{id}")]
        public IActionResult Modification(int id, [FromBody] Medecin medecin)
        {
            if (medecin == null)
            {
                return BadRequest("Données du médecin invalides.");
            }

            var existingMedecin = _context.Medecins.Find(id);
            if (existingMedecin == null)
            {
                return NotFound("Médecin introuvable.");
            }

            try
            {
                existingMedecin.Nom = medecin.Nom;
                existingMedecin.Specialite = medecin.Specialite;
                existingMedecin.Email = medecin.Email;
                existingMedecin.adresse = medecin.adresse; // Correction de la casse

                _context.SaveChanges();

                return Ok(existingMedecin); // Retourner les données mises à jour
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur lors de la mise à jour du médecin.", details = ex.Message });
            }
        }

    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Hopital_projet.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hopital_projet.Model;

namespace Hopital_projet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamensController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamensController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Examens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Examen>>> GetExamens()
        {
            return await _context.Examens.ToListAsync();
        }

        // GET: api/Examens/Patient/{id}
        [HttpGet("Patient")]
        public IActionResult GetExamensByPatient([FromQuery] int patientId)
        {
            var examens = _context.Examens.Where(e => e.PatientId == patientId).ToList();
            if (examens == null || !examens.Any())
            {
                return NotFound("Aucun examen trouvé pour ce patient.");
            }
            return Ok(examens);
        }


        // POST: api/Examens
        [HttpPost]
        [HttpPost]
        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<Examen>> PostExamen([FromBody] Examen examen)
        {
            if (examen == null)
            {
                return BadRequest("Examen data is invalid.");
            }

            // Check for required fields: Resultat, TypeExamen
            if (string.IsNullOrEmpty(examen.Resultat) || string.IsNullOrEmpty(examen.TypeExamen))
            {
                return BadRequest("Required fields are missing (Resultat, TypeExamen).");
            }

            // Optional: Ensure patientId is provided and valid (if needed for linking the examen)
            if (examen.PatientId == 0)
            {
                return BadRequest("PatientId is required and cannot be 0.");
            }

            // Optional: Ensure the Patient exists (if applicable in your case)
            var patient = await _context.Patients.FindAsync(examen.PatientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Add Examen to the database
            _context.Examens.Add(examen);
            await _context.SaveChangesAsync();

            // Return created examen with a link to its details
            return CreatedAtAction(nameof(GetExamensByPatient), new { id = examen.Id }, examen);
        }




        // PUT: api/Examens/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExamen(int id, Examen examen)
        {
            if (id != examen.Id)
                return BadRequest();

            _context.Entry(examen).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Examens/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamen(int id)
        {
            var examen = await _context.Examens.FindAsync(id);
            if (examen == null)
                return NotFound();

            _context.Examens.Remove(examen);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

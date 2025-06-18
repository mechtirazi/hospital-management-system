using Hopital_projet.Model;
using Hopital_projet.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hopital_projet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RendezVousController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RendezVousController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les rendez-vous
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RendezVous>>> GetRendezVous()
        {
            return await _context.RendezVous.ToListAsync();
        }

        // Récupérer un rendez-vous par son Id
        [HttpGet("{id}")]
        public async Task<ActionResult<RendezVous>> GetRendezVous(int id)
        {
            var rendezVous = await _context.RendezVous.FindAsync(id);

            if (rendezVous == null)
            {
                return NotFound();
            }

            return rendezVous;
        }

        // Ajouter un nouveau rendez-vous
        [HttpPost]
        public async Task<ActionResult<RendezVous>> PostRendezVous(RendezVous rendezVous)
        {
            _context.RendezVous.Add(rendezVous);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRendezVous", new { id = rendezVous.Id }, rendezVous);
        }

        // Modifier un rendez-vous existant
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRendezVous(int id, RendezVous rendezVous)
        {
            if (id != rendezVous.Id)
            {
                return BadRequest();
            }

            _context.Entry(rendezVous).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RendezVousExiste(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Supprimer un rendez-vous
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRendezVous(int id)
        {
            var rendezVous = await _context.RendezVous.FindAsync(id);
            if (rendezVous == null)
            {
                return NotFound();
            }

            _context.RendezVous.Remove(rendezVous);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RendezVousExiste(int id)
        {
            return _context.RendezVous.Any(e => e.Id == id);
        }
    }
}

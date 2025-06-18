using Microsoft.EntityFrameworkCore;
using Hopital_projet.Models;
using Hopital_projet.Model;

namespace Hopital_projet.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Medecin> Medecins { get; set; }
        public DbSet<RendezVous> RendezVous { get; set; }
        public DbSet<Examen> Examens { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<User> Users { get; set; } 


    }
}

using System.ComponentModel.DataAnnotations;

namespace Hopital_projet.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } // Stocke le mot de passe haché

        [Required]
        public string Role { get; set; } // Admin, Médecin, Patient, etc.
    }
}

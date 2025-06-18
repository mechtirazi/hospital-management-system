using System;
using System.ComponentModel.DataAnnotations;

namespace Hopital_projet.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Nom { get; set; }

        [Required]
        [StringLength(255)]
        public string Prenom { get; set; }

        [Required]
        public DateTime DateNaissance { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Telephone { get; set; }
        public string Adresse { get; set; }
    }
}

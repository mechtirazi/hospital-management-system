using System;
using System.ComponentModel.DataAnnotations;

namespace Hopital_projet.Model
{
    public class Examen
    {
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }  // ID du patient, pas une référence directe

        [Required]
        [StringLength(255)]
        public string TypeExamen { get; set; }

        [Required]
        public DateTime DateExamen { get; set; }

        public string Resultat { get; set; }
    }
}

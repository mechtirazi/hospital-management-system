using System.ComponentModel.DataAnnotations;

namespace Hopital_projet.Models
{
    public class Medecin
    {
        [Key]
        public int Code  { get; set; }
        public string Nom { get; set; }
        public string Specialite { get; set; }
        public string Email { get; set; }
        public string adresse { get; set; }
    }

}

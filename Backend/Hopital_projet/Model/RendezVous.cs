namespace Hopital_projet.Model
{

        public class RendezVous
        {
            public int Id { get; set; } // Identifiant unique
            public string NomPatient { get; set; } // Nom du patient
            public string NomMedecin { get; set; } // Nom du médecin
            public DateTime DateRendezVous { get; set; } // Date et heure du rendez-vous
        }
    

}

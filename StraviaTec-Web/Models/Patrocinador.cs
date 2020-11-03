using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Patrocinador
    {
        public Patrocinador()
        {
            PatrocinadorEvento = new HashSet<PatrocinadorEvento>();
        }

        public int Id { get; set; }
        public string NombreComercial { get; set; }
        public string NombreRepresentante { get; set; }
        public string TelRepresentante { get; set; }
        public string Logo { get; set; }

        public virtual ICollection<PatrocinadorEvento> PatrocinadorEvento { get; set; }
    }
}

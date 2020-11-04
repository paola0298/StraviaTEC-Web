using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class PatrocinadorEvento
    {
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public int IdPatrocinador { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Patrocinador IdPatrocinadorNavigation { get; set; }
    }
}

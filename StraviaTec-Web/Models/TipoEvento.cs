using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class TipoEvento
    {
        public TipoEvento()
        {
            Evento = new HashSet<Evento>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<Evento> Evento { get; set; }
    }
}

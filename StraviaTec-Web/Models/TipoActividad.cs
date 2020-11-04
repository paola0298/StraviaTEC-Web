using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class TipoActividad
    {
        public TipoActividad()
        {
            Actividad = new HashSet<Actividad>();
            Evento = new HashSet<Evento>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<Actividad> Actividad { get; set; }
        public virtual ICollection<Evento> Evento { get; set; }
    }
}

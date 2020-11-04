using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Reto
    {
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public int IdTipoReto { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public decimal Objetivo { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual TipoReto IdTipoRetoNavigation { get; set; }
    }
}

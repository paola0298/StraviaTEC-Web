using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class TipoReto
    {
        public TipoReto()
        {
            Reto = new HashSet<Reto>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<Reto> Reto { get; set; }
    }
}

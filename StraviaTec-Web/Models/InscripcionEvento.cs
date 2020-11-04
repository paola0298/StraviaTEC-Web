using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class InscripcionEvento
    {
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public string IdUsuario { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}

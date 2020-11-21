using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class InscripcionEvento
    {
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public string IdUsuario { get; set; }
        public string Estado { get; set; }
        public decimal? Progreso { get; set; }
        public string ComprobantePago { get; set; }
        public int? IdCategoriaCarrera { get; set; }

        public virtual CategoriaCarrera IdCategoriaCarreraNavigation { get; set; }
        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class CategoriaCarrera
    {
        public CategoriaCarrera()
        {
            InscripcionEvento = new HashSet<InscripcionEvento>();
        }

        public int Id { get; set; }
        public int IdCarrera { get; set; }
        public int IdCategoria { get; set; }

        public virtual Carrera IdCarreraNavigation { get; set; }
        public virtual Categoria IdCategoriaNavigation { get; set; }
        public virtual ICollection<InscripcionEvento> InscripcionEvento { get; set; }
    }
}

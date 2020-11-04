using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Categoria
    {
        public Categoria()
        {
            CategoriaCarrera = new HashSet<CategoriaCarrera>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int? EdadMin { get; set; }
        public int? EdadMax { get; set; }

        public virtual ICollection<CategoriaCarrera> CategoriaCarrera { get; set; }
    }
}

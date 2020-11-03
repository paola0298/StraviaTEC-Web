using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class UsuarioAmigo
    {
        public int Id { get; set; }
        public string IdUsuario { get; set; }
        public string IdAmigo { get; set; }
        public DateTime FechaAmigos { get; set; }

        public virtual Usuario IdAmigoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}

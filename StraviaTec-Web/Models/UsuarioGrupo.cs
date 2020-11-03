using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class UsuarioGrupo
    {
        public int Id { get; set; }
        public int IdGrupo { get; set; }
        public string IdUsuario { get; set; }

        public virtual Grupo IdGrupoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}

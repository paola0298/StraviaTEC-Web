using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Grupo
    {
        public Grupo()
        {
            EventoGrupo = new HashSet<EventoGrupo>();
            UsuarioGrupo = new HashSet<UsuarioGrupo>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string IdAdmin { get; set; }

        public virtual Usuario IdAdminNavigation { get; set; }
        public virtual ICollection<EventoGrupo> EventoGrupo { get; set; }
        public virtual ICollection<UsuarioGrupo> UsuarioGrupo { get; set; }
    }
}

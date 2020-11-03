using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class EventoGrupo
    {
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public int IdGrupo { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Grupo IdGrupoNavigation { get; set; }
    }
}

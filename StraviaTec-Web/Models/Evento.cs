using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Evento
    {
        public Evento()
        {
            Actividad = new HashSet<Actividad>();
            Carrera = new HashSet<Carrera>();
            EventoGrupo = new HashSet<EventoGrupo>();
            InscripcionEvento = new HashSet<InscripcionEvento>();
            PatrocinadorEvento = new HashSet<PatrocinadorEvento>();
            Reto = new HashSet<Reto>();
        }

        public int Id { get; set; }
        public int IdTipoEvento { get; set; }
        public string Nombre { get; set; }
        public bool EsPrivado { get; set; }
        public int IdTipoActividad { get; set; }

        public virtual TipoActividad IdTipoActividadNavigation { get; set; }
        public virtual TipoEvento IdTipoEventoNavigation { get; set; }
        public virtual ICollection<Actividad> Actividad { get; set; }
        public virtual ICollection<Carrera> Carrera { get; set; }
        public virtual ICollection<EventoGrupo> EventoGrupo { get; set; }
        public virtual ICollection<InscripcionEvento> InscripcionEvento { get; set; }
        public virtual ICollection<PatrocinadorEvento> PatrocinadorEvento { get; set; }
        public virtual ICollection<Reto> Reto { get; set; }
    }
}

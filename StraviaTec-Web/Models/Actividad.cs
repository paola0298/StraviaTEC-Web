using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Actividad
    {
        public int Id { get; set; }
        public string IdUsuario { get; set; }
        public int IdTipoActividad { get; set; }
        public int IdRecorrido { get; set; }
        public decimal Duracion { get; set; }
        public decimal Kilometros { get; set; }
        public bool EsEvento { get; set; }
        public int IdEvento { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Recorrido IdRecorridoNavigation { get; set; }
        public virtual TipoActividad IdTipoActividadNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}

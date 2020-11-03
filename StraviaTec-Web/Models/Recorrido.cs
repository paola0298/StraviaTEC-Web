using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Recorrido
    {
        public Recorrido()
        {
            Actividad = new HashSet<Actividad>();
            Carrera = new HashSet<Carrera>();
            Punto = new HashSet<Punto>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaHora { get; set; }

        public virtual ICollection<Actividad> Actividad { get; set; }
        public virtual ICollection<Carrera> Carrera { get; set; }
        public virtual ICollection<Punto> Punto { get; set; }
    }
}

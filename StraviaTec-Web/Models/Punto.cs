using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Punto
    {
        public int Id { get; set; }
        public int IdRecorrido { get; set; }
        public int Segmento { get; set; }
        public int Orden { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public DateTime Tiempo { get; set; }
        public int Elevacion { get; set; }

        public virtual Recorrido IdRecorridoNavigation { get; set; }
    }
}

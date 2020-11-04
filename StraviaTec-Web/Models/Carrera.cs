using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Carrera
    {
        public Carrera()
        {
            CategoriaCarrera = new HashSet<CategoriaCarrera>();
            CuentaBancaria = new HashSet<CuentaBancaria>();
        }

        public int Id { get; set; }
        public int IdRecorrido { get; set; }
        public int IdEvento { get; set; }
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Costo { get; set; }

        public virtual Evento IdEventoNavigation { get; set; }
        public virtual Recorrido IdRecorridoNavigation { get; set; }
        public virtual ICollection<CategoriaCarrera> CategoriaCarrera { get; set; }
        public virtual ICollection<CuentaBancaria> CuentaBancaria { get; set; }
    }
}

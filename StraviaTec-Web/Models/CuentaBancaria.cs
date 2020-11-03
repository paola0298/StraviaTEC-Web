using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class CuentaBancaria
    {
        public int Id { get; set; }
        public int IdCarrera { get; set; }
        public string Nombre { get; set; }

        public virtual Carrera IdCarreraNavigation { get; set; }
    }
}

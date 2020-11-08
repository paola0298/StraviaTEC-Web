using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models.Requests
{
    public class CarreraInfo
    {
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Costo { get; set; }
        public int TipoActividad { get; set; }
        public bool EsPrivado { get; set; }
        public string ArchivoRecorrido { get; set; }

        public List<int> Patrocinadores { get; set; }
        public List<string> CuentasBancarias { get; set; }
        public List<int> Categorias { get; set; }

    }
}
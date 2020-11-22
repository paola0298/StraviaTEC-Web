using System;

namespace StraviaTec_Web.Models.Requests
{
    public class InfoActividad
    {
        public string User { get; set; }
        public string Nombre { get; set; }
        public int IdTipoActividad { get; set; }
        public string Recorrido { get; set; }
        public DateTime Fecha { get; set; }
        public string Hora { get; set; }
        public decimal Duracion { get; set; }
        public decimal Kilometros { get; set; }
        public bool EsEvento { get; set; }
        public string TipoEvento { get; set; }
        public int? IdEvento { get; set; }
    }
}
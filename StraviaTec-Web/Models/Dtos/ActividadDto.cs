using System;

namespace StraviaTec_Web.Models.Dtos
{
    public class ActividadDto
    {
        public int Id { get; set; }
        public string IdUsuario { get; set; }
        public int IdTipoActividad { get; set; }
        public int IdRecorrido { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Duracion { get; set; }
        public decimal Kilometros { get; set; }
        public bool EsEvento { get; set; }
        public int? IdEvento { get; set; }

        //De evento
        public string Nombre { get; set; }
    }
}
using System.Collections.Generic;

namespace StraviaTec_Web.Models.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public int IdTipoEvento { get; set; }
        public string Nombre { get; set; }
        public bool EsPrivado { get; set; }
        public int IdtipoActividad { get; set; }
        public ICollection<PatrocinadorDto> PatrocinadorEvento { get; set; }
    }
}
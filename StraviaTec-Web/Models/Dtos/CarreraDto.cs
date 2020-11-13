
using System;
namespace StraviaTec_Web.Models.Dtos
{
    public partial class CarreraDto
    {
        public int Id { get; set; }
        public int IdRecorrido { get; set; }
        public int IdEvento { get; set; }
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Costo { get; set; }
    }
}

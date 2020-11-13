
using System;
using System.Collections;
using System.Collections.Generic;

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
        public bool EsPrivado { get; set; }
        public int IdTipoActividad { get; set; }

        public ICollection<CategoriaCarreraDto> CategoriaCarrera { get; set; }
        public ICollection<CuentaBancariaDto> CuentaBancaria { get; set; }
        public ICollection<PatrocinadorEventoDto> PatrocinadorEvento { get; set; }
        public ICollection<EventoGrupoDto> EventoGrupo { get; set; }
    }
}
